import React, { useState } from 'react';
import type { Meal, MealPlanDay } from '../types';

interface WeeklyPlanProps {
  meals: Meal[];
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyPlan: React.FC<WeeklyPlanProps> = ({ meals }) => {
  const [mealPlan, setMealPlan] = useState<MealPlanDay[]>(
    daysOfWeek.map((day) => ({ day, mealId: '', note: '' }))
  );

  const handlePlanChange = (day: string, mealId: string) => {
    setMealPlan((prev) => prev.map((item) => (item.day === day ? { ...item, mealId } : item)));
  };

  const handlePlanNote = (day: string, note: string) => {
    setMealPlan((prev) => prev.map((item) => (item.day === day ? { ...item, note } : item)));
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Meal plan</h2>
        <p>Assign meals to each day and add notes like leftovers night.</p>
      </div>

      <div className="plan-grid">
        {mealPlan.map((day) => (
          <div key={day.day} className="plan-card">
            <div className="plan-title">
              <h3>{day.day}</h3>
              <select
                value={day.mealId}
                onChange={(event) => handlePlanChange(day.day, event.target.value)}
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
              value={day.note}
              onChange={(event) => handlePlanNote(day.day, event.target.value)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
