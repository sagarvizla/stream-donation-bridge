import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, AlertCircle } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailVerificationInfo, setShowEmailVerificationInfo] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getErrorMessage = (error: any) => {
    const message = error?.message?.toLowerCase() || '';
    
    if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
      return {
        title: "Invalid Credentials",
        description: "The email or password you entered is incorrect. Please double-check your credentials and try again.",
        suggestions: [
          "Verify your email address is spelled correctly",
          "Check that your password is correct (passwords are case-sensitive)",
          "If you recently signed up, make sure you've verified your email address"
        ]
      };
    }
    
    if (message.includes('email not confirmed') || message.includes('email confirmation')) {
      return {
        title: "Email Not Verified",
        description: "Please check your email and click the verification link before signing in.",
        suggestions: [
          "Check your email inbox (including spam/junk folders)",
          "Look for an email from Supabase with a verification link",
          "Click the verification link to activate your account"
        ]
      };
    }
    
    if (message.includes('user already registered') || message.includes('already exists')) {
      return {
        title: "Account Already Exists",
        description: "An account with this email already exists. Try signing in instead.",
        suggestions: [
          "Use the 'Sign In' option below",
          "If you forgot your password, you may need to reset it"
        ]
      };
    }
    
    return {
      title: "Authentication Error",
      description: error?.message || "An unexpected error occurred during authentication.",
      suggestions: []
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowEmailVerificationInfo(false);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        const errorInfo = getErrorMessage(error);
        
        toast({
          title: errorInfo.title,
          description: errorInfo.description,
          variant: "destructive"
        });

        // Show additional suggestions for common errors
        if (errorInfo.suggestions.length > 0) {
          setTimeout(() => {
            toast({
              title: "Troubleshooting Tips",
              description: errorInfo.suggestions.join(" • "),
              duration: 8000
            });
          }, 1000);
        }
      } else {
        if (isSignUp) {
          setShowEmailVerificationInfo(true);
          toast({
            title: "Account Created Successfully",
            description: "Please check your email to verify your account before signing in.",
            duration: 6000
          });
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the authentication service. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-md p-6 glass-card">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2">
            UPI Donation Bridge
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your streamer account' : 'Sign in to your account'}
          </p>
        </div>

        {showEmailVerificationInfo && (
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Check your email!</strong> We've sent a verification link to {email}. 
              Click the link to activate your account, then return here to sign in.
            </AlertDescription>
          </Alert>
        )}

        {!isSignUp && (
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              <strong>Having trouble signing in?</strong> Make sure you've verified your email address 
              if you recently created an account. Check your spam folder if you don't see the verification email.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="streamer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              minLength={6}
            />
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setShowEmailVerificationInfo(false);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        {!isSignUp && (
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Forgot your password? Contact support for assistance.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Auth;