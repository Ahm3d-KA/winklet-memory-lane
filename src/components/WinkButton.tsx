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
      {/* Heat wave ripple effects - Deep Red ember glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="absolute w-44 h-44 rounded-full animate-radar-ripple"
          style={{ 
            animationDelay: '0s',
            background: 'radial-gradient(circle, transparent 60%, rgba(128, 0, 32, 0.4) 70%, transparent 100%)',
            border: '2px solid rgba(128, 0, 32, 0.5)'
          }} 
        />
        <div 
          className="absolute w-44 h-44 rounded-full animate-radar-ripple"
          style={{ 
            animationDelay: '0.66s',
            background: 'radial-gradient(circle, transparent 60%, rgba(128, 0, 32, 0.3) 70%, transparent 100%)',
            border: '2px solid rgba(128, 0, 32, 0.4)'
          }} 
        />
        <div 
          className="absolute w-44 h-44 rounded-full animate-radar-ripple"
          style={{ 
            animationDelay: '1.33s',
            background: 'radial-gradient(circle, transparent 60%, rgba(128, 0, 32, 0.2) 70%, transparent 100%)',
            border: '2px solid rgba(128, 0, 32, 0.3)'
          }} 
        />
      </div>
      
      {/* Main button - Glowing Ember */}
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative w-44 h-44 rounded-full text-white",
          "font-bold text-lg",
          "hover:scale-105 active:scale-[0.97]",
          "transition-all duration-300 ease-out",
          "flex flex-col items-center justify-center gap-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "animate-breathe"
        )}
        style={{
          background: 'linear-gradient(to top, #D6001C 0%, #FF0055 100%)',
          boxShadow: '0px 0px 30px rgba(255, 0, 60, 0.4), 0px 0px 60px rgba(255, 0, 60, 0.2), inset 0 -4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Inner glow overlay */}
        <div 
          className="absolute inset-2 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
          }}
        />
        <Eye className="w-10 h-10 drop-shadow-lg relative z-10" strokeWidth={2.5} />
        <span className="text-xl font-bold tracking-tight drop-shadow-lg relative z-10">Drop Wink</span>
      </button>
    </div>
  );
};

export default WinkButton;
