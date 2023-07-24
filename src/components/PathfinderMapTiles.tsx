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
  const mapInfo = useAtomValue(atoms.mapInfo);
  const canvasWidth = useAtomValue(atoms.canvasWidth);
  const canvasHeight = useAtomValue(atoms.canvasHeight);
  const startTile = useAtomValue(atoms.startTile)!;
  const endTile = useAtomValue(atoms.endTile)!;
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (mapInfo.state !== 'hasData') {
        return;
      }

      const tileWidth = canvasWidth / mapInfo.data.width;
      const tileHeight = canvasHeight / mapInfo.data.height;
      const graph = new Graph(
        mapInfo.data.width,
        mapInfo.data.height,
        mapInfo.data.walkability
      );
      const path = findPath(
        graph.nodes[startTile.x][startTile.y],
        graph.nodes[endTile.x][endTile.y]
      );

      if (path) {
        for (const node of path) {
          g.beginFill(color, 1);
          g.drawRect(
            node.x * tileWidth,
            (mapInfo.data.height - node.y - 1) * tileHeight,
            tileWidth,
            tileHeight
          );
          g.endFill();
        }
      }
    },
    [mapInfo, startTile, endTile, color, canvasWidth, canvasHeight]
  );

  return <Graphics draw={draw} />;
};
