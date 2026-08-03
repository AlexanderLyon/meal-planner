import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { Button } from '@components/Button';

const DarkModeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" />
  </svg>
);

const LightModeIcon = () => (
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
    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M4 12h.01" />
    <path d="M12 4v.01" />
    <path d="M20 12h.01" />
    <path d="M12 20v.01" />
    <path d="M6.31 6.31l-.01 -.01" />
    <path d="M17.71 6.31l-.01 -.01" />
    <path d="M17.7 17.7l.01 .01" />
    <path d="M6.3 17.7l.01 .01" />
  </svg>
);

export const NavigationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((previousTheme) => !previousTheme);
    setIsOpen(false);
  };

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
        <NavLink to="/weekly-plan" onClick={() => setIsOpen(false)} tabIndex={0}>
          This Week
        </NavLink>
        <NavLink to="/meals" onClick={() => setIsOpen(false)} tabIndex={0}>
          Meals
        </NavLink>
        <NavLink to="/ingredients" onClick={() => setIsOpen(false)} tabIndex={0}>
          Ingredients
        </NavLink>
        <NavLink to="/shopping" onClick={() => setIsOpen(false)} tabIndex={0}>
          Shopping List
        </NavLink>
        <Button
          type="button"
          className="text theme-toggle"
          onClick={toggleTheme}
          aria-pressed={isDarkMode}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          tabIndex={0}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </Button>
      </nav>
    </div>
  );
};
