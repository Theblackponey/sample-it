export class YouTubeService {
  private static apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  static async searchVideo(query: string): Promise<any> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${YouTubeService.apiKey}&maxResults=1`
      );
      
      if (!response.ok) {
        throw new Error('YouTube API request failed');
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
          videoId: video.id.videoId,
          title: video.snippet.title,
          channelTitle: video.snippet.channelTitle,
          viewCount: stats?.viewCount || '0'
        };
      }
      
      return null;
    } catch (error) {
      console.error('YouTube search error:', error);
      return null;
    }
  }
}