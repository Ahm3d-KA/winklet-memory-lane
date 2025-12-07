import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface ChatWindowProps {
  open: boolean;
  onClose: () => void;
  matchId: string | null;
  matchLocation: { lat: number; lng: number };
  matchName?: string | null;
}

// Format coordinates to a readable string
const formatCoords = (lat: number, lng: number) => {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ open, onClose, matchId, matchLocation, matchName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [matchNotFound, setMatchNotFound] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages when chat opens
  useEffect(() => {
    if (!open || !matchId) return;

    setMatchNotFound(false);

    const fetchMessages = async () => {
      setLoading(true);
      
      // First verify the match still exists
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('id')
        .eq('id', matchId)
        .maybeSingle();

      if (matchError || !matchData) {
        console.error('Match not found:', matchError);
        setMatchNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to new messages in real-time
    const channel = supabase
      .channel(`messages-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, matchId]);

  const handleSend = async () => {
    if (!inputValue.trim() || !matchId || !user) return;

    setSending(true);
    const { error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: user.id,
        content: inputValue.trim(),
      });

    if (error) {
      console.error('Error sending message:', error);
    }
    
    setInputValue('');
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'h:mm a');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <div className="flex flex-col h-full max-w-md mx-auto">
            {/* Header */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-3 p-4 glass border-b border-border/50"
            >
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground">{matchName || 'Your Match'}</h2>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="font-mono text-cyan/80">
                    {formatCoords(matchLocation.lat, matchLocation.lng)}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-secondary-foreground" />
              </div>
            </motion.header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Match banner */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  You matched! Say hello.
                </div>
              </motion.div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : matchNotFound ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm mb-2">This match no longer exists</p>
                  <p className="text-xs text-muted-foreground/60">It may have expired or been deleted</p>
                  <Button variant="outline" onClick={onClose} className="mt-4">
                    Go Back
                  </Button>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No messages yet. Be the first to say hi!
                </div>
              ) : (
                /* Message list */
                messages.map((message, index) => {
                  const isOwn = message.sender_id === user?.id;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          isOwn
                            ? 'gradient-primary text-primary-foreground rounded-br-md'
                            : 'glass border border-border/50 text-foreground rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-[10px] mt-1 ${
                          isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {formatTimestamp(message.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 glass border-t border-border/50"
            >
              <div className="flex items-center gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-muted/50 border-border/50 focus:border-primary/50"
                  disabled={sending}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="gradient-primary shadow-button shrink-0"
                  disabled={!inputValue.trim() || sending}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;