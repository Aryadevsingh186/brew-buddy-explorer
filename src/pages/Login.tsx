
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Lock, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Log in to your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button variant="link" className="p-0 h-auto text-xs">
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-coffee-rich hover:bg-coffee-rich/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </>
          )}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" disabled>
          Google
        </Button>
        <Button variant="outline" disabled>
          Apple
        </Button>
      </div>
      
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="underline text-coffee-rich hover:text-coffee-mocha">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
