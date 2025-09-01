import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart, Stethoscope, Shield } from "lucide-react";

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-background/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Health Mate
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your personal health companion. Take control of your wellness journey.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Feature highlights */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Stethoscope className="w-5 h-5 text-primary" />
              <span>AI-powered health insights</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Shield className="w-5 h-5 text-primary" />
              <span>Secure & private health records</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Heart className="w-5 h-5 text-primary" />
              <span>24/7 emergency support</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSignUp}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              Create Account
            </Button>
            
            <Button
              onClick={handleSignIn}
              variant="outline"
              className="w-full h-12 text-base font-medium"
            >
              Sign In
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;