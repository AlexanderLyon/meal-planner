import React from 'react';
import { useMeals } from '@/context/mealsProvider';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyPlan: React.FC = () => {
  const { meals, weeklyMeals, updateMealForDay } = useMeals();

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Meal plan</h2>
        <p>Assign meals to each day and add notes like leftovers night.</p>
      </div>

      <div className="plan-grid">
        {daysOfWeek.map((day) => {
          const plan = weeklyMeals[day] || { mealId: '', note: '' };
          return (
            <div key={day} className="plan-card">
              <div className="plan-title">
                <h3>{day}</h3>
                <select
                  value={plan.mealId}
                  onChange={(event) => updateMealForDay(day, { mealId: event.target.value })}
                >
                  <option value="">Choose a meal</option>
                  {meals.map((meal) => (
                    <option key={meal.id} value={meal.id}>
                      {meal.name}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Add a note"
                defaultValue={plan.note}
                onBlur={(event) => updateMealForDay(day, { note: event.target.value })}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
