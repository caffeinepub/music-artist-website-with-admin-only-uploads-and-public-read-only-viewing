import { useGetAllEvents } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

export default function ShowsPage() {
  const { data: events, isLoading } = useGetAllEvents();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const sortedEvents = events
    ? [...events].sort((a, b) => Number(a.date - b.date))
    : [];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Shows</h1>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Catch us live at upcoming performances
          </p>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-5 w-1/2 mb-2" />
                    <Skeleton className="h-5 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedEvents.length > 0 ? (
            <div className="space-y-4">
              {sortedEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 text-amber-500">
                          <Calendar className="w-4 h-4" />
                          <span className="font-semibold">{formatDate(event.date)}</span>
                        </div>
                        <h3 className="text-xl font-bold">{event.venue}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{event.city}</span>
                        </div>
                      </div>
                      {event.ticketLink && (
                        <Button variant="default" className="gap-2" asChild>
                          <a href={event.ticketLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            Get Tickets
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-lg">No upcoming shows</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
