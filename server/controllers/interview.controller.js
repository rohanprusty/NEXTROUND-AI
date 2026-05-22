import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }
    const filepath = req.file.path

    const fileBuffer = await fs.promises.readFile(filepath)
    const uint8Array = new Uint8Array(fileBuffer)

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map(item => item.str).join(" ");
      resumeText += pageText + "\n";
    }


    resumeText = resumeText
      .replace(/\s+/g, " ")
      .trim();

    const messages = [
      {
        role: "system",
        content: `
Extract structured data from resume.

Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`
      },
      {
        role: "user",
        content: resumeText
      }
    ];


    const aiResponse = await askAi(messages)

    const parsed = JSON.parse(aiResponse);

    fs.unlinkSync(filepath)


    res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText
    });

  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ message: error.message });
  }
};


export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, targetCompany, interviewMode, resumeText, projects, skills } = req.body

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res.status(400).json({ message: "Role, Experience and Mode are required." })
    }

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required."
      });
    }

    const projectText = Array.isArray(projects) && projects.length
      ? projects.join(", ")
      : "None";

    const skillsText = Array.isArray(skills) && skills.length
      ? skills.join(", ")
      : "None";

    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
    Role:${role}
    Experience:${experience}
    InterviewMode:${mode}
    Projects:${projectText}
    Skills:${skillsText},
    Resume:${safeResume}
    `;

    if (!userPrompt.trim()) {
      return res.status(400).json({
        message: "Prompt content is empty."
      });
    }

    const messages = [

      {
        role: "system",
        content: `
You are a real human interviewer conducting a professional interview.

Target Company/Framework: ${targetCompany || 'General'}. You must adapt the phrasing, difficulty curve, and behavioral focus to match the known hiring rubrics of this company/category. For example, if Amazon, inject 'Leadership Principles'. If Google, focus on 'Googleyness' and extreme scale. If McKinsey, focus on structured MECE frameworks.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 7 interview questions.
If the InterviewMode is 'Technical', EXACTLY 2 of the 7 questions must be Data Structures & Algorithms (DSA) coding challenges. The other 5 should be conceptual/behavioral.
If the InterviewMode is 'HR', all 7 questions should be conceptual/behavioral.

Strict Rules:
- Return EXACTLY a JSON array of 7 objects. No other text.
- Each object must have:
  - "question": string (between 15 and 25 words, a single complete sentence, no numbering, no extra text, conversational)
  - "questionType": string ("coding" for DSA challenges, "conceptual" for all others)
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard (or medium coding)
Question 6 → hard (or hard coding)
Question 7 → hard  

