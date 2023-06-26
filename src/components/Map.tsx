import React, { useCallback } from 'react';
import { Stage, Graphics, Sprite } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { ColorSource as PixiColorSource } from '@pixi/color';
import { MapData, useMap } from '../hooks/useMap';
import { findPath, Graph } from '../lib/pathfinder';
import './Map.css';

const canvasWidth = 600;
const canvasHeight = 600;

export const Map: React.FC<{
  mapName: string;
  showMapImage: boolean;
  startPosition: { x: number; y: number } | null;
  endPosition: { x: number; y: number } | null;
  onPositionClick: (
    position: { x: number; y: number },
    hasShiftKey: boolean
  ) => void;
}> = ({
  mapName,
  showMapImage,
  startPosition,
  endPosition,
  onPositionClick,
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
      {showMapImage && <MapImage mapName={mapName} />}
      {!showMapImage && <UnwalkableTiles map={map!} />}
      {startPosition && endPosition && (
        <PathTiles map={map!} start={startPosition} end={endPosition} />
      )}
      {startPosition && (
        <MapMarker map={map!} position={startPosition} color="#0000e9" />
      )}
      {endPosition && (
        <MapMarker map={map!} position={endPosition} color="#e90000" />
      )}
    </Stage>
  );
};

export const MapImage: React.FC<{ mapName: string }> = ({ mapName }) => {
  return (
    <Sprite
      image={`https://raw.githubusercontent.com/lukehorvat/el-userscripts/map-images/dist/map-image-${mapName}.jpg`}
      x={0}
      y={0}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

export const UnwalkableTiles: React.FC<{
  map: MapData;
}> = ({ map }) => {
  const tileWidth = canvasWidth / map.width;
  const tileHeight = canvasHeight / map.height;
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
          if (!map.tiles[x][y] /* Is not walkable? */) {
            g.beginFill('#222', 1);
            g.drawRect(
              x * tileWidth,
              (map.height - y - 1) * tileHeight,
              tileWidth,
              tileHeight
            );
            g.endFill();
          }
        }
      }
    },
    [map]
  );

  return <Graphics draw={draw} />;
};

export const MapMarker: React.FC<{
  map: MapData;
  position: { x: number; y: number };
  color: PixiColorSource;
}> = ({ map, position, color }) => {
  const tileWidth = canvasWidth / map.width;
  const tileHeight = canvasHeight / map.height;
  const markerSize = 7;
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      g.lineStyle(4, color);
      g.moveTo(
        position.x * tileWidth + tileWidth / 2 - markerSize,
        (map.height - position.y - 1) * tileHeight + tileHeight / 2 - markerSize
      );
      g.lineTo(
        position.x * tileWidth + tileWidth / 2 + markerSize,
        (map.height - position.y - 1) * tileHeight + tileHeight / 2 + markerSize
      );
      g.moveTo(
        position.x * tileWidth + tileWidth / 2 + markerSize,
        (map.height - position.y - 1) * tileHeight + tileHeight / 2 - markerSize
      );
      g.lineTo(
        position.x * tileWidth + tileWidth / 2 - markerSize,
        (map.height - position.y - 1) * tileHeight + tileHeight / 2 + markerSize
      );
    },
    [map, position, color]
  );

  return <Graphics draw={draw} />;
};

export const PathTiles: React.FC<{
  map: MapData;
  start: { x: number; y: number };
  end: { x: number; y: number };
}> = ({ map, start, end }) => {
  const tileWidth = canvasWidth / map.width;
  const tileHeight = canvasHeight / map.height;
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      const graph = new Graph(map.width, map.height, map.tiles);
      const path = findPath(
        graph.nodes[start.x][start.y],
        graph.nodes[end.x][end.y]
      );

      for (const node of path) {
        g.beginFill('#00e900', 1);
        g.drawRect(
          node.x * tileWidth,
          (map.height - node.y - 1) * tileHeight,
          tileWidth,
          tileHeight
        );
        g.endFill();
      }
    },
    [map, start, end]
  );

  return <Graphics draw={draw} />;
};
