const DISCOGS_TOKEN = import.meta.env.VITE_DISCOGS_TOKEN;
const DISCOGS_API_BASE = 'https://api.discogs.com';

export class DiscogsService {
  static async getRandomRelease() {
    // Si pas de token, retourner des données de démonstration
    if (!DISCOGS_TOKEN) {
      return this.getMockReleaseData();
    }

    try {
      // Genres musicaux populaires pour la recherche aléatoire
      const genres = [
        'Electronic', 'House', 'Techno', 'Ambient', 'Jazz', 'Funk', 'Disco',
        'Hip Hop', 'Rock', 'Pop', 'Reggae', 'Soul', 'Blues', 'Classical',
        'Trance', 'Drum n Bass', 'Downtempo', 'Experimental', 'Folk', 'World'
      ];
      
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
      const randomPage = Math.floor(Math.random() * 10) + 1; // Pages 1-10

      const response = await fetch(
        `${DISCOGS_API_BASE}/database/search?genre=${encodeURIComponent(randomGenre)}&type=release&format=Vinyl&per_page=50&page=${randomPage}&token=${DISCOGS_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Filtrer les résultats qui ont genre ET style
        const validReleases = data.results.filter(release => 
          release.genre && release.genre.length > 0 && 
          release.style && release.style.length > 0 &&
          release.title && release.title.includes(' - ') // Format "Artist - Title"
        );
        
        if (validReleases.length === 0) return null;
        
        // Prendre un résultat aléatoire parmi les valides
        const randomRelease = validReleases[Math.floor(Math.random() * validReleases.length)];
        
        const titleParts = randomRelease.title.split(' - ');
        const artist = titleParts[0] || 'Unknown';
        const release = titleParts.slice(1).join(' - ') || randomRelease.title;
        
        return {
          artist,
          release,
          year: randomRelease.year?.toString() || 'Unknown',
          genre: randomRelease.genre || [],
          style: randomRelease.style || [],
          country: randomRelease.country || 'Unknown',
          label: randomRelease.label || [],
          searchQuery: `${artist} ${release}` // Pour la recherche YouTube
        };
      }
      
      return this.getMockReleaseData();
    } catch (error) {
      console.warn('Erreur Discogs, utilisation de données de démonstration:', error);
      return this.getMockReleaseData();
    }
  }

  private static getMockReleaseData() {
    const mockReleases = [
      {
        artist: 'Daft Punk',
        release: 'Random Access Memories',
        year: '2013',
        genre: ['Electronic'],
        style: ['House', 'Disco'],
        country: 'France',
        label: ['Columbia'],
        searchQuery: 'Daft Punk Random Access Memories'
      },
      {
        artist: 'Miles Davis',
        release: 'Kind of Blue',
        year: '1959',
        genre: ['Jazz'],
        style: ['Cool Jazz', 'Modal'],
        country: 'US',
        label: ['Columbia'],
        searchQuery: 'Miles Davis Kind of Blue'
      },
      {
        artist: 'The Beatles',
        release: 'Abbey Road',
        year: '1969',
        genre: ['Rock'],
        style: ['Pop Rock', 'Psychedelic Rock'],
        country: 'UK',
        label: ['Apple Records'],
        searchQuery: 'The Beatles Abbey Road'
      },
      {
        artist: 'Aphex Twin',
        release: 'Selected Ambient Works 85-92',
        year: '1992',
        genre: ['Electronic'],
        style: ['Ambient', 'IDM'],
        country: 'UK',
        label: ['R&S Records'],
        searchQuery: 'Aphex Twin Selected Ambient Works'
      },
      {
        artist: 'Bob Marley',
        release: 'Legend',
        year: '1984',
        genre: ['Reggae'],
        style: ['Roots Reggae'],
        country: 'Jamaica',
        label: ['Island Records'],
        searchQuery: 'Bob Marley Legend'
      }
    ];

    const randomRelease = mockReleases[Math.floor(Math.random() * mockReleases.length)];
    return randomRelease;
    }
  }

  static async searchRelease(query: string) {
    if (!DISCOGS_TOKEN) {
      return this.getMockReleaseData();
    }

    try {
      // Nettoyer le titre pour la recherche
      const cleanQuery = query
        .replace(/\([^)]*\)/g, '') // Enlever les parenthèses
        .replace(/\[[^\]]*\]/g, '') // Enlever les crochets
        .replace(/official|video|music|hd|4k/gi, '') // Enlever mots-clés communs
        .trim();

      const response = await fetch(
        `${DISCOGS_API_BASE}/database/search?q=${encodeURIComponent(cleanQuery)}&type=release&format=Vinyl&per_page=5&token=${DISCOGS_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Prendre le premier résultat qui a des genres/styles
        for (const release of data.results) {
          if (release.genre && release.genre.length > 0 && 
              release.style && release.style.length > 0) {
            
            return {
              artist: release.title.split(' - ')[0] || 'Unknown',
              release: release.title.split(' - ')[1] || release.title,
              year: release.year?.toString() || 'Unknown',
              genre: release.genre || [],
              style: release.style || [],
              country: release.country || 'Unknown',
              label: release.label || [],
              searchQuery: release.title.split(' - ').join(' ')
            };
          }
        }
      }
      
      return this.getMockReleaseData();
    } catch (error) {
      console.warn('Erreur Discogs, utilisation de données de démonstration:', error);
      return this.getMockReleaseData();
    }
  }
}