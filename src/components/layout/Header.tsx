
import { Link } from "react-router-dom";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import HeaderLogo from "./header/HeaderLogo";
import ProvinceSelector from "./header/ProvinceSelector";
import { Navigation } from "./header/Navigation";
import SearchBar from "./header/SearchBar";
import UserMenu from "./header/UserMenu";
import MobileMenu from "./header/MobileMenu";
import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { supabase } = useSupabase();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // Fetch unread message count on initial load
  useEffect(() => {
    if (!user) return;
    
    const fetchUnreadCount = async () => {
      try {
        // Get total unread count across all conversations
        const { data, error } = await supabase
          .from('conversations')
          .select('unread_count')
          .contains('participants', [user.id]);
          
        if (error) {
          console.error("Error fetching unread count:", error);
          return;
        }
        
        const totalUnread = data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
        setUnreadMessageCount(totalUnread);
      } catch (err) {
        console.error("Error calculating unread messages:", err);
      }
    };
    
    fetchUnreadCount();
    
    // Set up real-time subscription for conversations
    const conversationChannel = supabase
      .channel('header-unread-count')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
        filter: `participants=cs.{${user.id}}`
      }, () => {
        // When any conversation updates, refresh the count
        fetchUnreadCount();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(conversationChannel);
    };
  }, [user, supabase]);

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm transition-colors duration-300">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto relative">
        {/* Logo and Province Selector */}
        <div className="flex items-center gap-1 pr-4">
          <HeaderLogo />
          
          {!isMobile && (
            <div className="ml-1">
              <ProvinceSelector className="w-[140px] h-9" />
            </div>
          )}
        </div>
        
        {/* Main Navigation - Desktop */}
        {!isMobile && (
          <Navigation 
            isAuthenticated={!!user} 
            className="hidden md:flex items-center space-x-6 flex-1 justify-center" 
          />
        )}

        {/* Desktop Right Side Menu */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-2">
            <SearchBar />
            
            {user && (
              <>
                <Link to="/messages">
                  <Button variant="ghost" size="icon" aria-label="Messages" className="relative">
                    <MessageSquare className="h-5 w-5" />
                    {unreadMessageCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                      >
                        {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                </Button>
              </>
            )}
            
            <ThemeToggle />
            <UserMenu />
          </div>
        )}

        {/* Mobile Menu */}
        <MobileMenu isAuthenticated={!!user} unreadMessageCount={unreadMessageCount} />
      </div>
    </header>
  );
};

export default Header;
