import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllEvents } from '@/hooks/useQueries';
import { useAddEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useAdminMutations';
import { Loader2, Plus, Trash2, Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/backend';

export default function ShowsManager() {
  const { data: events, isLoading } = useGetAllEvents();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [ticketLink, setTicketLink] = useState('');

  const resetForm = () => {
    setDate('');
    setVenue('');
    setCity('');
    setTicketLink('');
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventDate = new Date(date).getTime() * 1000000;

    const eventData: Event = {
      id: editingEvent?.id || `event-${Date.now()}`,
      date: BigInt(eventDate),
      venue: venue.trim(),
      city: city.trim(),
      ticketLink: ticketLink.trim(),
    };

    if (editingEvent) {
      await updateEvent.mutateAsync(eventData);
    } else {
      await addEvent.mutateAsync(eventData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setDate(new Date(Number(event.date) / 1000000).toISOString().split('T')[0]);
    setVenue(event.venue);
    setCity(event.city);
    setTicketLink(event.ticketLink);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent.mutateAsync(id);
    }
  };

  const sortedEvents = events ? [...events].sort((a, b) => Number(a.date - b.date)) : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Shows</CardTitle>
            <CardDescription>Manage your upcoming shows and events</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Show
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Show' : 'Add New Show'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketLink">Ticket Link</Label>
                  <Input
                    id="ticketLink"
                    type="url"
                    value={ticketLink}
                    onChange={(e) => setTicketLink(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button type="submit" disabled={addEvent.isPending || updateEvent.isPending}>
                  {addEvent.isPending || updateEvent.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Show'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : sortedEvents.length > 0 ? (
          <div className="space-y-3">
            {sortedEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-amber-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(Number(event.date) / 1000000).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <h3 className="font-semibold text-lg">{event.venue}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4" />
                        {event.city}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No shows yet</p>
        )}
      </CardContent>
    </Card>
  );
}
