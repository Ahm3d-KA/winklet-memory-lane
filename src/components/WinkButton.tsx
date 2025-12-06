import React from 'react';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface WinkButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const WinkButton: React.FC<WinkButtonProps> = ({ onClick, disabled }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Neon purple ripple effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="absolute w-44 h-44 rounded-full animate-radar-ripple"
          style={{ 
            animationDelay: '0s',
            background: 'radial-gradient(circle, transparent 60%, hsl(280 70% 60% / 0.3) 70%, transparent 100%)',
            border: '2px solid hsl(280 70% 60% / 0.4)'
          }} 
        />
        <div 
          className="absolute w-44 h-44 rounded-full animate-radar-ripple"
          style={{ 
            animationDelay: '0.66s',
            background: 'radial-gradient(circle, transparent 60%, hsl(280 70% 60% / 0.2) 70%, transparent 100%)',
            border: '2px solid hsl(280 70% 60% / 0.3)'
          }} 
        />
        <div 
          className="absolute w-44 h-44 rounded-full animate-radar-ripple"
          style={{ 
            animationDelay: '1.33s',
            background: 'radial-gradient(circle, transparent 60%, hsl(280 70% 60% / 0.1) 70%, transparent 100%)',
            border: '2px solid hsl(280 70% 60% / 0.2)'
          }} 
        />
      </div>
      
      {/* Main button - Neon Purple glow */}
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative w-44 h-44 rounded-full gradient-primary text-primary-foreground",
          "font-bold text-lg shadow-button",
          "hover:shadow-glow hover:scale-105 active:scale-[0.97]",
          "transition-all duration-300 ease-out",
          "flex flex-col items-center justify-center gap-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "animate-breathe animate-pulse-glow"
        )}
      >
        <Eye className="w-10 h-10" strokeWidth={2.5} />
        <span className="font-display text-xl font-semibold uppercase tracking-wide">Drop Wink</span>
      </button>
    </div>
  );
};

export default WinkButton;
