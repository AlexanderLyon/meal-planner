import { useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import type { MealIngredient } from '../types';
import { useMeals } from '@/context/mealsProvider';

type GeneratedMeal = {
  mealName: string;
  ingredients: MealIngredient[];
  instructions?: string;
};

export const MealGeneration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedMeal, setGeneratedMeal] = useState<GeneratedMeal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addNewMeal, refresh } = useMeals();

  const generateMeal = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error: string };
        throw new Error(errorData.error || 'Failed to generate meal');
      }

      const data = (await response.json()) as { meal: GeneratedMeal | null };

      if (data.meal) {
        setGeneratedMeal(data.meal);
      } else {
        setError('Could not generate a meal. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setGeneratedMeal(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card title="Generate Meal" subtitle="Use AI to generate meal ideas">
      {error && <p style={{ color: '#d32f2f', marginBottom: '1rem' }}>{error}</p>}
      {generatedMeal ? (
        <div>
          <h3>{generatedMeal.mealName}</h3>
          <ul>
            {generatedMeal.ingredients.map((ingredient, i) => (
              <li key={i}>
                {ingredient.name} · {ingredient.quantity} {ingredient.unit}
              </li>
            ))}
          </ul>
          <p>{generatedMeal.instructions}</p>
          <div className="generated-meal-btns flex">
            <Button
              onClick={() =>
                addNewMeal({
                  mealName: generatedMeal.mealName,
                  mealIngredients: generatedMeal.ingredients,
                  instructions: generatedMeal.instructions || '',
                  onSuccess: () => {
                    setGeneratedMeal(null);
                    refresh();
                  },
                })
              }
            >
              Sounds good! Save meal
            </Button>
            <Button
              className="ghost"
              onClick={() => {
                setGeneratedMeal(null);
                setError(null);
                generateMeal();
              }}
            >
              Try Something Else
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={generateMeal} disabled={loading}>
          {loading ? 'Cooking something up...' : 'Get Inspired'}
        </Button>
      )}
    </Card>
  );
};
