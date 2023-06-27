import React, { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { ColorSource as PixiColorSource } from '@pixi/color';
import atoms from '../lib/atoms';
import { findPath, Graph } from '../lib/pathfinder';

export const PathfinderMapTiles: React.FC<{
  color: PixiColorSource;
}> = ({ color }) => {
  const map = useAtomValue(atoms.map);
  const canvasWidth = useAtomValue(atoms.canvasWidth);
  const canvasHeight = useAtomValue(atoms.canvasHeight);
  const startTile = useAtomValue(atoms.startTile)!;
  const endTile = useAtomValue(atoms.endTile)!;
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (map.state !== 'hasData') {
        return;
      }

      const tileWidth = canvasWidth / map.data.width;
      const tileHeight = canvasHeight / map.data.height;
      const graph = new Graph(map.data.width, map.data.height, map.data.tiles);
      const path = findPath(
        graph.nodes[startTile.x][startTile.y],
        graph.nodes[endTile.x][endTile.y]
      );

      for (const node of path) {
        g.beginFill(color, 1);
        g.drawRect(
          node.x * tileWidth,
          (map.data.height - node.y - 1) * tileHeight,
          tileWidth,
          tileHeight
        );
        g.endFill();
      }
    },
    [map, startTile, endTile, color, canvasWidth, canvasHeight]
  );

  return <Graphics draw={draw} />;
};
