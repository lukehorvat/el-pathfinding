import React, { useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Stage } from '@pixi/react';
import atoms from '../lib/atoms';
import { UnwalkableMapTiles } from './UnwalkableMapTiles';
import { MapImage } from './MapImage';
import { PathfinderMapTiles } from './PathfinderMapTiles';
import { MapMarker } from './MapMarker';
import './Map.css';

export const Map: React.FC = () => {
  const map = useAtomValue(atoms.map);
  const showUnwalkableTiles = useAtomValue(atoms.showUnwalkableTiles);
  const [startPosition, setStartPosition] = useAtom(atoms.startPosition);
  const [endPosition, setEndPosition] = useAtom(atoms.endPosition);
  const canvasWidth = useAtomValue(atoms.canvasWidth);
  const canvasHeight = useAtomValue(atoms.canvasHeight);
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (map.state !== 'hasData') {
        return;
      }

      const canvasRect = event.currentTarget.getBoundingClientRect();
      const canvasX = event.clientX - canvasRect.left;
      const canvasY = canvasRect.bottom - event.clientY;
      const percentageX = canvasX / canvasWidth;
      const percentageY = canvasY / canvasHeight;
      const tileX = Math.floor(percentageX * map.data.width);
      const tileY = Math.floor(percentageY * map.data.height);

      if (
        tileX >= 0 &&
        tileX < map.data.width &&
        tileY >= 0 &&
        tileY < map.data.height &&
        !!map.data.tiles[tileX][tileY] // Is walkable?
      ) {
        if (event.shiftKey) {
          setEndPosition({ x: tileX, y: tileY });
        } else {
          setStartPosition({ x: tileX, y: tileY });
        }
      }
    },
    [map]
  );

  if (map.state === 'loading') return <div>Loading map...</div>;
  if (map.state === 'hasError') return <div>Failed to load map!</div>;

  return (
    <Stage
      width={canvasWidth}
      height={canvasHeight}
      options={{ background: '#fff' }}
      onClick={onClick}
      className="map"
    >
      {showUnwalkableTiles ? <UnwalkableMapTiles color="#222" /> : <MapImage />}
      {startPosition && endPosition && <PathfinderMapTiles color="#00e900" />}
      {startPosition && <MapMarker position={startPosition} color="#0000e9" />}
      {endPosition && <MapMarker position={endPosition} color="#e90000" />}
    </Stage>
  );
};
