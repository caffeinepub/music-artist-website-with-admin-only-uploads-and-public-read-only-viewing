import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    title: string;
    platformLink: string;
}
export interface Track {
    id: string;
    title: string;
    releaseId: string;
}
export type Time = bigint;
export interface Event {
    id: string;
    venue: string;
    city: string;
    date: Time;
    ticketLink: string;
}
export interface UserPlan {
    id: string;
    name: string;
    description: string;
    price: bigint;
}
export interface Release {
    id: string;
    title: string;
    date: Time;
    streamingLinks: Array<string>;
    coverImage: ExternalBlob;
}
export interface GalleryItem {
    id: string;
    caption: string;
    image: ExternalBlob;
}
export interface ArtistProfile {
    bio: string;
    name: string;
    socials: Array<string>;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEvent(event: Event): Promise<void>;
    addGalleryItem(item: GalleryItem): Promise<void>;
    addRelease(release: Release): Promise<void>;
    addTrack(track: Track): Promise<void>;
    addVideo(video: Video): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserPlan(planId: string): Promise<void>;
    createUserPlan(plan: UserPlan): Promise<void>;
    deleteEvent(id: string): Promise<void>;
    deleteGalleryItem(id: string): Promise<void>;
    deleteRelease(id: string): Promise<void>;
    deleteTrack(id: string): Promise<void>;
    deleteUserPlan(id: string): Promise<void>;
    deleteVideo(id: string): Promise<void>;
    getAllEvents(): Promise<Array<Event>>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getAllReleases(): Promise<Array<Release>>;
    getAllTracks(): Promise<Array<Track>>;
    getAllUserPlans(): Promise<Array<UserPlan> | null>;
    getAllVideos(): Promise<Array<Video>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentUserPlan(): Promise<UserPlan | null>;
    getEvent(id: string): Promise<Event | null>;
    getGalleryItem(id: string): Promise<GalleryItem | null>;
    getProfile(): Promise<ArtistProfile | null>;
    getRelease(id: string): Promise<Release | null>;
    getTrack(id: string): Promise<Track | null>;
    getUserPlan(id: string): Promise<UserPlan | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideo(id: string): Promise<Video | null>;
    initializeArtist(adminToken: string, userProvidedToken: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateEvent(event: Event): Promise<void>;
    updateGalleryItem(item: GalleryItem): Promise<void>;
    updateProfile(profile: ArtistProfile): Promise<void>;
    updateRelease(release: Release): Promise<void>;
    updateTrack(track: Track): Promise<void>;
    updateUserPlan(plan: UserPlan): Promise<void>;
    updateVideo(video: Video): Promise<void>;
}
