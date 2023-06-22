import React, { useState } from 'react';
import { Map } from './Map';
import maps from '../lib/maps';
import './App.css';

export const App: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<string>('startmap');

  return (
    <>
      <h1>EL Pathfinding</h1>
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
      {selectedMap && <Map mapName={selectedMap} />}
    </>
  );
};
