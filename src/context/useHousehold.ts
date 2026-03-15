import { useContext } from 'react';
import { HouseholdContext } from '@context/householdProvider';
import type { HouseholdContextValue } from '@context/householdProvider';

export const useHousehold = (): HouseholdContextValue => {
  const context = useContext(HouseholdContext);

  if (!context) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }

  return context;
};
