import React, { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Sparkles, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import MapPreview from './MapPreview';
import { cn } from '@/lib/utils';

interface WinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { timeOffset: number; radius: number; lat: number; lng: number }) => void;
}

const RADIUS_OPTIONS = [50, 100, 150, 300, 400];

const WinkModal: React.FC<WinkModalProps> = ({ open, onOpenChange, onSubmit }) => {
  const [timeOffset, setTimeOffset] = useState(0);
  const [radius, setRadius] = useState(100);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  }, []);

  const handleSubmit = () => {
    if (coordinates) {
      onSubmit({ timeOffset, radius, lat: coordinates.lat, lng: coordinates.lng });
    }
  };

  // Calculate the display time based on offset
  const displayTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + timeOffset);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }, [timeOffset]);

  const decrementTime = () => {
    if (timeOffset > -10) {
      setTimeOffset(prev => prev - 1);
    }
  };

  const incrementTime = () => {
    if (timeOffset < 0) {
      setTimeOffset(prev => prev + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass border-primary/20 shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-gradient">Drop a Wink</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Map Preview */}
          <MapPreview radius={radius} onLocationChange={handleLocationChange} />

          {/* Time Selector - Digital Stepper */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              When did you see them?
            </label>
            
            <div className="rounded-2xl bg-foreground/5 border border-foreground/10 p-4">
              <div className="flex items-center justify-center gap-4">
                {/* Minus Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={decrementTime}
                  disabled={timeOffset <= -10}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    "bg-foreground/10 border border-foreground/20",
                    "hover:bg-foreground/15 hover:border-foreground/30",
                    "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                >
                  <Minus className="w-5 h-5 text-foreground" />
                </motion.button>

                {/* Time Display */}
                <div className="min-w-[120px] text-center">
                  <span className="text-4xl font-bold font-mono text-foreground tracking-wider">
                    {displayTime}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {timeOffset === 0 ? 'Right now' : `${Math.abs(timeOffset)} min${Math.abs(timeOffset) > 1 ? 's' : ''} ago`}
                  </p>
                </div>

                {/* Plus Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={incrementTime}
                  disabled={timeOffset >= 0}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    "bg-foreground/10 border border-foreground/20",
                    "hover:bg-foreground/15 hover:border-foreground/30",
                    "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                >
                  <Plus className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Radius Selector - Pill Buttons */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              Search radius
            </label>
            
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              {RADIUS_OPTIONS.map((option) => (
                <motion.button
                  key={option}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRadius(option)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    radius === option
                      ? "bg-[#8A2BE2] text-white shadow-[0_0_20px_rgba(138,43,226,0.5)]"
                      : "bg-transparent border border-foreground/20 text-foreground hover:border-foreground/40"
                  )}
                >
                  {option}m
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            className="w-full h-14 text-lg" 
            size="lg"
            variant="glow"
            disabled={!coordinates}
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
