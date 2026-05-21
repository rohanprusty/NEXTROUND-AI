import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer({ timeLeft, totalTime }) {
    const percentage = (timeLeft/totalTime)*100;
    
    // Warn color if less than 15 seconds
    const isWarning = timeLeft <= 15;
    const pathColor = isWarning ? "#ef4444" : "#A78BFA";

  return (
    <div className='w-12 h-12 md:w-16 md:h-16 font-bold filter drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]'>
        <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: "26px",
          pathColor: pathColor,
          textColor: isWarning ? "#ef4444" : "#f3f4f6",
          trailColor: "rgba(255,255,255,0.1)",
          pathTransitionDuration: 0.5,
        })}
        />
    </div>
  )
}

export default Timer
