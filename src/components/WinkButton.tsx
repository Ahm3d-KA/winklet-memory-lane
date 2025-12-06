import React from 'react';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface WinkButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const WinkButton: React.FC<WinkButtonProps> = ({ onClick, disabled }) => {
  return (
    <div className="relative">
      {/* Ripple effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-44 h-44 rounded-full border-2 border-primary/30 animate-ripple" style={{ animationDelay: '0s' }} />
        <div className="absolute w-44 h-44 rounded-full border-2 border-primary/20 animate-ripple" style={{ animationDelay: '0.5s' }} />
        <div className="absolute w-44 h-44 rounded-full border-2 border-primary/10 animate-ripple" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Main button */}
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative w-44 h-44 rounded-full gradient-primary text-primary-foreground",
          "font-bold text-lg shadow-button",
          "hover:shadow-glow hover:scale-[1.03] active:scale-[0.97]",
          "transition-all duration-300 ease-out",
          "flex flex-col items-center justify-center gap-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "animate-pulse-glow"
        )}
      >
        <Eye className="w-10 h-10" strokeWidth={2.5} />
        <span className="text-xl font-bold tracking-tight">I Saw Someone</span>
      </button>
    </div>
  );
};

export default WinkButton;
