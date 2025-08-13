export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  viewCount: string;
}

export interface DiscogsMetadata {
  artist: string;
  release: string;
  year: string;
  genre: string[];
  style: string[];
  country: string;
  label: string[];
  searchQuery: string;
}

export interface SpotifyMetadata {
  key: number;
  time_signature: number;
  tempo: number;
}

export interface MusicData {
  youtube: YouTubeVideo;
  discogs: DiscogsMetadata | null;
  spotify: SpotifyMetadata | null;
}