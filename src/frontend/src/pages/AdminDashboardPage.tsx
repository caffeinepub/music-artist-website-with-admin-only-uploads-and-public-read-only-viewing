import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetCallerUserProfile } from '@/hooks/useQueries';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileEditor from '@/components/admin/forms/ProfileEditor';
import ReleasesManager from '@/components/admin/forms/ReleasesManager';
import VideosManager from '@/components/admin/forms/VideosManager';
import ShowsManager from '@/components/admin/forms/ShowsManager';
import GalleryManager from '@/components/admin/forms/GalleryManager';
import PlansManager from '@/components/admin/forms/PlansManager';
import ProfileSetupDialog from '@/components/auth/ProfileSetupDialog';
import AdminLoginRequiredScreen from '@/components/admin/AdminLoginRequiredScreen';

export default function AdminDashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Show login required screen when not authenticated
  if (!isAuthenticated) {
    return <AdminLoginRequiredScreen />;
  }

  // Show loading spinner only when authenticated and checking admin status
  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied when authenticated but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription className="text-base">
              You do not have permission to access the admin dashboard. Only authorized administrators can
              manage site content.
            </CardDescription>
            <CardDescription className="text-sm pt-4">
              Admin access is granted only to the Internet Identity Principal configured as admin during initial setup.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupDialog open={showProfileSetup} />
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your artist website content</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="releases">Releases</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="shows">Shows</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="plans">Plans</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <ProfileEditor />
              </TabsContent>

              <TabsContent value="releases">
                <ReleasesManager />
              </TabsContent>

              <TabsContent value="videos">
                <VideosManager />
              </TabsContent>

              <TabsContent value="shows">
                <ShowsManager />
              </TabsContent>

              <TabsContent value="gallery">
                <GalleryManager />
              </TabsContent>

              <TabsContent value="plans">
                <PlansManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
