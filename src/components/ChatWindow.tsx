import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: string;
}

interface ChatWindowProps {
  open: boolean;
  onClose: () => void;
  matchLocation: { lat: number; lng: number };
}

// Format coordinates to a readable string
const formatCoords = (lat: number, lng: number) => {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ open, onClose, matchLocation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I think I noticed you too 💜",
      isOwn: false,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isOwn: true,
      timestamp: 'Just now',
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replies = [
        "That's amazing! I was hoping you'd notice 😊",
        "I felt the same connection!",
        "This is so cool, what are the chances?",
        "I was just thinking about you!",
      ];
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        isOwn: false,
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
                <h2 className="font-semibold text-foreground">Your Match</h2>
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

              {/* Message list */}
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.isOwn
                        ? 'gradient-primary text-primary-foreground rounded-br-md'
                        : 'glass border border-border/50 text-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-[10px] mt-1 ${
                      message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
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
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="gradient-primary shadow-button shrink-0"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
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
