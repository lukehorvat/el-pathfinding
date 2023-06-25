import React, { useState } from 'react';
import { MapContainer } from './Map';
import maps from '../lib/maps';
import './App.css';

export const App: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<string>('startmap');

  return (
    <>
      <div>
        <select
          name="map"
          value={selectedMap}
          onChange={(event) => setSelectedMap(event.target.value)}
        >
          {maps.map(({ name, title }) => (
            <option key={name} value={name}>
              {title}
            </option>
          ))}
        </select>
      </div>
      {selectedMap && <MapContainer mapName={selectedMap} />}
    </>
  );
};
