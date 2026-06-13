import { useState } from 'react';
import { NavLink } from 'react-router';
import { Button } from '@components/Button';

export const NavigationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="navigation-shell">
      <Button
        type="button"
        className="ghost nav-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="main-navigation"
        aria-label="Toggle navigation menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6l16 0" />
          <path d="M4 12l16 0" />
          <path d="M4 18l16 0" />
        </svg>
      </Button>

      <nav id="main-navigation" className={`navigation ${isOpen ? 'is-open' : ''}`}>
        <NavLink to="/weekly-plan" onClick={() => setIsOpen(false)}>
          This Week
        </NavLink>
        <NavLink to="/meals" onClick={() => setIsOpen(false)}>
          Meals
        </NavLink>
        <NavLink to="/ingredients" onClick={() => setIsOpen(false)}>
          Ingredients
        </NavLink>
        <NavLink to="/shopping" onClick={() => setIsOpen(false)}>
          Shopping List
        </NavLink>
      </nav>
    </div>
  );
};
