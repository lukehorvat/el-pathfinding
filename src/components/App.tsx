import React, { useEffect, useState } from 'react';
import { Map } from './Map';
import maps from '../lib/maps';
import './App.css';

export const App: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<string>(maps[0].name);
  const [showMapImage, setShowMapImage] = useState<boolean>(true);
  const [startPosition, setStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [endPosition, setEndPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    setStartPosition(null);
    setEndPosition(null);
  }, [selectedMap]);

  return (
    <>
      <form>
        <div className="form-map-selector">
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
        </div>
        <div className="form-map-image-toggle">
          <label>Show map image:</label>
          <input
            type="checkbox"
            checked={showMapImage}
            onChange={(event) => setShowMapImage(event.target.checked)}
          />
        </div>
        <div className="form-start-position">
          <label>Start position:</label>
          <input
            type="text"
            value={
              startPosition
                ? `${startPosition.x},${startPosition.y}`
                : 'Not set'
            }
            disabled
          />
        </div>
        <div className="form-end-position">
          <label>End position:</label>
          <input
            type="text"
            value={
              endPosition ? `${endPosition.x},${endPosition.y}` : 'Not set'
            }
            disabled
          />
        </div>
      </form>
      {selectedMap && (
        <Map
          mapName={selectedMap}
          showMapImage={showMapImage}
          startPosition={startPosition}
          endPosition={endPosition}
          onPositionClick={(position, hasShiftKey) =>
            hasShiftKey ? setEndPosition(position) : setStartPosition(position)
          }
        />
      )}
    </>
  );
};
