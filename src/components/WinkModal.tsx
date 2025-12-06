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
      <DialogContent 
        className="sm:max-w-md border-[#3F3F46] bg-[#18181B]"
        style={{
          boxShadow: '0px 10px 40px rgba(0,0,0,0.8)',
        }}
      >
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-lg"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-gradient">Drop a Wink</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 relative z-10">
          {/* Map Preview */}
          <MapPreview radius={radius} onLocationChange={handleLocationChange} />

          {/* Time Selector - Inset Style */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2 text-[#A0A0A0]">
              <Clock className="w-4 h-4 text-primary" />
              When did you see them?
            </label>
            
            {/* Inset container - Deep Black */}
            <div 
              className="rounded-2xl p-4"
              style={{
                backgroundColor: '#09090B',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex items-center justify-center gap-4">
                {/* Minus Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={decrementTime}
                  disabled={timeOffset <= -10}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    "bg-[#18181B] border border-[#3F3F46]",
                    "hover:bg-[#27272A] hover:border-[#52525B]",
                    "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                >
                  <Minus className="w-5 h-5 text-white" />
                </motion.button>

                {/* Time Display */}
                <div className="min-w-[120px] text-center">
                  <span className="text-4xl font-bold font-mono text-white tracking-wider">
                    {displayTime}
                  </span>
                  <p className="text-xs text-[#71717A] mt-1">
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
                    "bg-[#18181B] border border-[#3F3F46]",
                    "hover:bg-[#27272A] hover:border-[#52525B]",
                    "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                >
                  <Plus className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Radius Selector - Inset Style */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2 text-[#A0A0A0]">
              <MapPin className="w-4 h-4 text-primary" />
              Search radius
            </label>
            
            {/* Inset container - Deep Black */}
            <div 
              className="rounded-2xl p-4"
              style={{
                backgroundColor: '#09090B',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                {RADIUS_OPTIONS.map((option) => (
                  <motion.button
                    key={option}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRadius(option)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      radius === option
                        ? "bg-primary text-white shadow-[0_0_20px_hsl(280_70%_60%/0.5)]"
                        : "bg-transparent border border-[#52525B] text-[#A0A0A0] hover:border-[#71717A] hover:text-white"
                    )}
                    style={radius === option ? {
                      textShadow: '0 0 10px rgba(255,255,255,0.5)',
                    } : undefined}
                  >
                    {option}m
                  </motion.button>
                ))}
              </div>
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
