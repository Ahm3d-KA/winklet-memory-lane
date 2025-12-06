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
      {/* Radar ripple effects - emanate outward every 2 seconds */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="absolute w-44 h-44 rounded-full animate-radar-ripple"
          style={{ 
            animationDelay: '0s',
            background: 'radial-gradient(circle, transparent 60%, hsl(285 90% 52% / 0.3) 70%, transparent 100%)',
            border: '2px solid hsl(300 100% 50% / 0.4)'
          }} 
        />
        <div 
          className="absolute w-44 h-44 rounded-full animate-radar-ripple"
          style={{ 
            animationDelay: '0.66s',
            background: 'radial-gradient(circle, transparent 60%, hsl(285 90% 52% / 0.2) 70%, transparent 100%)',
            border: '2px solid hsl(300 100% 50% / 0.3)'
          }} 
        />
        <div 
          className="absolute w-44 h-44 rounded-full animate-radar-ripple"
          style={{ 
            animationDelay: '1.33s',
            background: 'radial-gradient(circle, transparent 60%, hsl(285 90% 52% / 0.1) 70%, transparent 100%)',
            border: '2px solid hsl(300 100% 50% / 0.2)'
          }} 
        />
      </div>
      
      {/* Main button with breathing animation */}
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative w-44 h-44 rounded-full gradient-primary text-primary-foreground",
          "font-bold text-lg shadow-button",
          "hover:shadow-glow active:scale-[0.97]",
          "transition-all duration-300 ease-out",
          "flex flex-col items-center justify-center gap-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "animate-breathe animate-pulse-glow"
        )}
      >
        <Eye className="w-10 h-10" strokeWidth={2.5} />
        <span className="text-xl font-bold tracking-tight">Drop Wink</span>
      </button>
    </div>
  );
};

export default WinkButton;
