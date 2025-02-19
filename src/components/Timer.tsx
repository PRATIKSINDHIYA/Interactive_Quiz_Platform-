import React, { useEffect } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  onTimeUp: () => void;
}

export function Timer({ timeRemaining, onTimeUp }: TimerProps) {
  useEffect(() => {
    if (timeRemaining === 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  return (
    <div className="flex items-center space-x-2 text-lg font-semibold">
      <TimerIcon className="w-6 h-6" />
      <span>{timeRemaining}s</span>
    </div>
  );
}