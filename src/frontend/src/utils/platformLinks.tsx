import { 
  SiSpotify, 
  SiApplemusic, 
  SiYoutube, 
  SiInstagram, 
  SiX, 
  SiFacebook,
  SiSoundcloud,
  SiTidal,
  SiAmazonmusic,
  SiLinkedin,
  SiTiktok
} from 'react-icons/si';
import { ExternalLink } from 'lucide-react';
import { ReactNode } from 'react';

export interface PlatformInfo {
  label: string;
  icon: ReactNode;
}

/**
 * Detects the platform from a URL and returns appropriate label and icon
 * @param url - The URL to analyze
 * @param fallbackLabel - Label to use if platform is not recognized (default: "Link")
 * @returns PlatformInfo object with label and icon
 */
export function getPlatformInfo(url: string, fallbackLabel: string = 'Link'): PlatformInfo {
  const lower = url.toLowerCase();

  // Streaming platforms
  if (lower.includes('spotify')) {
    return { label: 'Spotify', icon: <SiSpotify className="w-4 h-4" /> };
  }
  if (lower.includes('apple') && lower.includes('music')) {
    return { label: 'Apple Music', icon: <SiApplemusic className="w-4 h-4" /> };
  }
  if (lower.includes('youtube')) {
    return { label: 'YouTube', icon: <SiYoutube className="w-4 h-4" /> };
  }
  if (lower.includes('soundcloud')) {
    return { label: 'SoundCloud', icon: <SiSoundcloud className="w-4 h-4" /> };
  }
  if (lower.includes('tidal')) {
    return { label: 'Tidal', icon: <SiTidal className="w-4 h-4" /> };
  }
  if (lower.includes('deezer')) {
    return { label: 'Deezer', icon: <ExternalLink className="w-4 h-4" /> };
  }
  if (lower.includes('amazon') && lower.includes('music')) {
    return { label: 'Amazon Music', icon: <SiAmazonmusic className="w-4 h-4" /> };
  }

  // Social media platforms
  if (lower.includes('instagram')) {
    return { label: 'Instagram', icon: <SiInstagram className="w-4 h-4" /> };
  }
  if (lower.includes('twitter') || lower.includes('x.com')) {
    return { label: 'X', icon: <SiX className="w-4 h-4" /> };
  }
  if (lower.includes('facebook')) {
    return { label: 'Facebook', icon: <SiFacebook className="w-4 h-4" /> };
  }
  if (lower.includes('linkedin')) {
    return { label: 'LinkedIn', icon: <SiLinkedin className="w-4 h-4" /> };
  }
  if (lower.includes('tiktok')) {
    return { label: 'TikTok', icon: <SiTiktok className="w-4 h-4" /> };
  }

  // Fallback for unrecognized URLs
  return { label: fallbackLabel, icon: <ExternalLink className="w-4 h-4" /> };
}
