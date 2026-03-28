import React, { useCallback, useEffect } from 'react';
import { supabase } from '@utils/supabase';
import { MealsList } from '@components/meals-list';
import { ShoppingList } from '@components/shopping-list';
import { WeeklyPlan } from '@components/weekly-plan';
import { ShareCode } from '@components/share-code';
import { IngredientList } from '@components/ingredient-list';
import { useHousehold } from '@/context/useHousehold';
import type { Meal } from '../types';

export const Dashboard: React.FC = () => {
  const { household } = useHousehold();
  const [meals, setMeals] = React.useState<Meal[]>([]);

  const fetchMealsList = useCallback(async () => {
    if (!household) return;

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('household_id', household.id);
    if (error) {
      console.error(error);
    } else if (data) {
      setMeals(data);
    }
  }, [household]);

  useEffect(() => {
    fetchMealsList();
  }, [fetchMealsList]);

  return (
    <main className="dashboard">
      <MealsList meals={meals} onMealAdded={fetchMealsList} />
      <IngredientList />
      <WeeklyPlan meals={meals} />
      <ShoppingList />
      <ShareCode />
    </main>
  );
};
