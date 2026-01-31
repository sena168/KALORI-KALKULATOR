import React, { createContext, useContext, ReactNode } from 'react';
import { useCalorieState, UseCalorieStateReturn } from '@/hooks/useCalorieState';

const CalorieContext = createContext<UseCalorieStateReturn | null>(null);

export const CalorieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const calorieState = useCalorieState();
  
  return (
    <CalorieContext.Provider value={calorieState}>
      {children}
    </CalorieContext.Provider>
  );
};

export const useCalories = (): UseCalorieStateReturn => {
  const context = useContext(CalorieContext);
  if (!context) {
    throw new Error('useCalories must be used within a CalorieProvider');
  }
  return context;
};
