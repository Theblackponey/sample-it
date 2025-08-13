import { YouTubeService } from './youtube';
import { DiscogsService } from './discogs';
import { SpotifyService } from './spotify';
import type { MusicData } from '../types';

export class MusicService {
  static async getRandomMusic(): Promise<MusicData | null> {
    try {
      // 1. D'abord chercher dans Discogs pour avoir des métadonnées fiables
      const discogsData = await DiscogsService.getRandomRelease();
      if (!discogsData) {
        throw new Error('Impossible de récupérer les données Discogs');
      }

      // 2. Chercher la vidéo YouTube correspondante
      const youtubeData = await YouTubeService.searchVideo(discogsData.searchQuery);
      if (!youtubeData) {
        throw new Error('Impossible de récupérer les données YouTube');
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
      throw error;
    }
  }
}