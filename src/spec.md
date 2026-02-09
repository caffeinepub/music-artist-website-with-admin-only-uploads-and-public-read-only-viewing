# Specification

## Summary
**Goal:** Make social and streaming links display as platform-specific buttons (icon + platform label) on the Home and Music/Releases pages, using the existing URL arrays as the data source.

**Planned changes:**
- Update the Home (`/`) social link button rendering to detect the platform from each `artistProfile.socials` URL and show an appropriate icon + readable label (fall back to a generic external-link icon + non-empty label for unknown URLs).
- Update the Music/Releases (`/music`) streaming link button rendering to detect the platform from each `release.streamingLinks` URL and show an appropriate icon + readable label (fall back to a generic external-link icon + non-empty label for unknown URLs).
- Ensure all social/streaming buttons open in a new tab and include `rel="noopener noreferrer"`.

**User-visible outcome:** Visitors see recognizable platform buttons (e.g., Spotify, Apple Music, YouTube, Instagram) for social and streaming links on the Home and Music pages; unknown links still appear as usable generic link buttons.
