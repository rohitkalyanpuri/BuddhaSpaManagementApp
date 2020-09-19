import React, { useState, useEffect } from 'react';

const TimerComponent = (props) => {
  const [minutes, setMinutes] = useState(props.CompletedMassageTime);
  const [isActive, setIsActive] = useState(props.IsStarted);

  function toggle() {
    setIsActive(!isActive);
    props.SetStartedMassageTime(props.LogId,!isActive,minutes);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      // if (minutes < props.MassageMinutes) {
      //   interval = setInterval(() => {
      //     setMinutes((minutes) => minutes + 1);
      //   }, 60000);
      // } else {
      //   clearInterval(interval);
      // }
         interval = setInterval(() => {
          setMinutes((minutes) => minutes + 1);
          if((minutes+1) % 3 ===0){
            props.SetStartedMassageTime(props.LogId,isActive,minutes+1);
          }
        }, 60000);
    } else if (!isActive && minutes !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes]);

  if (props.IsCompleted) {
    return <p className='mb-0 mr-2'>{props.CompletedMassageTime}</p>;
  } else {
    return (
      <div className='align-items-center col-lg-12 d-flex'>
        <p className={`mb-0 mr-2 w-50 ${minutes < props.MassageMinutes ? 'text-success':'text-danger'}`}>{minutes}</p>
        {!isActive ? (
          <button className='btn btn-block btn-info btn-sm' onClick={toggle}>
            Start
          </button>
        ) : (
          <button
            className='btn btn-block btn-secondary btn-sm'
            onClick={toggle}
          >
            Pause
          </button>
        )}
      </div>
    );
  }
};


export default TimerComponent;
