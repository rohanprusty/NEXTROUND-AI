export const executeCode = async (languageConfig, code, signal) => {
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            content: code,
          },
        ],
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
