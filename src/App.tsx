import React, { useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { MetadataDisplay } from './components/MetadataDisplay';
import { MusicService } from './services/musicService';
import type { MusicData } from './types';

function App() {
  const [currentMusic, setCurrentMusic] = useState<MusicData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRandomClick = async () => {
    setLoading(true);
    try {
      const musicData = await MusicService.getRandomMusic();
      setCurrentMusic(musicData);
    } catch (error) {
      console.error('Erreur lors de la récupération de musique aléatoire:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Zone vidéo */}
        {currentMusic && !loading && (
          <VideoPlayer videoId={currentMusic.youtube.id} />
        )}
        
        {/* Bouton Random */}
        <div className="text-center">
          <button
            onClick={handleRandomClick}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg text-lg transition-colors"
          >
            {loading ? 'Chargement...' : 'RANDOM'}
          </button>
        </div>

        {/* Zone métadonnées */}
        <MetadataDisplay data={currentMusic} loading={loading} />
      </div>
    </div>
  );
}

export default App;