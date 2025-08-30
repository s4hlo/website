import { useState, useEffect } from 'react';

export const useStatsToggle = (initialState: boolean = false) => {
  const [statsVisible, setStatsVisible] = useState(initialState);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'p') {
        setStatsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return { statsVisible, setStatsVisible };
};
