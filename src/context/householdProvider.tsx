import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const HOUSEHOLD_STORAGE_KEY = 'meal-planner.household-code';

export type HouseholdContextValue = {
  householdCode: string;
  setHouseholdCode: (code: string) => void;
  clearHouseholdCode: () => void;
};

export const HouseholdContext = createContext<HouseholdContextValue | undefined>(undefined);

type HouseholdProviderProps = {
  children: ReactNode;
  householdCode?: string;
};

export function HouseholdProvider({ children, householdCode }: HouseholdProviderProps) {
  const [storedHouseholdCode, setStoredHouseholdCode] = useState<string>(() => {
    const initialCode = householdCode?.trim().toUpperCase();

    if (initialCode) return initialCode;
    if (typeof window === 'undefined') return '';

    return localStorage.getItem(HOUSEHOLD_STORAGE_KEY) ?? '';
  });

  const setHouseholdCode = useCallback((code: string) => {
    setStoredHouseholdCode(code.trim().toUpperCase());
  }, []);

  const clearHouseholdCode = useCallback(() => {
    setStoredHouseholdCode('');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (storedHouseholdCode) {
      localStorage.setItem(HOUSEHOLD_STORAGE_KEY, storedHouseholdCode);
      return;
    }

    localStorage.removeItem(HOUSEHOLD_STORAGE_KEY);
  }, [storedHouseholdCode]);

  const value = useMemo(
    () => ({
      householdCode: storedHouseholdCode,
      setHouseholdCode,
      clearHouseholdCode,
    }),
    [clearHouseholdCode, setHouseholdCode, storedHouseholdCode]
  );

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}
