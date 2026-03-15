import { useState, useEffect } from 'react';
import { useHousehold } from '@context/useHousehold';
import { Button } from '@components/button';

export const ShareCode: React.FC = () => {
  const { householdCode, clearHouseholdCode } = useHousehold();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (): void => {
    navigator.clipboard.writeText(householdCode);
    setIsCopied(true);
  };

  useEffect(() => {
    if (!isCopied) return;

    const timeout = setTimeout(() => setIsCopied(false), 3000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <div className="household-card">
      <span className="household-label">Household</span>
      <strong>
        {householdCode} <button onClick={handleCopy}>{isCopied ? 'Copied!' : 'Copy'}</button>
      </strong>
      <p className="muted">Share this code to invite others.</p>
      <Button onClick={clearHouseholdCode}>Change current household</Button>
    </div>
  );
};
