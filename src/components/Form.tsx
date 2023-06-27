import React from 'react';
import { useAtom } from 'jotai';
import atoms from '../lib/atoms';
import maps from '../lib/maps';
import './Form.css';

export const Form: React.FC = () => {
  const [mapName, setMapName] = useAtom(atoms.mapName);
  const [showUnwalkableTiles, setShowUnwalkableTiles] = useAtom(
    atoms.showUnwalkableTiles
  );
  const [startPosition, setStartPosition] = useAtom(atoms.startPosition);
  const [endPosition, setEndPosition] = useAtom(atoms.endPosition);

  return (
    <form>
      <div className="map-selector">
        <label>Map:</label>
        <select
          value={mapName}
          onChange={(event) => {
            setMapName(event.target.value);
            setStartPosition(null);
            setEndPosition(null);
          }}
        >
          {maps.map(({ name, title }) => (
            <option key={name} value={name}>
              {title}
            </option>
          ))}
        </select>
      </div>
      <div className="unwalkable-tiles-toggle">
        <label>Show unwalkable tiles:</label>
        <input
          type="checkbox"
          checked={showUnwalkableTiles}
          onChange={(event) => setShowUnwalkableTiles(event.target.checked)}
        />
      </div>
      <div className="start-position">
        <label>Start position:</label>
        <input
          type="text"
          value={
            startPosition ? `${startPosition.x},${startPosition.y}` : 'Not set'
          }
          disabled
        />
      </div>
      <div className="end-position">
        <label>End position:</label>
        <input
          type="text"
          value={endPosition ? `${endPosition.x},${endPosition.y}` : 'Not set'}
          disabled
        />
      </div>
    </form>
  );
};
