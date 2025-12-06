import React from 'react';
import { Eye, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  hasNotification?: boolean;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  hasNotification,
  onNotificationClick,
  onProfileClick,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-button">
            <Eye className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient">Winklet</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationClick}
            className="relative"
          >
            <Bell className="w-5 h-5" />
            {hasNotification && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onProfileClick}
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
