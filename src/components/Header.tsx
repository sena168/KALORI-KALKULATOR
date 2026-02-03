import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const showAdminButton = Boolean(user) && location.pathname !== "/admin";
  const showCalculatorButton = Boolean(user) && location.pathname === "/admin";

  const handleSignOut = async () => {
    const confirmed = window.confirm("Keluar dari akun?");
    if (!confirmed) return;
    try {
      await signOut();
    } finally {
      try {
        localStorage.removeItem("guest-access");
      } catch (error) {
        console.warn("Guest access cleanup failed:", error);
      }
      window.location.assign("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4 h-16 md:h-20 lg:h-24 flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3 md:gap-4">
          <img 
            src="/santo-yusup.png" 
            alt="Logo" 
            className="h-10 w-10 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-lg object-cover"
          />
          <h1 className="text-tv-title text-foreground font-bold">
            Kalkulator Kalori
          </h1>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {showAdminButton && (
            <Button asChild variant="secondary" className="touch-target">
              <Link to="/admin">Admin Page</Link>
            </Button>
          )}
          {showCalculatorButton && (
            <Button asChild variant="secondary" className="touch-target">
              <Link to="/">Kalkulator</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="touch-target text-muted-foreground hover:text-foreground"
            title="Keluar"
          >
            <LogOut className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
