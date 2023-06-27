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
  const [startTile, setStartTile] = useAtom(atoms.startTile);
  const [endTile, setEndTile] = useAtom(atoms.endTile);

  return (
    <form>
      <div className="map-selector">
        <label>Map:</label>
        <select
          value={mapName}
          onChange={(event) => {
            setMapName(event.target.value);
            setStartTile(null);
            setEndTile(null);
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
      <div className="start-tile">
        <label>Start tile:</label>
        <input
          type="text"
          value={startTile ? `${startTile.x},${startTile.y}` : 'Not set'}
          disabled
        />
      </div>
      <div className="end-tile">
        <label>End tile:</label>
        <input
          type="text"
          value={endTile ? `${endTile.x},${endTile.y}` : 'Not set'}
          disabled
        />
      </div>
    </form>
  );
};
