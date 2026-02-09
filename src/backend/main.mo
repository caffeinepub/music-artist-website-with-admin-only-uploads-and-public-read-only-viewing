import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Iter "mo:core/Iter";



actor {
  type Video = {
    id : Text;
    title : Text;
    platformLink : Text;
  };

  type Event = {
    id : Text;
    date : Time.Time;
    venue : Text;
    city : Text;
    ticketLink : Text;
  };

  type GalleryItem = {
    id : Text;
    image : Storage.ExternalBlob;
    caption : Text;
  };

  type Release = {
    id : Text;
    title : Text;
    date : Time.Time;
    coverImage : Storage.ExternalBlob;
    streamingLinks : [Text];
  };

  type Track = {
    id : Text;
    title : Text;
    releaseId : Text;
  };

  type ArtistProfile = {
    name : Text;
    bio : Text;
    socials : [Text];
  };

  public type UserProfile = {
    name : Text;
  };

  type UserPlan = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
  };

  // Storage for each content type
  let videos = Map.empty<Text, Video>();
  let events = Map.empty<Text, Event>();
  let galleryItems = Map.empty<Text, GalleryItem>();
  let releases = Map.empty<Text, Release>();
  let tracks = Map.empty<Text, Track>();
  var artistProfile : ?ArtistProfile = null;
  let userProfiles = Map.empty<Principal, UserProfile>();

  let userPlans = Map.empty<Text, UserPlan>();
  let assignedUserPlans = Map.empty<Principal, Text>();

  // Initialize access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Authentication & User Profile Management
  public shared ({ caller }) func initializeArtist(adminToken : Text, userProvidedToken : Text) : async () {
    AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Artist Profile CRUD
  public shared ({ caller }) func updateProfile(profile : ArtistProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update artist profile");
    };
    artistProfile := ?profile;
  };

  public query func getProfile() : async ?ArtistProfile {
    artistProfile;
  };

  // Video CRUD
  public shared ({ caller }) func addVideo(video : Video) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add videos");
    };
    videos.add(video.id, video);
  };

  public shared ({ caller }) func updateVideo(video : Video) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update videos");
    };
    videos.add(video.id, video);
  };

  public shared ({ caller }) func deleteVideo(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete videos");
    };
    videos.remove(id);
  };

  public query func getVideo(id : Text) : async ?Video {
    videos.get(id);
  };

  public query func getAllVideos() : async [Video] {
    videos.values().toArray();
  };

  // Event CRUD
  public shared ({ caller }) func addEvent(event : Event) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add events");
    };
    events.add(event.id, event);
  };

  public shared ({ caller }) func updateEvent(event : Event) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update events");
    };
    events.add(event.id, event);
  };

  public shared ({ caller }) func deleteEvent(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };
    events.remove(id);
  };

  public query func getEvent(id : Text) : async ?Event {
    events.get(id);
  };

  public query func getAllEvents() : async [Event] {
    events.values().toArray();
  };

  // Gallery Item CRUD
  public shared ({ caller }) func addGalleryItem(item : GalleryItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add gallery items");
    };
    galleryItems.add(item.id, item);
  };

  public shared ({ caller }) func updateGalleryItem(item : GalleryItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update gallery items");
    };
    galleryItems.add(item.id, item);
  };

  public shared ({ caller }) func deleteGalleryItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };
    galleryItems.remove(id);
  };

  public query func getGalleryItem(id : Text) : async ?GalleryItem {
    galleryItems.get(id);
  };

  public query func getAllGalleryItems() : async [GalleryItem] {
    galleryItems.values().toArray();
  };

  // Release CRUD
  public shared ({ caller }) func addRelease(release : Release) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add releases");
    };
    releases.add(release.id, release);
  };

  public shared ({ caller }) func updateRelease(release : Release) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update releases");
    };
    releases.add(release.id, release);
  };

  public shared ({ caller }) func deleteRelease(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete releases");
    };
    releases.remove(id);
  };

  public query func getRelease(id : Text) : async ?Release {
    releases.get(id);
  };

  public query func getAllReleases() : async [Release] {
    releases.values().toArray();
  };

  // Track CRUD
  public shared ({ caller }) func addTrack(track : Track) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add tracks");
    };
    tracks.add(track.id, track);
  };

  public shared ({ caller }) func updateTrack(track : Track) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update tracks");
    };
    tracks.add(track.id, track);
  };

  public shared ({ caller }) func deleteTrack(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete tracks");
    };
    tracks.remove(id);
  };

  public query func getTrack(id : Text) : async ?Track {
    tracks.get(id);
  };

  public query func getAllTracks() : async [Track] {
    tracks.values().toArray();
  };

  // User Plan Management
  public query func getUserPlan(id : Text) : async ?UserPlan {
    userPlans.get(id);
  };

  public query func getAllUserPlans() : async ?[UserPlan] {
    let plansIter = userPlans.values();
    let plansArray = plansIter.toArray();
    if (plansArray.size() > 0) {
      ?plansArray;
    } else {
      null;
    };
  };

  public shared ({ caller }) func createUserPlan(plan : UserPlan) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create user plans");
    };
    userPlans.add(plan.id, plan);
  };

  public shared ({ caller }) func updateUserPlan(plan : UserPlan) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update user plans");
    };
    userPlans.add(plan.id, plan);
  };

  public shared ({ caller }) func deleteUserPlan(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete user plans");
    };
    userPlans.remove(id);
  };

  // User Plan Assignment
  public shared ({ caller }) func assignUserPlan(planId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can assign plans");
    };
    if (not userPlans.containsKey(planId)) {
      Runtime.trap("Plan does not exist");
    };
    assignedUserPlans.add(caller, planId);
  };

  public query ({ caller }) func getCurrentUserPlan() : async ?UserPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their plan");
    };
    let planId = assignedUserPlans.get(caller);
    switch (planId) {
      case (null) { null };
      case (?id) { userPlans.get(id) };
    };
  };
};
