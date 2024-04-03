/**
 * Joshua Alele-Beals
 * joshbeals22@gmail.com
 * github.com/joshBeals
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {

  const [convictions, setConvictions] = useState(() => {
    const savedConviction = localStorage.getItem('ConvictionContext');
    return savedConviction ? JSON.parse(savedConviction) : [];
  });
  const [dateRanges, setDateRanges] = useState(() => {
    const savedRanges = localStorage.getItem('RangesContext');
    return savedRanges ? JSON.parse(savedRanges) : [];
  });
  const [waitingPeriods, setWaitingPeriods] = useState(() => {
    const savedWaiting = localStorage.getItem('WaitingContext');
    return savedWaiting ? JSON.parse(savedWaiting) : [];
  });

  useEffect(() => {
    localStorage.setItem('ConvictionContext', JSON.stringify(convictions));
    localStorage.setItem('RangesContext', JSON.stringify(dateRanges.sort((a, b) => parseInt(a.range) - parseInt(b.range))));
    localStorage.setItem('WaitingContext', JSON.stringify(waitingPeriods));
  }, [convictions, dateRanges, waitingPeriods]);

  // Function to add a conviction
  const addConviction = (conviction) => {
    setConvictions([...convictions, conviction]);
  };

  // Function to remove a conviction by index
  const deleteConviction = (index) => {
    const filteredConvictions = convictions.filter((_, idx) => idx !== index);
    setConvictions(filteredConvictions);
  };

  // Function to add a date range
  const addDateRange = (range) => {
    setDateRanges([...dateRanges, range]);
  };

  // Function to remove a date range by index
  const deleteDateRange = (index) => {
    const filteredRanges = dateRanges.filter((_, idx) => idx !== index);
    setDateRanges(filteredRanges);
  };


  const addWaitingPeriod = (range) => {
    setWaitingPeriods([...waitingPeriods, range]);
  };

  const deleteWaitingPeriod = (index) => {
    const filteredRanges = waitingPeriods.filter((_, idx) => idx !== index);
    setWaitingPeriods(filteredRanges);
  };

  // Value to be passed to consuming components
  const value = {
    convictions,
    addConviction,
    deleteConviction,
    dateRanges,
    addDateRange,
    deleteDateRange,
    waitingPeriods,
    addWaitingPeriod,
    deleteWaitingPeriod,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => useContext(AppStateContext);