Make questions based on the candidate’s role, experience, InterviewMode, projects, skills, and resume details.
`
      }
      ,
      {
        role: "user",
        content: userPrompt
      }
    ];


    const aiResponse = await askAi(messages)

    if (!aiResponse || !aiResponse.trim()) {
           
      return res.status(500).json({
        message: "AI returned empty response."
      });

    }

    let questionsArray = [];
    try {
      const jsonStart = aiResponse.indexOf('[');
      const jsonEnd = aiResponse.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        questionsArray = JSON.parse(aiResponse.substring(jsonStart, jsonEnd + 1));
      } else {
        questionsArray = JSON.parse(aiResponse);
      }
      questionsArray = questionsArray.slice(0, 7);
    } catch(err) {
      console.error("Failed to parse AI response as JSON", err);
      return res.status(500).json({
        message: "AI failed to generate valid JSON questions."
      });
    }

    if (questionsArray.length === 0) {
      
      return res.status(500).json({
        message: "AI failed to generate questions."
      });
    }

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      targetCompany: targetCompany || 'General',
      interviewMode: interviewMode || 'Practice',
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q.question,
        questionType: q.questionType || "conceptual",
        difficulty: ["easy", "easy", "medium", "medium", "hard", "hard", "hard"][index] || "medium",
        timeLimit: [60, 60, 90, 90, 180, 180, 120][index] || 60,
      }))
    })

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
      targetCompany: interview.targetCompany,
      interviewMode: interview.interviewMode,
      mode: interview.mode
    });
  } catch (error) {
    return res.status(500).json({message:`failed to create interview ${error}`})
  }
}


export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken, behavioralTelemetry, codeSnippet, cheatingFlags, isSkipped, isCheating, cheatingReason } = req.body

    const interview = await Interview.findById(interviewId)
    const question = interview.questions[questionIndex]

    if (isCheating) {
      question.score = 0;
      question.cheatingDetected = true;
      question.cheatingDetails = [cheatingReason];
      question.feedback = "Cheating detected: " + cheatingReason + ". Score nullified.";
      question.answer = answer || "";
      if (codeSnippet) question.codeSnippet = codeSnippet;
      
      await interview.save();
      return res.status(200).json({ feedback: question.feedback });
    }

    if (interview.interviewMode === 'Strict' && cheatingFlags && cheatingFlags.length > 0) {
      question.score = 0;
      question.cheatingDetected = true;
      question.cheatingDetails = cheatingFlags;
      question.feedback = "Cheating detected: " + cheatingFlags.join(", ") + ". Score nullified.";
      question.answer = answer || "";
      if (codeSnippet) question.codeSnippet = codeSnippet;
      
      await interview.save();
      return res.status(200).json({ feedback: question.feedback });
    }

    if (isSkipped) {
      question.score = 0;
      question.feedback = "Question skipped by candidate. It is highly recommended to research this topic further.";
      question.answer = "";
      await interview.save();
      return res.status(200).json({ feedback: question.feedback });
    }

    // If no answer
    if (!answer) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();

      return res.json({
        feedback: question.feedback
      });
    }

    // If time exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;

      await interview.save();

      return res.json({
        feedback: question.feedback
      });
    }


    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Target Company Standard: ${interview.targetCompany || 'General'}. Evaluate this candidate's answer as if you are a strict hiring manager at this exact company. Apply their specific cultural values and technical rigor to your scoring and feedback.

Evaluate naturally and fairly, like a real person would.
The candidate may submit a verbal explanation AND a code snippet. If \`codeSnippet\` is provided, evaluate the algorithmic logic, Big-O complexity, and syntax of the code alongside their verbal explanation. If no code is provided, evaluate just the verbal explanation.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer/code accurate, relevant, logically sound, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.
- **IMPORTANT**: You will receive behavioral telemetry (WPM and emotions). If WPM is > 160 or < 110, or if 'nervous' expressions heavily outweigh 'neutral'/'happy', you MUST lower the confidence score.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback",
  "body_language_feedback": "Short sentence advising on their pacing or expression."
}
`
      }
      ,
      {
        role: "user",
        content: `
Question: ${question.question}
Answer: ${answer}
${codeSnippet ? `Code Snippet: \n${codeSnippet}` : ""}
Behavioral Telemetry: ${behavioralTelemetry ? JSON.stringify(behavioralTelemetry) : "None provided"}
`
      }
    ];


    const aiResponse = await askAi(messages)


    const parsed = JSON.parse(aiResponse);

    question.answer = answer;
    if (codeSnippet) question.codeSnippet = codeSnippet;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;
    if (parsed.body_language_feedback) {
      question.body_language_feedback = parsed.body_language_feedback;
    }
    await interview.save();


    return res.status(200).json({feedback :parsed.feedback})
  } catch (error) {
    return res.status(500).json({message:`failed to submit answer ${error}`})

  }
}


export const finishInterview = async (req,res) => {
  try {
    const {interviewId} = req.body
    const interview = await Interview.findById(interviewId)
    if(!interview){
      return res.status(400).json({message:"failed to find Interview"})
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions
      ? totalScore / totalQuestions
      : 0;

    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
       finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        questionType: q.questionType,
        codeSnippet: q.codeSnippet,
        score: q.score || 0,
        feedback: q.feedback || "",
        body_language_feedback: q.body_language_feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
        cheatingDetected: q.cheatingDetected || false,
        cheatingDetails: q.cheatingDetails || [],
      })),
    })
  } catch (error) {
    return res.status(500).json({message:`failed to finish Interview ${error}`})
  }
}


export const getMyInterviews = async (req,res) => {
  try {
    const interviews = await Interview.find({userId:req.userId})
    .sort({ createdAt: -1 })
    .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interviews)

  } catch (error) {
     return res.status(500).json({message:`failed to find currentUser Interview ${error}`})
  }
}

export const getInterviewReport = async (req,res) => {
  try {
    const interview = await Interview.findById(req.params.id)

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }


    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });
    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

       return res.json({
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions
    });

  } catch (error) {
    return res.status(500).json({message:`failed to find currentUser Interview report ${error}`})
  }
}




