import React, { useCallback, useEffect, useState } from 'react';
import { Stage, Graphics, Sprite } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { MapData, useMap } from '../hooks/useMap';
import { findPath, Graph } from '../lib/pathfinder';
import './Map.css';

const canvasWidth = 600;
const canvasHeight = 600;

export const Map: React.FC<{ mapName: string; showMapImage: boolean }> = ({
  mapName,
  showMapImage,
}) => {
  const mapRequest = useMap(mapName);
  const map = mapRequest.data;
  const [start, setStart] = useState<{
    x: number;
    y: number;
  } | null>();
  const [end, setEnd] = useState<{
    x: number;
    y: number;
  } | null>();

  useEffect(() => {
    setStart(null);
    setEnd(null);
  }, [map]);

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
        if (event.shiftKey) {
          setEnd({ x: tileX, y: tileY });
        } else {
          setStart({ x: tileX, y: tileY });
        }
      }
    },
    [map]
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
      {start && end && <PathTiles map={map!} start={start} end={end} />}
      {start && <StartMarker map={map!} start={start} />}
      {end && <EndMarker map={map!} end={end} />}
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

export const StartMarker: React.FC<{
  map: MapData;
  start: { x: number; y: number };
}> = ({ map, start }) => {
  const tileWidth = canvasWidth / map.width;
  const tileHeight = canvasHeight / map.height;
  const markerSize = 7;
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      g.lineStyle(4, '#0000ff');
      g.moveTo(
        start.x * tileWidth + tileWidth / 2 - markerSize,
        (map.height - start.y - 1) * tileHeight + tileHeight / 2 - markerSize
      );
      g.lineTo(
        start.x * tileWidth + tileWidth / 2 + markerSize,
        (map.height - start.y - 1) * tileHeight + tileHeight / 2 + markerSize
      );
      g.moveTo(
        start.x * tileWidth + tileWidth / 2 + markerSize,
        (map.height - start.y - 1) * tileHeight + tileHeight / 2 - markerSize
      );
      g.lineTo(
        start.x * tileWidth + tileWidth / 2 - markerSize,
        (map.height - start.y - 1) * tileHeight + tileHeight / 2 + markerSize
      );
    },
    [map, start]
  );

  return <Graphics draw={draw} />;
};

export const EndMarker: React.FC<{
  map: MapData;
  end: { x: number; y: number };
}> = ({ map, end }) => {
  const tileWidth = canvasWidth / map.width;
  const tileHeight = canvasHeight / map.height;
  const markerSize = 7;
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      g.lineStyle(4, '#ff0000');
      g.moveTo(
        end.x * tileWidth + tileWidth / 2 - markerSize,
        (map.height - end.y - 1) * tileHeight + tileHeight / 2 - markerSize
      );
      g.lineTo(
        end.x * tileWidth + tileWidth / 2 + markerSize,
        (map.height - end.y - 1) * tileHeight + tileHeight / 2 + markerSize
      );
      g.moveTo(
        end.x * tileWidth + tileWidth / 2 + markerSize,
        (map.height - end.y - 1) * tileHeight + tileHeight / 2 - markerSize
      );
      g.lineTo(
        end.x * tileWidth + tileWidth / 2 - markerSize,
        (map.height - end.y - 1) * tileHeight + tileHeight / 2 + markerSize
      );
    },
    [map, end]
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
        g.beginFill('#00ff00', 1);
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
