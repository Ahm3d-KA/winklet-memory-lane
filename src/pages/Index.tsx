import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Wink {
  id: string;
  lat: number;
  lng: number;
  timestamp: string;
  radius: number;
  hasMatch?: boolean;
}

const Index: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showWinkModal, setShowWinkModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [showWinkDetail, setShowWinkDetail] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedWink, setSelectedWink] = useState<Wink | null>(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [hasNotification, setHasNotification] = useState(false);
  const [winks, setWinks] = useState<Wink[]>([]);
  const [loading, setLoading] = useState(true);

  // Load winks from database
  useEffect(() => {
    if (!user) return;

    const fetchWinks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('winks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching winks:', error);
        toast({
          title: "Error loading winks",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        const formattedWinks: Wink[] = data.map((wink) => ({
          id: wink.id,
          lat: wink.lat,
          lng: wink.lng,
          timestamp: formatTimestamp(new Date(wink.created_at)),
          radius: wink.radius,
          hasMatch: false, // TODO: Check matches table
        }));
        setWinks(formattedWinks);
      }
      setLoading(false);
    };

    fetchWinks();

    // Check for matches
    const checkMatches = async () => {
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);
      
      if (matches && matches.length > 0) {
        setHasNotification(true);
      }
    };
    checkMatches();
  }, [user, toast]);

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `Today at ${format(date, 'h:mm a')}`;
    if (diffDays === 1) return `Yesterday at ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d') + ' at ' + format(date, 'h:mm a');
  };

  const handleWinkSubmit = async (data: { timeOffset: number; radius: number; lat: number; lng: number }) => {
    if (!user) return;

    setCurrentLocation({ lat: data.lat, lng: data.lng });
    
    // Save wink to database
    const { data: newWinkData, error } = await supabase
      .from('winks')
      .insert({
        user_id: user.id,
        lat: data.lat,
        lng: data.lng,
        radius: data.radius,
        time_offset: data.timeOffset,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving wink:', error);
      toast({
        title: "Error dropping wink",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Add to local state
    const newWink: Wink = {
      id: newWinkData.id,
      lat: data.lat,
      lng: data.lng,
      timestamp: 'Just now',
      radius: data.radius,
      hasMatch: false,
    };
    setWinks([newWink, ...winks]);
    
    setShowWinkModal(false);
    setShowSuccess(true);

    toast({
      title: "Wink dropped! 💜",
      description: "We'll notify you if there's a match",
    });
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
        {/* Dark city street map background */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555679427-1f6dfcce943b?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Romantic dark overlay - makes streets barely visible */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, rgba(15,15,22,0.92) 0%, rgba(15,15,22,0.85) 40%, rgba(20,10,30,0.90) 100%)',
          }}
        />
        {/* Radar/topographic background pattern */}
        <div className="radar-bg" />
        {/* Ambient glow behind the button */}
        <div className="ambient-glow" />
        <Header
          hasNotification={hasNotification}
          onNotificationClick={() => setShowMatch(true)}
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
            {loading ? (
              <div className="text-center text-muted-foreground">Loading your winks...</div>
            ) : (
              <WinkHistory 
                winks={winks} 
                onWinkClick={handleWinkClick}
              />
            )}
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
