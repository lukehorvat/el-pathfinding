import React, { useCallback } from 'react';
import { Stage } from '@pixi/react';
import { useMap } from '../hooks/useMap';
import { UnwalkableMapTiles } from './UnwalkableMapTiles';
import { MapImage } from './MapImage';
import { PathfinderMapTiles } from './PathfinderMapTiles';
import { MapMarker } from './MapMarker';
import './Map.css';

export const Map: React.FC<{
  mapName: string;
  showUnwalkableTiles: boolean;
  startPosition: { x: number; y: number } | null;
  endPosition: { x: number; y: number } | null;
  onPositionClick: (
    position: { x: number; y: number },
    hasShiftKey: boolean
  ) => void;
  canvasWidth: number;
  canvasHeight: number;
}> = ({
  mapName,
  showUnwalkableTiles,
  startPosition,
  endPosition,
  onPositionClick,
  canvasWidth,
  canvasHeight,
}) => {
  const mapRequest = useMap(mapName);
  const map = mapRequest.data;
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const canvasRect = event.currentTarget.getBoundingClientRect();
      const canvasX = event.clientX - canvasRect.left;
      const canvasY = canvasRect.bottom - event.clientY;
      const percentageX = canvasX / canvasWidth;
      const percentageY = canvasY / canvasHeight;
      const tileX = Math.floor(percentageX * map!.width);
      const tileY = Math.floor(percentageY * map!.height);

      if (
        tileX >= 0 &&
        tileX < map!.width &&
        tileY >= 0 &&
        tileY < map!.height &&
        !!map!.tiles[tileX][tileY] // Is walkable?
      ) {
        onPositionClick({ x: tileX, y: tileY }, event.shiftKey);
      }
    },
    [map, onPositionClick]
  );

  if (mapRequest.isLoading) return <div>Loading map...</div>;
  if (mapRequest.isError) return <div>Failed to load map!</div>;

  return (
    <Stage
      width={canvasWidth}
      height={canvasHeight}
      options={{ background: '#fff' }}
      onClick={onClick}
      className="map"
    >
      {showUnwalkableTiles && (
        <UnwalkableMapTiles
          map={map!}
          color="#222"
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      )}
      {!showUnwalkableTiles && (
        <MapImage
          mapName={mapName}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      )}
      {startPosition && endPosition && (
        <PathfinderMapTiles
          map={map!}
          startPosition={startPosition}
          endPosition={endPosition}
          color="#00e900"
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      )}
      {startPosition && (
        <MapMarker
          map={map!}
          position={startPosition}
          color="#0000e9"
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      )}
      {endPosition && (
        <MapMarker
          map={map!}
          position={endPosition}
          color="#e90000"
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      )}
    </Stage>
  );
};
