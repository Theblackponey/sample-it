import React from 'react';
import type { MusicData } from '../types';

interface MetadataDisplayProps {
  data: MusicData | null;
  loading: boolean;
}

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
        <p className="text-center text-gray-600">Chargement des métadonnées...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
        <p className="text-center text-gray-600">Cliquez sur Random pour découvrir une musique</p>
      </div>
    );
  }

  const { youtube, discogs, spotify } = data;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Infos YouTube */}
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-red-800 mb-2">YouTube</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><strong>Titre:</strong> {youtube.title}</div>
          <div><strong>Chaîne:</strong> {youtube.channelTitle}</div>
          <div><strong>Vues:</strong> {parseInt(youtube.viewCount).toLocaleString()}</div>
        </div>
      </div>

      {/* Métadonnées Discogs */}
      {discogs && (
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-orange-800 mb-2">Discogs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><strong>Artiste:</strong> {discogs.artist}</div>
            <div><strong>Release:</strong> {discogs.release}</div>
            <div><strong>Année:</strong> {discogs.year}</div>
            <div><strong>Genre:</strong> {discogs.genre.join(', ')}</div>
            <div><strong>Style:</strong> {discogs.style.join(', ')}</div>
            <div><strong>Région:</strong> {discogs.country}</div>
            <div className="md:col-span-2"><strong>Label:</strong> {discogs.label.join(', ')}</div>
          </div>
        </div>
      )}

      {/* Métadonnées Spotify */}
      {spotify && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-green-800 mb-2">Spotify</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div><strong>Key (tonalité):</strong> {spotify.key}</div>
            <div><strong>Time (mesure):</strong> {spotify.time_signature}/4</div>
            <div><strong>Tempo (BPM):</strong> {spotify.tempo}</div>
          </div>
        </div>
      )}
    </div>
  );
};