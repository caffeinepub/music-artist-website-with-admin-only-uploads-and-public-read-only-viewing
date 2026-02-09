import { useGetAllReleases, useGetAllTracks } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPlatformInfo } from '@/utils/platformLinks';

export default function ReleasesPage() {
  const { data: releases, isLoading: releasesLoading } = useGetAllReleases();
  const { data: tracks, isLoading: tracksLoading } = useGetAllTracks();

  const isLoading = releasesLoading || tracksLoading;

  const getTracksForRelease = (releaseId: string) => {
    return tracks?.filter((track) => track.releaseId === releaseId) || [];
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Music</h1>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Explore the latest releases and tracks
          </p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-64 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : releases && releases.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {releases.map((release) => {
                const releaseTracks = getTracksForRelease(release.id);
                return (
                  <Card key={release.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <img
                          src={release.coverImage.getDirectURL()}
                          alt={release.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="text-2xl mb-2">{release.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">{formatDate(release.date)}</p>

                      {releaseTracks.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Tracks
                          </h4>
                          <div className="space-y-1">
                            {releaseTracks.map((track, index) => (
                              <div key={track.id} className="flex items-center gap-2 text-sm">
                                <Music className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{index + 1}.</span>
                                <span>{track.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {release.streamingLinks.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {release.streamingLinks.map((link, index) => {
                            const platformInfo = getPlatformInfo(link, 'Listen');
                            return (
                              <Button key={index} variant="outline" size="sm" asChild>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="gap-2">
                                  {platformInfo.icon}
                                  {platformInfo.label}
                                </a>
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-lg">No releases yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
