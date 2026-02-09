import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useGetProfile } from '@/hooks/useQueries';
import { useUpdateProfile } from '@/hooks/useAdminMutations';
import { Loader2, Plus, X } from 'lucide-react';
import type { ArtistProfile } from '@/backend';

export default function ProfileEditor() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [socials, setSocials] = useState<string[]>([]);
  const [newSocial, setNewSocial] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio);
      setSocials(profile.socials);
    }
  }, [profile]);

  const handleAddSocial = () => {
    if (newSocial.trim()) {
      setSocials([...socials, newSocial.trim()]);
      setNewSocial('');
    }
  };

  const handleRemoveSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const profileData: ArtistProfile = {
      name: name.trim(),
      bio: bio.trim(),
      socials,
    };
    await updateProfile.mutateAsync(profileData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artist Profile</CardTitle>
        <CardDescription>Update your artist information displayed on the homepage</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Artist Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your artist name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your story..."
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Social Links</Label>
            <div className="space-y-2">
              {socials.map((social, index) => (
                <div key={index} className="flex gap-2">
                  <Input value={social} readOnly />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveSocial(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newSocial}
                  onChange={(e) => setNewSocial(e.target.value)}
                  placeholder="https://..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSocial();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddSocial}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
