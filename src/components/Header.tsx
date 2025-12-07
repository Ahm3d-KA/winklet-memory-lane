import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Bell, User, MessageCircle, LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  hasNotification?: boolean;
  onNotificationClick?: () => void;
}

// Demo profiles for quick access
const demoProfiles = [
  {
    userId: 'a6beaf33-58c6-4be4-a0fc-9796ab125b33',
    name: 'Sara',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
  {
    userId: 'cd5fe93b-575e-43fe-b8a8-d8cf29a70447',
    name: 'Ben',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
];

const Header: React.FC<HeaderProps> = ({
  hasNotification,
  onNotificationClick,
}) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-button">
            <Eye className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient">Winklet</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Chats button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/chats')}
            className="relative"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>

          {/* Notifications */}
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

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass">
              {/* Demo Profiles Section */}
              <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                Demo Profiles
              </DropdownMenuLabel>
              {demoProfiles.map((profile) => (
                <DropdownMenuItem
                  key={profile.userId}
                  onClick={() => navigate(`/profile/${profile.userId}`)}
                  className="cursor-pointer"
                >
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                  </Avatar>
                  {profile.name}'s Profile
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />

              {user ? (
                <>
                  <DropdownMenuItem disabled className="text-muted-foreground text-xs">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate('/auth')}>
                  <User className="w-4 h-4 mr-2" />
                  Login / Sign up
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
