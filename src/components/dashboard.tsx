import React from 'react';
import { MealsList } from '@components/meals-list';
import { ShoppingList } from '@components/shopping-list';
import { WeeklyPlan } from '@components/weekly-plan';
import { ShareCode } from '@components/share-code';
import { IngredientList } from '@components/ingredient-list';
import { useHousehold } from '@/context/useHousehold';
import { MealsProvider } from '@/context/mealsProvider';

export const Dashboard: React.FC = () => {
  const { household } = useHousehold();

  return (
    <main className="dashboard">
      <MealsProvider household={household}>
        <MealsList />
        <IngredientList />
        <WeeklyPlan />
        <ShoppingList />
        <ShareCode />
      </MealsProvider>
    </main>
  );
};
