const clock = (hours, minutes, seconds, isStop) => {
  const calculateTime = () => {
    if (hours >= 23 && minutes >= 59 && seconds >= 59) {
      hours = 0;
      minutes = 0;
      seconds = 0;
      return {
        hours,
        minutes,
        seconds,
      };
    }
    if (minutes >= 59 && seconds >= 59) {
      hours += 1;
      minutes = 0;
      return {
        hours,
        minutes,
        seconds,
      };
    }
    if (seconds >= 59) {
      minutes += 1;
      seconds = 0;
      return {
        hours,
        minutes,
        seconds,
      };
    }
    seconds += 1;
    return {
      hours,
      minutes,
      seconds,
    };
  }
  if (isStop) {
    return;
  } else {
    return calculateTime();
  }
}

module.exports = clock;