import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import WinkButton from '@/components/WinkButton';
import WinkModal from '@/components/WinkModal';
import SuccessOverlay from '@/components/SuccessOverlay';
import MatchNotification from '@/components/MatchNotification';
import WinkHistory from '@/components/WinkHistory';
import WinkDetail from '@/components/WinkDetail';
import ChatWindow from '@/components/ChatWindow';
import { useToast } from '@/hooks/use-toast';

interface Wink {
  id: string;
  lat: number;
  lng: number;
  timestamp: string;
  radius: number;
  hasMatch?: boolean;
}

// Mock winks for demo
const mockWinks: Wink[] = [
  {
    id: '1',
    lat: 51.5074,
    lng: -0.1278,
    timestamp: 'Today at 9:15 AM',
    radius: 200,
    hasMatch: true,
  },
  {
    id: '2',
    lat: 51.5155,
    lng: -0.1419,
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
  const [showWinkDetail, setShowWinkDetail] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedWink, setSelectedWink] = useState<Wink | null>(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [hasNotification, setHasNotification] = useState(true);
  const [winks, setWinks] = useState<Wink[]>(mockWinks);

  const handleWinkSubmit = async (data: { timeOffset: number; radius: number; lat: number; lng: number }) => {
    setCurrentLocation({ lat: data.lat, lng: data.lng });
    
    // Add to winks
    const newWink: Wink = {
      id: Date.now().toString(),
      lat: data.lat,
      lng: data.lng,
      timestamp: 'Just now',
      radius: data.radius,
      hasMatch: false,
    };
    setWinks([newWink, ...winks]);
    
    setShowWinkModal(false);
    setShowSuccess(true);

    // Simulate a match after 5 seconds (for demo)
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
    setShowChat(true);
    toast({
      title: "Chat unlocked! 💬",
      description: "You can now message your match",
    });
  };

  const handleWinkClick = (wink: Wink) => {
    setSelectedWink(wink);
    setShowWinkDetail(true);
  };

  const handleOpenChatFromDetail = () => {
    setShowWinkDetail(false);
    setShowChat(true);
  };

  return (
    <>
      <Helmet>
        <title>Winklet - Never Miss a Connection</title>
        <meta name="description" content="Winklet helps you reconnect with people you noticed but never met. Drop a wink when you see someone special, and if they noticed you too, you'll match." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        {/* Night city background image */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Heavy overlay to make text readable */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15, 15, 22, 0.85), rgba(15, 15, 22, 0.95))',
          }}
        />
        {/* Radar/topographic background pattern */}
        <div className="radar-bg" />
        {/* Ambient glow behind the button */}
        <div className="ambient-glow" />
        <Header
          hasNotification={hasNotification}
          onNotificationClick={() => setShowMatch(true)}
          onProfileClick={() => toast({ title: "Profile", description: "Coming soon!" })}
        />

        {/* Main content */}
        <main className="pt-20 pb-8 px-4 max-w-md mx-auto relative z-10">
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
              onWinkClick={handleWinkClick}
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
          location={currentLocation}
        />

        <MatchNotification
          open={showMatch}
          onClose={() => setShowMatch(false)}
          onReveal={handleRevealMatch}
          isFemaleView={true}
          matchData={{
            lat: 51.5074,
            lng: -0.1278,
            timeAgo: 'Yesterday at 3:42 PM',
          }}
        />

        <WinkDetail
          open={showWinkDetail}
          onClose={() => setShowWinkDetail(false)}
          onOpenChat={handleOpenChatFromDetail}
          wink={selectedWink}
        />

        <ChatWindow
          open={showChat}
          onClose={() => setShowChat(false)}
          matchLocation={selectedWink ? { lat: selectedWink.lat, lng: selectedWink.lng } : { lat: 51.5074, lng: -0.1278 }}
        />
      </div>
    </>
  );
};

export default Index;
