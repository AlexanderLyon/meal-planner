import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@utils/supabase';
import type {
  Meal,
  MealIngredient,
  IngredientItem,
  WeeklyMealPlan,
  MealPlanDay,
  Household,
} from '../types';

type MealsContextValue = {
  meals: Meal[];
  ingredients: IngredientItem[];
  weeklyMeals: WeeklyMealPlan;
  savingMealPlanForDay: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateMealForDay: (day: string, { mealId, note }: MealPlanDay) => Promise<void>;
  addNewMeal: ({
    mealName,
    mealIngredients,
    instructions,
    onSuccess,
    onError,
  }: {
    mealName: string;
    mealIngredients: MealIngredient[];
    instructions: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
  }) => Promise<void>;
};

const initialMealPlan: WeeklyMealPlan = {
  Monday: { mealId: '', note: '' },
  Tuesday: { mealId: '', note: '' },
  Wednesday: { mealId: '', note: '' },
  Thursday: { mealId: '', note: '' },
  Friday: { mealId: '', note: '' },
  Saturday: { mealId: '', note: '' },
  Sunday: { mealId: '', note: '' },
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
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMealPlan>(initialMealPlan);
  const [savingMealPlanForDay, setSavingMealPlanForDay] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!household) return;

    setLoading(true);
    setError(null);

    const [mealsRes, ingredientsRes, weeklyMealsRes] = await Promise.all([
      supabase
        .from('meals')
        .select('*')
        .eq('household_id', household.id)
        .order('name', { ascending: true }),
      supabase
        .from('ingredients')
        .select('*')
        .eq('household_id', household.id)
        .order('name', { ascending: true }),
      supabase.from('weekly_plans').select('*').eq('household_id', household.id),
    ]);

    if (mealsRes.error || ingredientsRes.error || weeklyMealsRes.error) {
      setError(
        mealsRes.error?.message ||
          ingredientsRes.error?.message ||
          weeklyMealsRes.error?.message ||
          'Failed to load data'
      );
      setLoading(false);
      return;
    }

    setMeals((mealsRes.data ?? []) as Meal[]);
    setIngredients((ingredientsRes.data ?? []) as IngredientItem[]);

    const planRow = weeklyMealsRes.data?.[0];
    setWeeklyMeals(planRow?.plan ?? initialMealPlan);
    setLoading(false);
  }, [household]);

  const updateMealForDay = useCallback(
    async (day: string, { mealId, note }: MealPlanDay) => {
      if (!household) return;
      setSavingMealPlanForDay((prev) => [...prev, day]);
      let updatedPlan: WeeklyMealPlan;

      try {
        updatedPlan = {
          ...weeklyMeals,
          [day]: {
            ...weeklyMeals[day],
            mealId: mealId ?? weeklyMeals[day].mealId,
            note: note ?? weeklyMeals[day].note,
          },
        };

        const { error: upsertError } = await supabase
          .from('weekly_plans')
          .upsert(
            { household_id: household.id, plan: updatedPlan },
            { onConflict: 'household_id' }
          );

        if (upsertError) {
          setError(upsertError.message);
        } else {
          setWeeklyMeals(updatedPlan);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setSavingMealPlanForDay((prev) => prev.filter((d) => d !== day));
      }
    },
    [household, weeklyMeals]
  );

  const addNewMeal = useCallback(
    async ({
      mealName,
      mealIngredients,
      instructions,
      onSuccess,
      onError,
    }: {
      mealName: string;
      mealIngredients: MealIngredient[];
      instructions: string;
      onSuccess?: () => void;
      onError?: (error: string) => void;
    }) => {
      const trimmedName = mealName.trim();
      if (!trimmedName || !household) return;

      console.table({
        mealName: trimmedName,
        mealIngredients,
        instructions,
        householdId: household.id,
      });

      try {
        const { error } = await supabase.from('meals').insert({
          name: trimmedName,
          household_id: household.id,
          ingredients: mealIngredients,
          instructions: instructions.trim() || null,
        });

        if (error) {
          console.error('Error inserting meal:', error);
          return;
        }

        if (onSuccess) onSuccess();
      } catch (err) {
        console.error('Failed to add meal:', err);
        if (onError) onError((err as Error).message);
      }
    },
    [household]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = useMemo<MealsContextValue>(
    () => ({
      meals,
      ingredients,
      weeklyMeals,
      savingMealPlanForDay,
      loading,
      error,
      refresh: fetchData,
      addNewMeal,
      updateMealForDay,
    }),
    [
      meals,
      ingredients,
      weeklyMeals,
      loading,
      error,
      fetchData,
      addNewMeal,
      updateMealForDay,
      savingMealPlanForDay,
    ]
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
