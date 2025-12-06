import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MapPin, Clock, Navigation, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { timeOffset: number; radius: number }) => void;
}

const WinkModal: React.FC<WinkModalProps> = ({ open, onOpenChange, onSubmit }) => {
  const [timeOffset, setTimeOffset] = useState(0);
  const [radius, setRadius] = useState(200);

  const formatTimeOffset = (mins: number) => {
    if (mins === 0) return 'Right now';
    if (mins < 0) return `${Math.abs(mins)} mins ago`;
    return `${mins} mins from now`;
  };

  const handleSubmit = () => {
    onSubmit({ timeOffset, radius });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass border-primary/20 shadow-elevated animate-slide-up">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-gradient">Drop a Wink</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Map Preview */}
          <div className="relative h-40 rounded-2xl overflow-hidden bg-muted border border-border">
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="absolute rounded-full border-2 border-primary/40 bg-primary/10 transition-all duration-300"
                style={{ 
                  width: `${(radius / 500) * 100}%`,
                  height: `${(radius / 500) * 100}%`,
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              />
              <div className="relative z-10 w-4 h-4 rounded-full gradient-primary shadow-button" />
            </div>
            <div className="absolute bottom-2 left-2 glass rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-primary" />
              <span>Your location</span>
            </div>
          </div>

          {/* Time Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                When did you see them?
              </label>
              <span className="text-sm font-medium text-primary">
                {formatTimeOffset(timeOffset)}
              </span>
            </div>
            <Slider
              value={[timeOffset]}
              onValueChange={([value]) => setTimeOffset(value)}
              min={-10}
              max={0}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10 mins ago</span>
              <span>Now</span>
            </div>
          </div>

          {/* Radius Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                Search radius
              </label>
              <span className="text-sm font-medium text-secondary">
                {radius}m
              </span>
            </div>
            <Slider
              value={[radius]}
              onValueChange={([value]) => setRadius(value)}
              min={100}
              max={500}
              step={100}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100m</span>
              <span>500m</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            size="lg"
            variant="glow"
          >
            <Sparkles className="w-5 h-5" />
            Drop Wink
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinkModal;
