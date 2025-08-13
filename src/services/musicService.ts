import { YouTubeService } from './youtube';
import { DiscogsService } from './discogs';
import { SpotifyService } from './spotify';
import type { MusicData } from '../types';

export class MusicService {
  static async getRandomMusic(): Promise<MusicData | null> {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        // 1. D'abord chercher dans Discogs pour avoir des métadonnées fiables
        const discogsData = await DiscogsService.getRandomRelease();
        if (!discogsData || 
            !discogsData.genre || discogsData.genre.length === 0 || 
            !discogsData.style || discogsData.style.length === 0) {
          attempts++;
          continue;
        }

        // 2. Chercher la vidéo YouTube correspondante
        const youtubeData = await YouTubeService.searchVideo(discogsData.searchQuery);
        if (!youtubeData) {
          attempts++;
          continue;
        }

        // 3. Récupérer les métadonnées Spotify (optionnel)
        const spotifyData = await SpotifyService.searchTrack(discogsData.searchQuery);

        return {
          youtube: youtubeData,
          discogs: discogsData,
          spotify: spotifyData
        };

      } catch (error) {
        console.error('Erreur lors de la récupération de musique:', error);
        attempts++;
      }
    }

    return null;
  }
}