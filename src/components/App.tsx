import React, { useEffect, useState } from 'react';
import { Map } from './Map';
import maps from '../lib/maps';
import './App.css';

export const App: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<string>(maps[0].name);
  const [showUnwalkableTiles, setShowUnwalkableTiles] =
    useState<boolean>(false);
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
      <h3>Eternal Lands pathfinding</h3>
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
        <div className="form-unwalkable-tiles-toggle">
          <label>Show unwalkable tiles:</label>
          <input
            type="checkbox"
            checked={showUnwalkableTiles}
            onChange={(event) => setShowUnwalkableTiles(event.target.checked)}
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
      <div className="note">
        Note: To run the pathfinder, click the map to set the start position and
        shift+click to set the end position.
      </div>
      {selectedMap && (
        <Map
          mapName={selectedMap}
          showUnwalkableTiles={showUnwalkableTiles}
          startPosition={startPosition}
          endPosition={endPosition}
          onPositionClick={(position, hasShiftKey) =>
            hasShiftKey ? setEndPosition(position) : setStartPosition(position)
          }
          canvasWidth={600}
          canvasHeight={600}
        />
      )}
    </>
  );
};
