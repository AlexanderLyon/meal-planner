import { useState, useEffect } from 'react';
import { useHousehold } from '@context/useHousehold';
import { Button } from '@components/button';

export const ShareCode: React.FC = () => {
  const { household, leaveHousehold } = useHousehold();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (): void => {
    if (!household?.id) return;
    navigator.clipboard.writeText(household.id);
    setIsCopied(true);
  };

  useEffect(() => {
    if (!isCopied) return;

    const timeout = setTimeout(() => setIsCopied(false), 3000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  if (!household) return null;

  return (
    <div className="household-card">
      <strong className="household-label">{household.name}</strong>
      <span className="household-code">
        {household.id} <button onClick={handleCopy}>{isCopied ? 'Copied!' : 'Copy'}</button>
      </span>
      <p className="muted">Share this code to invite others.</p>
      <Button onClick={leaveHousehold}>Change current household</Button>
    </div>
  );
};
