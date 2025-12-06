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

interface MatchData {
  id: string;
  lat: number;
  lng: number;
  timeAgo: string;
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
  const [currentMatch, setCurrentMatch] = useState<MatchData | null>(null);

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
        .select(`
          id,
          created_at,
          user_a,
          user_b,
          wink:winks(lat, lng)
        `)
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (matches && matches.length > 0) {
        setHasNotification(true);
        // Set the most recent match data
        const latestMatch = matches[0] as any;
        setCurrentMatch({
          id: latestMatch.id,
          lat: latestMatch.wink?.lat || 0,
          lng: latestMatch.wink?.lng || 0,
          timeAgo: formatTimestamp(new Date(latestMatch.created_at)),
        });
      }
    };
    checkMatches();

    // Subscribe to real-time match notifications
    const matchChannel = supabase
      .channel('match-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
        },
        async (payload) => {
          const newMatch = payload.new as any;
          // Check if this match involves the current user
          if (newMatch.user_a === user.id || newMatch.user_b === user.id) {
            // Fetch the wink location for this match
            const { data: wink } = await supabase
              .from('winks')
              .select('lat, lng')
              .eq('id', newMatch.wink_id)
              .maybeSingle();

            setCurrentMatch({
              id: newMatch.id,
              lat: wink?.lat || 0,
              lng: wink?.lng || 0,
              timeAgo: 'Just now',
            });
            setHasNotification(true);
            setShowMatch(true);

            toast({
              title: "It's a match! 💜",
              description: "Someone noticed you too!",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchChannel);
    };
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

      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#050505' }}>
        {/* Street-Level Dark Mode Map - "Midnight Blueprint" Treatment */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555662092-3363be252a92?q=80&w=2600&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'grayscale(100%) invert(85%) contrast(120%) brightness(60%)',
          }}
        />
        {/* CSS Grid Fallback (shows if image fails) */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundColor: '#0a0a0a',
            backgroundImage: `
              linear-gradient(rgba(40, 40, 40, 0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(40, 40, 40, 0.8) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Cinematic Radial Gradient Overlay - Spotlight Center */}
        <div 
          className="fixed inset-0 z-[1]"
          style={{
            background: `
              radial-gradient(
                ellipse 60% 55% at 50% 50%,
                transparent 0%,
                rgba(5, 5, 5, 0.4) 35%,
                rgba(5, 5, 5, 0.7) 55%,
                rgba(5, 5, 5, 0.9) 75%,
                #050505 100%
              )
            `,
          }}
        />
        {/* Subtle ambient glow behind the button */}
        <div className="ambient-glow" />
        <Header
          hasNotification={hasNotification}
          onNotificationClick={() => setShowMatch(true)}
        />

        {/* Main content */}
        <main className="pt-20 pb-8 px-4 max-w-md mx-auto relative z-10">
          {/* Hero section */}
          <div className="text-center py-12">
            <h1 className="font-display text-3xl font-bold mb-3" style={{ letterSpacing: '-0.02em' }}>
              <span className="text-gradient">Never Miss</span>
              <br />
              <span className="text-white">a Connection</span>
            </h1>
            <p className="font-sans text-lg text-silver max-w-[300px] mx-auto leading-relaxed">
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
          matchData={currentMatch ? {
            lat: currentMatch.lat,
            lng: currentMatch.lng,
            timeAgo: currentMatch.timeAgo,
          } : {
            lat: 51.5074,
            lng: -0.1278,
            timeAgo: 'Just now',
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
          matchId={currentMatch?.id || null}
          matchLocation={currentMatch ? { lat: currentMatch.lat, lng: currentMatch.lng } : { lat: 51.5074, lng: -0.1278 }}
        />
      </div>
    </>
  );
};

export default Index;
