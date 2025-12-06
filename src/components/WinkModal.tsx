import React, { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Sparkles } from 'lucide-react';
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
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
  const [radius, setRadius] = useState(100);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  }, []);

  // Calculate time offset in minutes from now
  const timeOffset = useMemo(() => {
    const now = new Date();
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const selected = new Date();
    selected.setHours(hours, minutes, 0, 0);
    return Math.round((selected.getTime() - now.getTime()) / 60000);
  }, [selectedTime]);

  const handleSubmit = () => {
    if (coordinates) {
      onSubmit({ timeOffset, radius, lat: coordinates.lat, lng: coordinates.lng });
    }
  };

  // Get max time (current time) for validation
  const maxTime = useMemo(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }, []);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    const now = new Date();
    const [hours, minutes] = newTime.split(':').map(Number);
    const selected = new Date();
    selected.setHours(hours, minutes, 0, 0);
    
    // Prevent future times
    if (selected <= now) {
      setSelectedTime(newTime);
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

          {/* Time Selector - Neon Clock */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2 text-[#A0A0A0]">
              <Clock className="w-4 h-4 text-primary" />
              When did you see them?
            </label>
            
            {/* Inset container - Deep Black */}
            <div 
              className="rounded-2xl p-6"
              style={{
                backgroundColor: '#111111',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                {/* Native Time Input - Neon Clock Style */}
                <input
                  type="time"
                  value={selectedTime}
                  max={maxTime}
                  onChange={handleTimeChange}
                  className="bg-transparent border-none outline-none text-center cursor-pointer"
                  style={{
                    fontFamily: "'Roboto Mono', 'Courier New', monospace",
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#D500F9',
                    textShadow: '0px 0px 10px rgba(213, 0, 249, 0.4)',
                    letterSpacing: '0.05em',
                  }}
                />
                <p className="text-xs text-[#71717A]">
                  {timeOffset === 0 ? 'Right now' : timeOffset > 0 ? 'Invalid (future time)' : `${Math.abs(timeOffset)} min${Math.abs(timeOffset) > 1 ? 's' : ''} ago`}
                </p>
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
