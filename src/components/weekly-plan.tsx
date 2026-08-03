import React, { useState, useRef } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { SkeletonLoader } from '@components/skeleton-loader';
import { useMeals } from '@/context/mealsProvider';
import { NavLink, useNavigate } from 'react-router';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DayPlan: React.FC<{ day: string }> = ({ day }) => {
  const { meals, weeklyMeals, updateMealForDay, savingMealPlanForDay } = useMeals();
  const plan = weeklyMeals[day] || { mealId: '', note: '' };
  const [currentNote, setCurrentNote] = useState<string>(plan.note || '');
  const timerRef = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});
  const navigate = useNavigate();

  const todayName: string = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
    new Date()
  );

  const isEmpty = !plan.mealId && !plan.note;
  const isToday = day === todayName;

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
    <div className={`plan-card ${isEmpty ? ' empty' : 'filled'}${isToday ? ' today' : ''}`}>
      <div className="plan-title">
        <div className="flex space-between">
          <div className="plan-day-heading">
            <h3>{day}</h3>
            {isToday ? <span className="today-badge">Today</span> : null}
          </div>
          {savingMealPlanForDay.includes(day) ? (
            <img src="/90-ring.svg" alt="Saving..." />
          ) : plan.mealId || plan.note?.length ? (
            <Button
              className="text muted"
              onClick={async () => {
                await updateMealForDay(day, {
                  mealId: '',
                  note: '',
                });
                setCurrentNote('');
              }}
            >
              Clear
            </Button>
          ) : null}
        </div>
        <select
          value={plan.mealId}
          disabled={savingMealPlanForDay.includes(day)}
          onChange={(event) => {
            if (event.target.value === 'new-meal') {
              // Redirect to meals page to create a new entry
              navigate('/meals');
            } else {
              saveDay(day, { mealId: event.target.value });
            }
          }}
        >
          <option value="">Choose a meal</option>
          <optgroup label="Saved Meals">
            {meals.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="New Meal">
            <option value="new-meal">+ Add a new meal</option>
          </optgroup>
        </select>
      </div>
      <textarea
        placeholder="Add a note"
        value={currentNote}
        onBlur={() => {
          saveDay(day, { note: currentNote });
        }}
        onChange={(event) => {
          setCurrentNote(event.target.value);
          if (timerRef.current[day]) {
            clearTimeout(timerRef.current[day]);
          }
          timerRef.current[day] = setTimeout(() => {
            updateMealForDay(day, { note: currentNote });
          }, 2000);
        }}
      />
    </div>
  );
};

export const WeeklyPlan: React.FC = () => {
  const { loading } = useMeals();

  if (loading) {
    return <SkeletonLoader height={500} />;
  }

  return (
    <Card title="Meal plan" subtitle="Assign meals to each day and add custom notes.">
      <div className="plan-grid">
        {daysOfWeek.map((day) => (
          <DayPlan key={day} day={day} />
        ))}
      </div>
      <div className="my-1 flex-center">
        <NavLink to="/meals">
          <Button className="ghost">+ Add a new meal</Button>
        </NavLink>
      </div>
    </Card>
  );
};
