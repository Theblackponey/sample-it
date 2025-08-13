const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

export class SpotifyService {
  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;

  static async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);
    
    return this.accessToken;
  }

  static async searchTrack(query: string) {
    try {
      const token = await this.getAccessToken();
      
      // Nettoyer le titre pour la recherche Spotify
      const cleanQuery = query
        .replace(/\([^)]*\)/g, '')
        .replace(/\[[^\]]*\]/g, '')
        .replace(/official|video|music|hd|4k/gi, '')
        .trim();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(cleanQuery)}&type=track&limit=5`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      
      if (data.tracks && data.tracks.items.length > 0) {
        const track = data.tracks.items[0];
        return await this.getAudioFeatures(track.id);
      }
      
      return null;
    } catch (error) {
      console.error('Erreur Spotify:', error);
      return null;
    }
  }

  static async getAudioFeatures(trackId: string) {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://api.spotify.com/v1/audio-features/${trackId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      
      return {
        key: data.key,
        time_signature: data.time_signature,
        tempo: Math.round(data.tempo)
      };
    } catch (error) {
      console.error('Erreur audio features:', error);
      return null;
    }
  }
}