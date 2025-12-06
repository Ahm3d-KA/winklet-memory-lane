import React from 'react';
import { MapPin, Clock, Sparkles } from 'lucide-react';
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

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
        Recent Winks
      </h3>
      <div className="space-y-2">
        {winks.map((wink) => (
          <button
            key={wink.id}
            onClick={() => onWinkClick?.(wink)}
            className={cn(
              "w-full p-4 rounded-2xl glass border text-left transition-all duration-200",
              "hover:shadow-card hover:border-primary/30",
              wink.hasMatch 
                ? "border-secondary/40 bg-secondary/5" 
                : "border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  wink.hasMatch ? "gradient-secondary" : "bg-primary/10"
                )}>
                  <MapPin className={cn(
                    "w-5 h-5",
                    wink.hasMatch ? "text-secondary-foreground" : "text-primary"
                  )} />
                </div>
                <div>
                  <p className="font-mono font-semibold text-sm">
                    ///{wink.w3wAddress}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{wink.timestamp}</span>
                    <span className="text-border">•</span>
                    <span>{wink.radius}m radius</span>
                  </div>
                </div>
              </div>
              {wink.hasMatch && (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-secondary/20 text-secondary">
                  Match!
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WinkHistory;
