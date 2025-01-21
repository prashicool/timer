import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState([]);
  const intervalRefs = useRef({});

  useEffect(() => {
    loadTimers();
    // Cleanup intervals on unmount
    return () => {
      Object.values(intervalRefs.current).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, []);

  const loadTimers = async () => {
    try {
      const savedTimers = await AsyncStorage.getItem('timers');
      if (savedTimers) {
        setTimers(JSON.parse(savedTimers));
      }
    } catch (error) {
      console.error('Error loading timers:', error);
    }
  };

  const saveTimers = async (newTimers) => {
    try {
      await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
      setTimers(newTimers);
    } catch (error) {
      console.error('Error saving timers:', error);
    }
  };

  const addTimer = (timer) => {
    const newTimer = {
      ...timer,
      id: Date.now().toString(),
      status: 'idle',
      remainingTime: timer.duration,
      progress: 0,
    };
    const newTimers = [...timers, newTimer];
    saveTimers(newTimers);
  };

  const updateTimer = (id, updates) => {
    const newTimers = timers.map(timer => 
      timer.id === id ? { ...timer, ...updates } : timer
    );
    saveTimers(newTimers);
  };

  const startTimer = (id) => {
    // Clear existing interval if any
    if (intervalRefs.current[id]) {
      clearInterval(intervalRefs.current[id]);
    }

    // Create new interval
    intervalRefs.current[id] = setInterval(() => {
      setTimers(currentTimers => {
        const timer = currentTimers.find(t => t.id === id);
        if (timer && timer.status === 'running' && timer.remainingTime > 0) {
          const newRemainingTime = timer.remainingTime - 1;
          const progress = ((timer.duration - newRemainingTime) / timer.duration) * 100;

          if (newRemainingTime === 0) {
            clearInterval(intervalRefs.current[id]);
            return currentTimers.map(t => 
              t.id === id ? {
                ...t,
                remainingTime: newRemainingTime,
                progress,
                status: 'completed'
              } : t
            );
          }

          return currentTimers.map(t =>
            t.id === id ? {
              ...t,
              remainingTime: newRemainingTime,
              progress
            } : t
          );
        }
        return currentTimers;
      });
    }, 1000);

    updateTimer(id, { status: 'running' });
  };

  const pauseTimer = (id) => {
    if (intervalRefs.current[id]) {
      clearInterval(intervalRefs.current[id]);
      delete intervalRefs.current[id];
    }
    updateTimer(id, { status: 'paused' });
  };

  const resetTimer = (id) => {
    if (intervalRefs.current[id]) {
      clearInterval(intervalRefs.current[id]);
      delete intervalRefs.current[id];
    }
    const timer = timers.find(t => t.id === id);
    updateTimer(id, {
      status: 'idle',
      remainingTime: timer.duration,
      progress: 0
    });
  };

  const startCategoryTimers = (category) => {
    const categoryTimers = timers.filter(timer => 
      timer.category === category && 
      timer.status !== 'completed' && 
      timer.remainingTime > 0
    );

    // Start each timer in the category
    categoryTimers.forEach(timer => {
      startTimer(timer.id);
    });

    // Update all timers' status at once
    const newTimers = timers.map(timer =>
      timer.category === category && 
      timer.status !== 'completed' && 
      timer.remainingTime > 0
        ? { ...timer, status: 'running' }
        : timer
    );
    saveTimers(newTimers);
  };

  const pauseCategoryTimers = (category) => {
    // Clear intervals 
    timers.forEach(timer => {
      if (timer.category === category) {
        if (intervalRefs.current[timer.id]) {
          clearInterval(intervalRefs.current[timer.id]);
          delete intervalRefs.current[timer.id];
        }
      }
    });

    const newTimers = timers.map(timer =>
      timer.category === category && timer.status === 'running'
        ? { ...timer, status: 'paused' }
        : timer
    );
    saveTimers(newTimers);
  };

  const resetCategoryTimers = (category) => {
    // Clear intervals 
    timers.forEach(timer => {
      if (timer.category === category) {
        if (intervalRefs.current[timer.id]) {
          clearInterval(intervalRefs.current[timer.id]);
          delete intervalRefs.current[timer.id];
        }
      }
    });

    const newTimers = timers.map(timer =>
      timer.category === category
        ? {
            ...timer,
            status: 'idle',
            remainingTime: timer.duration,
            progress: 0
          }
        : timer
    );
    saveTimers(newTimers);
  };

  return (
    <TimerContext.Provider value={{
      timers,
      addTimer,
      startTimer,
      pauseTimer,
      resetTimer,
      updateTimer,
      startCategoryTimers,
      pauseCategoryTimers,
      resetCategoryTimers,
    }}>
      {children}
    </TimerContext.Provider>
  );
};