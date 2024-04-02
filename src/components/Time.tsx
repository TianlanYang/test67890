// CurrentTimeDisplay.tsx
import React, { useState, useEffect } from "react";

const formatTime = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const CurrentTimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date()); // 每秒更新时间
    }, 15000); // 或者根据你的需求调整时间间隔

    return () => clearInterval(interval); // 清理定时器
  }, []);

  return <div> {formatTime(currentTime)}</div>;
};

export default CurrentTimeDisplay;
