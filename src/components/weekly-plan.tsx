import React, { useRef } from 'react';
import { Button } from '@components/button';
import { useMeals } from '@/context/mealsProvider';
import { NavLink } from 'react-router';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyPlan: React.FC = () => {
  const { meals, weeklyMeals, updateMealForDay, savingMealPlanForDay } = useMeals();
  const timerRef = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});

  const saveDay = (day: string, data: { mealId?: string; note?: string }): void => {
    if (timerRef.current[day]) {
      clearTimeout(timerRef.current[day]);
    }
    if (
      (data.note != null && data.note !== weeklyMeals[day]?.note) ||
      (data.mealId != null && data.mealId !== weeklyMeals[day]?.mealId)
    ) {
      updateMealForDay(day, data);
    }
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Meal plan</h2>
        <p>Assign meals to each day and add custom notes.</p>
      </div>

      <div className="plan-grid">
        {daysOfWeek.map((day) => {
          const plan = weeklyMeals[day] || { mealId: '', note: '' };
          const isEmpty = !plan.mealId && !plan.note;

          return (
            <div key={day} className={`plan-card ${isEmpty ? ' empty' : 'filled'}`}>
              <div className="plan-title">
                <div className="flex space-between">
                  <h3>{day}</h3>
                  {savingMealPlanForDay.includes(day) ? (
                    <img src="/90-ring.svg" alt="Saving..." />
                  ) : plan.mealId || plan.note?.length ? (
                    <Button
                      className="text muted"
                      onClick={() => {
                        updateMealForDay(day, {
                          mealId: '',
                          note: '',
                        });
                      }}
                    >
                      Clear
                    </Button>
                  ) : null}
                </div>
                <select
                  value={plan.mealId}
                  onChange={(event) => {
                    saveDay(day, { mealId: event.target.value });
                  }}
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
                onBlur={(event) => {
                  saveDay(day, { note: event.target.value });
                }}
                onChange={(event) => {
                  if (timerRef.current[day]) {
                    clearTimeout(timerRef.current[day]);
                  }
                  timerRef.current[day] = setTimeout(() => {
                    updateMealForDay(day, { note: event.target.value });
                  }, 2000);
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="my-1 flex-center">
        <NavLink to="/meals">
          <Button className="ghost">+ Add a new meal</Button>
        </NavLink>
      </div>
    </section>
  );
};
