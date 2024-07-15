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
  const [totalLimit, setTotalLimit] = useState(() => {
    const savedTotal = localStorage.getItem('totalLimit');
    return savedTotal ? savedTotal : 0;
  });
  const [limits, setLimits] = useState(() => {
    const savedLimit = localStorage.getItem('limits');
    return savedLimit ? JSON.parse(savedLimit) : [];
  });
  const [scenarios, setScenarios] = useState(() => {
    const savedScenarios = localStorage.getItem('scenarios');
    return savedScenarios ? JSON.parse(savedScenarios) : [];
  });

  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    localStorage.setItem('ConvictionContext', JSON.stringify(convictions));
    localStorage.setItem('RangesContext', JSON.stringify(dateRanges.sort((a, b) => parseInt(a.range) - parseInt(b.range))));
    localStorage.setItem('WaitingContext', JSON.stringify(waitingPeriods));
    localStorage.setItem('totalLimit', totalLimit);
    localStorage.setItem('limits', JSON.stringify(limits));
    localStorage.setItem('scenarios', JSON.stringify(scenarios));
  }, [convictions, dateRanges, waitingPeriods, totalLimit, limits, scenarios]);

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

  const addLimit = (limit) => {
    setLimits([...limits, limit]);
  };

  const deleteLimit = (index) => {
    const filteredRanges = limits.filter((_, idx) => idx !== index);
    setLimits(filteredRanges);
  };

  const addScenario = (scenario) => {
    setScenarios([...scenarios, scenario]);
  };

  const deleteScenario = (index) => {
    const filteredRanges = scenarios.filter((_, idx) => idx !== index);
    setScenarios(filteredRanges);
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
    totalLimit,
    setTotalLimit,
    limits,
    addLimit,
    deleteLimit,
    scenarios,
    addScenario,
    deleteScenario,
    showResult,
    setShowResult
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => useContext(AppStateContext);
