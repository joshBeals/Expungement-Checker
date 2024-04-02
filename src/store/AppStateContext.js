/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */

import React, { createContext, useContext, useState } from 'react';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [convictions, setConvictions] = useState([]); // Initialize state

  // Function to add a conviction
  const addConviction = (conviction) => {
    setConvictions([...convictions, conviction]);
  };

  // Function to remove an item by index
  const deleteConviction = (index) => {
    const filteredConvictions = convictions.filter((_, idx) => idx !== index);
    setConvictions(filteredConvictions);
  };

  // Value to be passed to consuming components
  const value = {
    convictions,
    addConviction,
    deleteConviction,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => useContext(AppStateContext);
