import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ArtistProfile, Release, Track, Video, Event, GalleryItem, UserProfile, UserPlan } from '../backend';

// Artist Profile
export function useGetProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<ArtistProfile | null>({
    queryKey: ['artistProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

// Releases
export function useGetAllReleases() {
  const { actor, isFetching } = useActor();

  return useQuery<Release[]>({
    queryKey: ['releases'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReleases();
    },
    enabled: !!actor && !isFetching,
  });
}

// Tracks
export function useGetAllTracks() {
  const { actor, isFetching } = useActor();

  return useQuery<Track[]>({
    queryKey: ['tracks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTracks();
    },
    enabled: !!actor && !isFetching,
  });
}

// Videos
export function useGetAllVideos() {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

// Events
export function useGetAllEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

// Gallery
export function useGetAllGalleryItems() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['galleryItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGalleryItems();
    },
    enabled: !!actor && !isFetching,
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Status
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// User Plans
export function useGetAllUserPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<UserPlan[]>({
    queryKey: ['userPlans'],
    queryFn: async () => {
      if (!actor) return [];
      const plans = await actor.getAllUserPlans();
      return plans || [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCurrentUserPlan() {
  const { actor, isFetching } = useActor();

  return useQuery<UserPlan | null>({
    queryKey: ['currentUserPlan'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCurrentUserPlan();
      } catch (error) {
        console.error('Error fetching current user plan:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}
