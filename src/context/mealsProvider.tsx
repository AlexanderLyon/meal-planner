import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@utils/supabase';
import type { Meal, IngredientItem, Household } from '../types';

type MealsContextValue = {
  meals: Meal[];
  ingredients: IngredientItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const MealsContext = createContext<MealsContextValue | undefined>(undefined);

export function MealsProvider({
  children,
  household,
}: {
  children: React.ReactNode;
  household: Household | null;
}) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!household) return;

    setLoading(true);
    setError(null);

    const [mealsRes, ingredientsRes] = await Promise.all([
      supabase
        .from('meals')
        .select('*')
        .eq('household_id', household.id)
        .order('id', { ascending: true }),
      supabase
        .from('ingredients')
        .select('*')
        .eq('household_id', household.id)
        .order('id', { ascending: true }),
    ]);

    if (mealsRes.error || ingredientsRes.error) {
      setError(mealsRes.error?.message || ingredientsRes.error?.message || 'Failed to load data');
      setLoading(false);
      return;
    }

    setMeals((mealsRes.data ?? []) as Meal[]);
    setIngredients((ingredientsRes.data ?? []) as IngredientItem[]);
    setLoading(false);
  }, [household]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = useMemo<MealsContextValue>(
    () => ({
      meals,
      ingredients,
      loading,
      error,
      refresh: fetchData,
    }),
    [meals, ingredients, loading, error, fetchData]
  );

  return <MealsContext.Provider value={value}>{children}</MealsContext.Provider>;
}

export function useMeals() {
  const ctx = useContext(MealsContext);
  if (!ctx) {
    throw new Error('useMeals must be used inside MealsProvider');
  }
  return ctx;
}
