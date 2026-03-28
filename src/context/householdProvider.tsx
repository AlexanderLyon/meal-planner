import { createContext, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@utils/supabase';

const HOUSEHOLD_STORAGE_KEY = 'meal-planner.household-code';

type Household = {
  name: string;
  id: string;
};

export type HouseholdContextValue = {
  household: Household | null;
  saveHousehold: (newHousehold: Household) => void;
  leaveHousehold: () => void;
  joinHouseholdById: (id: string) => Promise<void>;
  createHousehold: (name: string) => Promise<void>;
};

export const HouseholdContext = createContext<HouseholdContextValue | undefined>(undefined);

type HouseholdProviderProps = {
  children: ReactNode;
  householdCode?: string;
};

export function HouseholdProvider({ children }: HouseholdProviderProps) {
  const [household, setHousehold] = useState<Household | null>(() => {
    if (typeof window === 'undefined') return null;

    const storedHousehold = localStorage.getItem(HOUSEHOLD_STORAGE_KEY);

    if (storedHousehold) {
      try {
        return JSON.parse(storedHousehold) as Household;
      } catch {
        return null;
      }
    }

    return null;
  });

  const saveHousehold = useCallback((updatedHousehold: Household) => {
    setHousehold(updatedHousehold);
  }, []);

  const leaveHousehold = useCallback(() => {
    setHousehold(null);
    localStorage.removeItem(HOUSEHOLD_STORAGE_KEY);
  }, []);

  const createHousehold = async (name: string) => {
    const { data, error } = await supabase
      .from('households')
      .insert({ name: name.trim() })
      .select();
    if (error) {
      console.error(error);
    } else if (data) {
      const newHousehold: Household = {
        id: data[0].id,
        name: data[0].name,
      };
      saveHousehold(newHousehold);
      localStorage.setItem(HOUSEHOLD_STORAGE_KEY, JSON.stringify(newHousehold));
    }
  };

  const joinHouseholdById = async (id: string) => {
    const { data, error } = await supabase.from('households').select('*').eq('id', id).single();
    if (error) {
      console.error(error);
      leaveHousehold();
    } else if (data) {
      const newHousehold: Household = {
        id: data.id,
        name: data.name,
      };
      saveHousehold(newHousehold);
      localStorage.setItem(HOUSEHOLD_STORAGE_KEY, JSON.stringify(newHousehold));
    }
  };

  const value = useMemo(
    () => ({
      household,
      saveHousehold,
      leaveHousehold,
      createHousehold,
      joinHouseholdById,
    }),
    [leaveHousehold, saveHousehold, createHousehold, joinHouseholdById, household]
  );

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}
