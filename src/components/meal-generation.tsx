import { useMemo, useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { GoogleGenAI } from '@google/genai';
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
  const { addNewMeal, refresh } = useMeals();
  const ai = useMemo(
    () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY }),
    []
  );

  const generateMeal = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents:
          'Create a creative dinner meal idea that uses under 10 ingredients - include the meal name, required ingredients, and brief instructions if needed.',
        config: {
          systemInstruction:
            'You are a chef who specializes in creating simple but delicious meals at home.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            required: ['mealName', 'ingredients'],
            properties: {
              mealName: { type: 'STRING' },
              ingredients: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    id: { type: 'NUMBER' },
                    name: { type: 'STRING' },
                    quantity: { type: 'NUMBER' },
                    unit: { type: 'STRING' },
                  },
                },
              },
              instructions: { type: 'STRING' },
            },
          },
          temperature: 2,
        },
      });

      if (!response.text) {
        setGeneratedMeal(null);
        return;
      }

      const parsed = JSON.parse(response.text) as Partial<GeneratedMeal>;
      if (
        typeof parsed.mealName === 'string' &&
        Array.isArray(parsed.ingredients) &&
        parsed.ingredients.every(
          (item) =>
            typeof item === 'object' &&
            typeof item.id === 'number' &&
            typeof item.name === 'string' &&
            typeof item.quantity === 'number' &&
            typeof item.unit === 'string'
        )
      ) {
        setGeneratedMeal({
          mealName: parsed.mealName,
          ingredients: parsed.ingredients,
          instructions: typeof parsed.instructions === 'string' ? parsed.instructions : '',
        });
      } else {
        setGeneratedMeal(null);
      }
    } catch (error) {
      console.error('Error generating meal:', error);
      setGeneratedMeal(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card title="Generate Meal" subtitle="Use AI to generate meal ideas">
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
