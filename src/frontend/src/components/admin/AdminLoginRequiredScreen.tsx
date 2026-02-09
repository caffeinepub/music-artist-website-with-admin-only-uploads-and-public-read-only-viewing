import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import LoginButton from '@/components/auth/LoginButton';

export default function AdminLoginRequiredScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-amber-600 dark:text-amber-500" />
          <CardTitle className="text-2xl">Admin Login Required</CardTitle>
          <CardDescription className="text-base">
            You must be logged in with an authorized Internet Identity to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Admin access is Principal-based:</strong> Only the Internet Identity Principal configured as admin can access this dashboard.
            </p>
            <p>
              This application does not support username, email, phone number, or password-based admin login. All authentication is handled securely through Internet Identity.
            </p>
          </div>
          <div className="flex justify-center pt-2">
            <LoginButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
