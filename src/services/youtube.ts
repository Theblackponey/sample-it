export class YouTubeService {
  private static apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  static async searchVideo(query: string): Promise<any> {
    // Si pas de clé API, retourner des données de démonstration
    if (!this.apiKey) {
      return this.getMockVideoData(query);
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${YouTubeService.apiKey}&maxResults=1`
      );
      
      if (!response.ok) {
        console.warn('YouTube API request failed, using mock data');
        return this.getMockVideoData(query);
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        
        // Get video statistics
        const statsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${video.id.videoId}&key=${YouTubeService.apiKey}`
        );
        
        const statsData = await statsResponse.json();
        const stats = statsData.items?.[0]?.statistics;
        
        return {
          id: video.id.videoId,
          title: video.snippet.title,
          channelTitle: video.snippet.channelTitle,
          viewCount: stats?.viewCount || '0'
        };
      }
      
      return this.getMockVideoData(query);
    } catch (error) {
      console.warn('YouTube search error, using mock data:', error);
      return this.getMockVideoData(query);
    }
  }

  private static getMockVideoData(query: string) {
    // Données de démonstration avec de vraies vidéos YouTube
    const mockVideos = [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Rick Astley - Never Gonna Give You Up',
        channelTitle: 'RickAstleyVEVO',
        viewCount: '1400000000'
      },
      {
        id: 'kJQP7kiw5Fk',
        title: 'Despacito',
        channelTitle: 'Luis Fonsi',
        viewCount: '8000000000'
      },
      {
        id: 'fJ9rUzIMcZQ',
        title: 'Queen - Bohemian Rhapsody',
        channelTitle: 'Queen Official',
        viewCount: '1800000000'
      },
      {
        id: 'L_jWHffIx5E',
        title: 'Smash Mouth - All Star',
        channelTitle: 'SmashMouthVEVO',
        viewCount: '700000000'
      },
      {
        id: 'y6120QOlsfU',
        title: 'Darude - Sandstorm',
        channelTitle: 'Darude',
        viewCount: '400000000'
      }
    ];

    const randomVideo = mockVideos[Math.floor(Math.random() * mockVideos.length)];
    return randomVideo;
  }
}
    }
  }
}