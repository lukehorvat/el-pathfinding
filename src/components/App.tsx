import React, { useState } from 'react';
import { Map } from './Map';
import maps from '../lib/maps';
import './App.css';

export const App: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<string>(maps[0].name);
  const [showMapImage, setShowMapImage] = useState<boolean>(true);

  return (
    <>
      <div>
        <label>Map:</label>
        <select
          value={selectedMap}
          onChange={(event) => setSelectedMap(event.target.value)}
        >
          {maps.map(({ name, title }) => (
            <option key={name} value={name}>
              {title}
            </option>
          ))}
        </select>
        <input
          type="checkbox"
          checked={showMapImage}
          onChange={(event) => setShowMapImage(event.target.checked)}
        />
        <label>Show map image?</label>
      </div>
      {selectedMap && <Map mapName={selectedMap} showMapImage={showMapImage} />}
    </>
  );
};
