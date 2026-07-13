import { GoogleGenAI } from '@google/genai';

type GeneratedMeal = {
  mealName: string;
  ingredients: Array<{
    id: number;
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Validate environment variable
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    console.error('GOOGLE_GENAI_API_KEY not configured');
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'API key not configured' }));
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

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
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ meal: null }));
      return;
    }

    const parsed = JSON.parse(response.text) as Partial<GeneratedMeal>;

    // Validate response structure
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
      const generatedMeal: GeneratedMeal = {
        mealName: parsed.mealName,
        ingredients: parsed.ingredients,
        instructions: typeof parsed.instructions === 'string' ? parsed.instructions : '',
      };

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ meal: generatedMeal }));
      return;
    }

    // If validation fails, return null
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ meal: null }));
  } catch (error) {
    console.error('Error generating meal:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Failed to generate meal',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    );
  }
}
