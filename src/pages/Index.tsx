import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import WinkButton from '@/components/WinkButton';
import WinkModal from '@/components/WinkModal';
import SuccessOverlay from '@/components/SuccessOverlay';
import MatchNotification from '@/components/MatchNotification';
import WinkHistory from '@/components/WinkHistory';
import { useToast } from '@/hooks/use-toast';

// Mock W3W addresses for demo
const mockW3WAddresses = [
  'filled.count.soap',
  'star.crust.light',
  'brave.heart.shine',
  'ocean.wave.dream',
  'moon.glow.soft',
];

// Mock winks for demo
const mockWinks = [
  {
    id: '1',
    w3wAddress: 'coffee.morning.smile',
    timestamp: 'Today at 9:15 AM',
    radius: 200,
    hasMatch: true,
  },
  {
    id: '2',
    w3wAddress: 'park.bench.sunny',
    timestamp: 'Yesterday at 3:42 PM',
    radius: 300,
    hasMatch: false,
  },
];

const Index: React.FC = () => {
  const { toast } = useToast();
  const [showWinkModal, setShowWinkModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [currentW3W, setCurrentW3W] = useState('');
  const [hasNotification, setHasNotification] = useState(true);
  const [winks, setWinks] = useState(mockWinks);

  const handleWinkSubmit = (data: { timeOffset: number; radius: number }) => {
    // Generate random W3W address for demo
    const randomW3W = mockW3WAddresses[Math.floor(Math.random() * mockW3WAddresses.length)];
    setCurrentW3W(randomW3W);
    
    // Add to winks
    const newWink = {
      id: Date.now().toString(),
      w3wAddress: randomW3W,
      timestamp: 'Just now',
      radius: data.radius,
      hasMatch: false,
    };
    setWinks([newWink, ...winks]);
    
    setShowWinkModal(false);
    setShowSuccess(true);

    // Simulate a match after 3 seconds (for demo)
    setTimeout(() => {
      setHasNotification(true);
      toast({
        title: "💜 Someone noticed you too!",
        description: "You have a new match waiting",
      });
    }, 5000);
  };

  const handleRevealMatch = () => {
    setShowMatch(false);
    setHasNotification(false);
    toast({
      title: "Chat unlocked! 💬",
      description: "You can now message your match",
    });
  };

  return (
    <>
      <Helmet>
        <title>Winklet - Never Miss a Connection</title>
        <meta name="description" content="Winklet helps you reconnect with people you noticed but never met. Drop a wink when you see someone special, and if they noticed you too, you'll match." />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient glow behind the button */}
        <div className="ambient-glow" />
        <Header
          hasNotification={hasNotification}
          onNotificationClick={() => setShowMatch(true)}
          onProfileClick={() => toast({ title: "Profile", description: "Coming soon!" })}
        />

        {/* Main content */}
        <main className="pt-20 pb-8 px-4 max-w-md mx-auto">
          {/* Hero section */}
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-3">
              <span className="text-gradient">Never Miss</span>
              <br />
              <span className="text-foreground">a Connection</span>
            </h1>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Noticed someone? Drop a wink. If they noticed you too, you'll match.
            </p>
          </div>

          {/* Wink button */}
          <div className="flex justify-center py-8">
            <WinkButton onClick={() => setShowWinkModal(true)} />
          </div>

          {/* Wink history */}
          <div className="mt-12">
            <WinkHistory 
              winks={winks} 
              onWinkClick={(wink) => {
                if (wink.hasMatch) {
                  setShowMatch(true);
                }
              }}
            />
          </div>
        </main>

        {/* Modals */}
        <WinkModal
          open={showWinkModal}
          onOpenChange={setShowWinkModal}
          onSubmit={handleWinkSubmit}
        />

        <SuccessOverlay
          open={showSuccess}
          onClose={() => setShowSuccess(false)}
          w3wAddress={currentW3W}
        />

        <MatchNotification
          open={showMatch}
          onClose={() => setShowMatch(false)}
          onReveal={handleRevealMatch}
          isFemaleView={true}
          matchData={{
            w3wAddress: 'filled.count.soap',
            timeAgo: 'Yesterday at 3:42 PM',
          }}
        />
      </div>
    </>
  );
};

export default Index;
