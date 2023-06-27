import React, { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { ColorSource as PixiColorSource } from '@pixi/color';
import atoms from '../lib/atoms';

export const MapMarker: React.FC<{
  position: { x: number; y: number };
  color: PixiColorSource;
}> = ({ position, color }) => {
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
        position.x * tileWidth + tileWidth / 2 - markerSize,
        (map.data.height - position.y - 1) * tileHeight +
          tileHeight / 2 -
          markerSize
      );
      g.lineTo(
        position.x * tileWidth + tileWidth / 2 + markerSize,
        (map.data.height - position.y - 1) * tileHeight +
          tileHeight / 2 +
          markerSize
      );
      g.moveTo(
        position.x * tileWidth + tileWidth / 2 + markerSize,
        (map.data.height - position.y - 1) * tileHeight +
          tileHeight / 2 -
          markerSize
      );
      g.lineTo(
        position.x * tileWidth + tileWidth / 2 - markerSize,
        (map.data.height - position.y - 1) * tileHeight +
          tileHeight / 2 +
          markerSize
      );
    },
    [map, position, color, canvasWidth, canvasHeight]
  );

  return <Graphics draw={draw} />;
};
