import { useState, useEffect } from 'react';
import { twoDots } from '../assets';
import styles from './Timer.module.css';

const COUNTDOWN_TARGET = new Date('2024-01-25T23:59:59');

const getTimeLeft = () => {
  const totalTimeLeft = COUNTDOWN_TARGET - new Date();
  const days = Math.floor(totalTimeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalTimeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalTimeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((totalTimeLeft / 1000) % 60);
  //console.log(`Days - ${days}, Hours - ${hours}, Minutes - ${minutes}, Seconds - ${seconds}`)
  return {days, hours, minutes, seconds };
};

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className='countdown'>
      <div className={styles.content}>
        {Object.entries(timeLeft).map(([label, value], i) => (
          <div key={label}>
            <div className='flex items-center gap-[10px] justify-center'>
              <div className={styles.box}>
                <span className={styles.value}>{value}</span>
              </div>
              {i < Object.entries(timeLeft).length - 1 && (
                <img src={twoDots} className='w-[10px]' alt='dots' />
              )}
            </div>
            <div>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timer;

