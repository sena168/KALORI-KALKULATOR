import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Landing: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (!error) {
      window.location.assign("/");
      return;
    }

    console.error("Google sign-in failed:", error);
    window.alert("Gagal masuk dengan Google. Coba lagi.");
  };

  const handleOpenApp = () => {
    try {
      localStorage.setItem("guest-access", "true");
    } catch (error) {
      console.warn("Guest access storage failed:", error);
    }
    window.location.assign("/?guest=1");
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center p-6 relative">
      {/* Logo and Branding */}
      <div className="text-center mb-10 w-full max-w-md">
        <img
          src="/bmihero.png"
          alt="BMI Hero"
          className="w-full h-auto mx-auto shadow-xl mb-8 object-contain"
        />
        <h1 className="text-tv-title text-foreground mb-4">
          Kalkulator Kalori
        </h1>
        <p className="text-tv-body text-muted-foreground">
          Hitung kalori makanan dan minuman dengan mudah dan cepat
        </p>
      </div>

      {/* Login Button Container */}
      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <Button
          size="lg"
          onClick={handleOpenApp}
          className="w-full touch-target text-tv-body font-medium px-8 md:px-12 py-6 md:py-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Buka Aplikasi
        </Button>
        <Button
          size="sm"
          onClick={handleGoogleLogin}
          className="w-full touch-target text-tv-small font-medium px-6 md:px-10 py-4 md:py-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-primary text-primary-foreground"
        >
          Login Dengan Google
        </Button>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center">
        <p className="text-xs text-muted-foreground tracking-[0.2em]">
          [PROMPT ONE VISUALS]
        </p>
      </div>
    </div>
  );
};

export default Landing;
