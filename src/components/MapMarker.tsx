import React, { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { ColorSource as PixiColorSource } from '@pixi/color';
import atoms from '../lib/atoms';

export const MapMarker: React.FC<{
  tile: { x: number; y: number };
  color: PixiColorSource;
}> = ({ tile, color }) => {
  const map = useAtomValue(atoms.map);
  const canvasWidth = useAtomValue(atoms.canvasWidth);
  const canvasHeight = useAtomValue(atoms.canvasHeight);
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (map.state !== 'hasData') {
        return;
      }

      const tileWidth = canvasWidth / map.data.width;
      const tileHeight = canvasHeight / map.data.height;
      const markerSize = 7;

      g.lineStyle(4, color);
      g.moveTo(
        tile.x * tileWidth + tileWidth / 2 - markerSize,
        (map.data.height - tile.y - 1) * tileHeight +
          tileHeight / 2 -
          markerSize
      );
      g.lineTo(
        tile.x * tileWidth + tileWidth / 2 + markerSize,
        (map.data.height - tile.y - 1) * tileHeight +
          tileHeight / 2 +
          markerSize
      );
      g.moveTo(
        tile.x * tileWidth + tileWidth / 2 + markerSize,
        (map.data.height - tile.y - 1) * tileHeight +
          tileHeight / 2 -
          markerSize
      );
      g.lineTo(
        tile.x * tileWidth + tileWidth / 2 - markerSize,
        (map.data.height - tile.y - 1) * tileHeight +
          tileHeight / 2 +
          markerSize
      );
    },
    [map, tile, color, canvasWidth, canvasHeight]
  );

  return <Graphics draw={draw} />;
};
