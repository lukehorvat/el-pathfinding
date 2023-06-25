import React, { useCallback, useEffect, useState } from 'react';
import { MapData, useMap } from '../hooks/useMap';
import { Stage, Graphics, Sprite } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { findPath, Graph } from '../lib/pathfinder';
import './Map.css';

const canvasWidth = 600;
const canvasHeight = 600;

export const MapContainer: React.FC<{ mapName: string }> = ({ mapName }) => {
  const mapRequest = useMap(mapName);

  if (mapRequest.isLoading) return <div>Loading map...</div>;
  if (mapRequest.isError) return <div>Failed to load map!</div>;

  return <Map map={mapRequest.data!} />;
};

export const Map: React.FC<{ map: MapData }> = ({ map }) => {
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
      const tileX = Math.floor(percentageX * map.width);
      const tileY = Math.floor(percentageY * map.height);

      if (
        tileX >= 0 &&
        tileX < map.width &&
        tileY >= 0 &&
        tileY < map.height &&
        !!map.tiles[tileX][tileY] // Is walkable?
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

  const drawUnwalkables = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      const tileWidth = canvasWidth / map.width;
      const tileHeight = canvasHeight / map.height;

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

  const drawPath = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (start && end) {
        const tileWidth = canvasWidth / map.width;
        const tileHeight = canvasHeight / map.height;
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
      }
    },
    [map, start, end]
  );

  const drawStart = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (start) {
        const tileWidth = canvasWidth / map.width;
        const tileHeight = canvasHeight / map.height;

        g.beginFill('#0000ff', 1);
        g.drawRect(
          start.x * tileWidth,
          (map.height - start.y - 1) * tileHeight,
          tileWidth,
          tileHeight
        );
        g.endFill();
      }
    },
    [map, start]
  );

  const drawEnd = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (end) {
        const tileWidth = canvasWidth / map.width;
        const tileHeight = canvasHeight / map.height;

        g.beginFill('#ff0000', 1);
        g.drawRect(
          end.x * tileWidth,
          (map.height - end.y - 1) * tileHeight,
          tileWidth,
          tileHeight
        );
        g.endFill();
      }
    },
    [map, end]
  );

  return (
    <Stage
      width={canvasWidth}
      height={canvasHeight}
      options={{ background: '#fff' }}
      onClick={onClick}
      className="map"
    >
      {/* <Sprite
        image={`https://raw.githubusercontent.com/lukehorvat/el-userscripts/map-images/dist/map-image-${mapName}.jpg`}
        x={0}
        y={0}
        width={canvasWidth}
        height={canvasHeight}
      /> */}
      <Graphics draw={drawUnwalkables} />
      <Graphics draw={drawPath} />
      <Graphics draw={drawStart} />
      <Graphics draw={drawEnd} />
    </Stage>
  );
};
