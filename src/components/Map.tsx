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
  const mapInfo = useAtomValue(atoms.mapInfo);
  const mapImageInfo = useAtomValue(atoms.mapImageInfo);
  const showUnwalkableTiles = useAtomValue(atoms.showUnwalkableTiles);
  const [startTile, setStartTile] = useAtom(atoms.startTile);
  const [endTile, setEndTile] = useAtom(atoms.endTile);
  const canvasWidth = useAtomValue(atoms.canvasWidth);
  const canvasHeight = useAtomValue(atoms.canvasHeight);
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (mapInfo.state !== 'hasData') {
        return;
      }

      const canvasRect = event.currentTarget.getBoundingClientRect();
      const canvasX = event.clientX - canvasRect.left;
      const canvasY = canvasRect.bottom - event.clientY;
      const percentageX = canvasX / canvasWidth;
      const percentageY = canvasY / canvasHeight;
      const tileX = Math.floor(percentageX * mapInfo.data.width);
      const tileY = Math.floor(percentageY * mapInfo.data.height);

      if (
        tileX >= 0 &&
        tileX < mapInfo.data.width &&
        tileY >= 0 &&
        tileY < mapInfo.data.height &&
        mapInfo.data.isTileWalkable(tileX, tileY)
      ) {
        if (event.shiftKey) {
          setEndTile({ x: tileX, y: tileY });
        } else {
          setStartTile({ x: tileX, y: tileY });
        }
      }
    },
    [mapInfo]
  );

  if (mapInfo.state == 'loading' || mapImageInfo.state == 'loading')
    return <div className="map-loading">Loading map...</div>;
  if (mapInfo.state === 'hasError' || mapImageInfo.state == 'hasError')
    return <div className="map-error">Failed to load map!</div>;

  return (
    <Stage
      width={canvasWidth}
      height={canvasHeight}
      options={{ background: '#fff' }}
      onClick={onClick}
      className="map"
    >
      {showUnwalkableTiles ? <UnwalkableMapTiles color="#222" /> : <MapImage />}
      {startTile && endTile && <PathfinderMapTiles color="#00e900" />}
      {startTile && <MapMarker tile={startTile} color="#0000e9" />}
      {endTile && <MapMarker tile={endTile} color="#e90000" />}
    </Stage>
  );
};
