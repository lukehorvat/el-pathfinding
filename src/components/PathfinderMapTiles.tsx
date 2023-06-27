import React, { useCallback } from 'react';
import { Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { ColorSource as PixiColorSource } from '@pixi/color';
import { MapData } from '../hooks/useMap';
import { findPath, Graph } from '../lib/pathfinder';

export const PathfinderMapTiles: React.FC<{
  map: MapData;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  color: PixiColorSource;
  canvasWidth: number;
  canvasHeight: number;
}> = ({
  map,
  startPosition,
  endPosition,
  color,
  canvasWidth,
  canvasHeight,
}) => {
  const draw = useCallback(
    (g: PixiGraphics) => {
      const tileWidth = canvasWidth / map.width;
      const tileHeight = canvasHeight / map.height;
      const graph = new Graph(map.width, map.height, map.tiles);
      const path = findPath(
        graph.nodes[startPosition.x][startPosition.y],
        graph.nodes[endPosition.x][endPosition.y]
      );

      g.clear();

      for (const node of path) {
        g.beginFill(color, 1);
        g.drawRect(
          node.x * tileWidth,
          (map.height - node.y - 1) * tileHeight,
          tileWidth,
          tileHeight
        );
        g.endFill();
      }
    },
    [map, startPosition, endPosition, color, canvasWidth, canvasHeight]
  );

  return <Graphics draw={draw} />;
};
