// React component for TwoLineDate
import { memo } from 'react';

function TwoLineDate({ date }: { date?: string }) {
  if (!date) return null;
  const d = new Date(date);

  const dateStr = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const timeStr = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
      <span>{dateStr}</span>
      <span>{timeStr}</span>
    </div>
  );
}

export default memo(TwoLineDate);
