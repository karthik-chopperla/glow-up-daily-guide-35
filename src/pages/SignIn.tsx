import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { validateEmail, sanitizeInput, authRateLimiter, logSecurityEvent } from "@/utils/validation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { signIn, user, profile, redirectToRoleDashboard } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // If user is already authenticated with a role, redirect to dashboard
    if (user && profile?.role) {
      redirectToRoleDashboard(profile.role);
    } else if (user && !profile?.role) {
      // User exists but no role selected, go to role selection
      navigate('/role-selection');
    }
  }, [user, profile, navigate, redirectToRoleDashboard]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    if (!authRateLimiter.isAllowed(`signin-${email}`, 5, 15 * 60 * 1000)) {
      const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(`signin-${email}`, 15 * 60 * 1000) / 1000 / 60);
      setErrors({ general: `Too many login attempts. Please try again in ${remainingTime} minutes.` });
      await logSecurityEvent('RATE_LIMIT_EXCEEDED', { action: 'signin', email });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email);
      const { error } = await signIn(sanitizedEmail, password);
      
      if (error) {
        await logSecurityEvent('SIGNIN_FAILED', { email: sanitizedEmail, error: error.message });
        
        if (error.message?.includes('Invalid login credentials')) {
          setErrors({ general: 'Invalid email or password. Please check your credentials and try again.' });
        } else if (error.message?.includes('Email not confirmed')) {
          setErrors({ general: 'Please check your email and confirm your account before signing in.' });
        } else {
          setErrors({ general: error.message || "Failed to sign in" });
        }
        setIsLoading(false);
        return;
      }
      
      await logSecurityEvent('SIGNIN_SUCCESS', { email: sanitizedEmail });

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to Health Mate.",
      });

      // The auth state change will handle redirection based on role
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to sign in" });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-background/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/welcome')}
            className="absolute top-4 left-4 h-8 w-8 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your Health Mate account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-destructive" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{errors.general}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-primary hover:underline font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;