import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MatchRevealProps {
  open: boolean;
  onClose: () => void;
  onStartChat?: () => void;
  myProfile?: {
    name: string;
    image?: string;
  };
  theirProfile?: {
    name: string;
    image?: string;
    interests: string[];
  };
}

const interestIcons: Record<string, string> = {
  'Boxing': '🥊',
  'Cycling': '🚴',
  'Philosophy': '📚',
  'Techno': '🎵',
  'Running': '🏃',
  'Yoga': '🧘',
  'Photography': '📸',
  'Travel': '✈️',
  'Coffee': '☕',
  'Music': '🎶',
};

const MatchReveal: React.FC<MatchRevealProps> = ({
  open,
  onClose,
  onStartChat,
  myProfile = {
    name: 'You',
    image: undefined,
  },
  theirProfile = {
    name: 'Alex',
    image: undefined,
    interests: ['Boxing', 'Cycling', 'Philosophy', 'Techno'],
  },
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Dimmed map background */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
          
          {/* Ambient glow effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, hsl(var(--cyan) / 0.2) 0%, transparent 70%)' }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
              style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)' }}
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />
          </div>

          {/* Main content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-md z-10"
          >
            {/* Glowing title */}
            <motion.div 
              className="text-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 mb-2"
                animate={{ 
                  textShadow: [
                    '0 0 20px hsl(var(--cyan))',
                    '0 0 40px hsl(var(--cyan))',
                    '0 0 20px hsl(var(--cyan))',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-cyan drop-shadow-[0_0_10px_hsl(var(--cyan))]" />
                <h1 className="text-3xl font-bold text-foreground drop-shadow-[0_0_20px_hsl(var(--cyan)/0.5)]">
                  Synergy Detected!
                </h1>
                <Sparkles className="w-6 h-6 text-cyan drop-shadow-[0_0_10px_hsl(var(--cyan))]" />
              </motion.div>
            </motion.div>

            {/* Profile cards container */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {/* My profile card */}
              <motion.div
                initial={{ x: -50, opacity: 0, rotateY: -15 }}
                animate={{ x: 0, opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="relative"
              >
                <div className="w-32 h-40 rounded-2xl glass border border-primary/30 shadow-elevated overflow-hidden flex flex-col items-center justify-center p-3">
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-2 shadow-button">
                    {myProfile.image ? (
                      <img src={myProfile.image} alt={myProfile.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-primary-foreground">
                        {myProfile.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{myProfile.name}</p>
                </div>
                
                {/* Connecting glow line */}
                <motion.div
                  className="absolute top-1/2 -right-4 w-4 h-0.5"
                  style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--cyan)))' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6 }}
                />
              </motion.div>

              {/* Connection icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="relative z-10"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-primary flex items-center justify-center shadow-glow">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Their profile card */}
              <motion.div
                initial={{ x: 50, opacity: 0, rotateY: 15 }}
                animate={{ x: 0, opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="relative"
              >
                <motion.div
                  className="absolute -left-4 top-1/2 w-4 h-0.5"
                  style={{ background: 'linear-gradient(90deg, hsl(var(--cyan)), hsl(var(--primary)))' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6 }}
                />
                
                <div className="w-32 h-40 rounded-2xl glass border border-cyan/30 shadow-elevated overflow-hidden flex flex-col items-center justify-center p-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan to-primary flex items-center justify-center mb-2 shadow-[0_0_30px_hsl(var(--cyan)/0.5)]">
                    {theirProfile.image ? (
                      <img src={theirProfile.image} alt={theirProfile.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-primary-foreground">
                        {theirProfile.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{theirProfile.name}</p>
                </div>
              </motion.div>
            </div>

            {/* Interest chips */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <p className="text-center text-sm text-muted-foreground mb-3">Shared Interests</p>
              <div className="flex flex-wrap justify-center gap-2">
                {theirProfile.interests.map((interest, index) => (
                  <motion.span
                    key={interest}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                    className="px-4 py-2 rounded-full text-sm font-medium text-foreground border border-cyan/50 bg-cyan/10 shadow-[0_0_15px_hsl(var(--cyan)/0.3)] hover:shadow-[0_0_25px_hsl(var(--cyan)/0.5)] transition-shadow"
                  >
                    {interestIcons[interest] || '✨'} {interest}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Start Chat button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="space-y-3"
            >
              <Button
                onClick={onStartChat}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_30px_hsl(142_76%_36%/0.5)] hover:shadow-[0_0_40px_hsl(142_76%_36%/0.7)] transition-all"
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                Start Chat
              </Button>
              
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Maybe later
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchReveal;
