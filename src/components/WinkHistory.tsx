import React from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Wink {
  id: string;
  w3wAddress: string;
  timestamp: string;
  radius: number;
  hasMatch?: boolean;
}

interface WinkHistoryProps {
  winks: Wink[];
  onWinkClick?: (wink: Wink) => void;
}

const WinkHistory: React.FC<WinkHistoryProps> = ({ winks, onWinkClick }) => {
  if (winks.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          No winks yet. Tap the button above when you notice someone special!
        </p>
      </div>
    );
  }

  // Convert timestamp to short format like "5m ago"
  const formatTimeAgo = (timestamp: string) => {
    if (timestamp === 'Just now') return 'now';
    if (timestamp.includes('Today')) {
      const time = timestamp.replace('Today at ', '');
      return time;
    }
    if (timestamp.includes('Yesterday')) return '1d ago';
    return timestamp;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
        Recent Winks
      </h3>
      <div className="space-y-3">
        {winks.map((wink, index) => (
          <button
            key={wink.id}
            onClick={() => onWinkClick?.(wink)}
            className={cn(
              "w-full p-5 rounded-2xl glass text-left transition-all duration-300",
              "hover:shadow-elevated hover:border-primary/40 hover:scale-[1.02]",
              "animate-fade-in-up",
              wink.hasMatch 
                ? "border-secondary/50 shadow-[0_0_20px_hsl(var(--secondary)/0.2)]" 
                : ""
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  wink.hasMatch 
                    ? "gradient-secondary shadow-[0_0_15px_hsl(var(--secondary)/0.4)]" 
                    : "bg-primary/20"
                )}>
                  <MapPin className={cn(
                    "w-5 h-5",
                    wink.hasMatch ? "text-secondary-foreground" : "text-primary"
                  )} />
                </div>
                
                {/* Content */}
                <div className="min-w-0">
                  {/* W3W Address - Monospace, Cyan/Neon */}
                  <p className={cn(
                    "font-mono font-semibold text-base tracking-tight",
                    wink.hasMatch 
                      ? "text-[hsl(var(--neon-purple))]" 
                      : "text-[hsl(var(--cyan))]"
                  )}>
                    ///{wink.w3wAddress}
                  </p>
                  
                  {/* Radius info */}
                  <p className="text-xs text-muted-foreground mt-1">
                    {wink.radius}m radius
                  </p>
                </div>
              </div>
              
              {/* Right side - Time badge and Match badge */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                {/* Time ago badge with glow */}
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-medium",
                  "bg-[hsl(var(--cyan)/0.15)] text-[hsl(var(--cyan))]",
                  "border border-[hsl(var(--cyan)/0.3)]",
                  "shadow-[0_0_8px_hsl(var(--cyan)/0.3)]",
                  "animate-glow"
                )}>
                  {formatTimeAgo(wink.timestamp)}
                </span>
                
                {/* Match badge with pulse */}
                {wink.hasMatch && (
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    "bg-secondary/30 text-secondary",
                    "border border-secondary/50",
                    "animate-pulse-glow"
                  )}>
                    Match!
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WinkHistory;
