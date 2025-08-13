import React, { useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { MetadataDisplay } from './components/MetadataDisplay';
import { MusicService } from './services/musicService';
import type { MusicData } from './types';

function App() {
  const [currentMusic, setCurrentMusic] = useState<MusicData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRandomClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const musicData = await MusicService.getRandomMusic();
      if (musicData) {
        setCurrentMusic(musicData);
      } else {
        setError('Impossible de récupérer une musique aléatoire');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de musique aléatoire:', error);
      setError('Une erreur est survenue lors de la récupération de la musique');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Message d'information */}
        <div className="text-center bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800 text-sm">
            🎵 Application de démonstration - Les données sont simulées car les clés API ne sont pas configurées
          </p>
        </div>

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
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Zone métadonnées */}
        <MetadataDisplay data={currentMusic} loading={loading} />
      </div>
    </div>
  );
}

export default App;