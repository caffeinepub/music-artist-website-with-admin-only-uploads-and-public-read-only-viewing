import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ArtistProfile, Release, Track, Video, Event, GalleryItem, UserPlan } from '../backend';
import { toast } from 'sonner';

// Artist Profile
export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ArtistProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistProfile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

// Releases
export function useAddRelease() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (release: Release) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRelease(release);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      toast.success('Release added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add release');
    },
  });
}

export function useUpdateRelease() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (release: Release) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRelease(release);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      toast.success('Release updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update release');
    },
  });
}

export function useDeleteRelease() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRelease(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      toast.success('Release deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete release');
    },
  });
}

// Tracks
export function useAddTrack() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (track: Track) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTrack(track);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      toast.success('Track added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add track');
    },
  });
}

export function useUpdateTrack() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (track: Track) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTrack(track);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      toast.success('Track updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update track');
    },
  });
}

export function useDeleteTrack() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTrack(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      toast.success('Track deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete track');
    },
  });
}

// Videos
export function useAddVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (video: Video) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVideo(video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add video');
    },
  });
}

export function useUpdateVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (video: Video) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateVideo(video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update video');
    },
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVideo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete video');
    },
  });
}

// Events
export function useAddEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Event) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEvent(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add event');
    },
  });
}

export function useUpdateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Event) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEvent(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update event');
    },
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });
}

// Gallery
export function useAddGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: GalleryItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      toast.success('Gallery item added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add gallery item');
    },
  });
}

export function useUpdateGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: GalleryItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGalleryItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      toast.success('Gallery item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update gallery item');
    },
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
      toast.success('Gallery item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete gallery item');
    },
  });
}

// User Plans (Admin)
export function useCreateUserPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: UserPlan) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createUserPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPlans'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserPlan'] });
      toast.success('Plan created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create plan');
    },
  });
}

export function useUpdateUserPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: UserPlan) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPlans'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserPlan'] });
      toast.success('Plan updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update plan');
    },
  });
}

export function useDeleteUserPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteUserPlan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPlans'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserPlan'] });
      toast.success('Plan deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete plan');
    },
  });
}

// User Plan Assignment (Non-admin)
export function useAssignUserPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignUserPlan(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserPlan'] });
      toast.success('Plan selected successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to select plan');
    },
  });
}
