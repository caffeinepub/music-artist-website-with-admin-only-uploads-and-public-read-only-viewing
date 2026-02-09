import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  if (isAuthenticated) {
    return (
      <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isLoggingIn} variant="default" size="sm" className="gap-2">
          {isLoggingIn ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Login
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleAuth} disabled={isLoggingIn}>
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAuth} disabled={isLoggingIn}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
