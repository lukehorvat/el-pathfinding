import React, { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { ColorSource as PixiColorSource } from '@pixi/color';
import atoms from '../lib/atoms';

export const UnwalkableMapTiles: React.FC<{
  color: PixiColorSource;
}> = ({ color }) => {
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

      for (let x = 0; x < map.data.width; x++) {
        for (let y = 0; y < map.data.height; y++) {
          if (!map.data.walkability[x][y] /* Is not walkable? */) {
            g.beginFill(color, 1);
            g.drawRect(
              x * tileWidth,
              (map.data.height - y - 1) * tileHeight,
              tileWidth,
              tileHeight
            );
            g.endFill();
          }
        }
      }
    },
    [map, color, canvasWidth, canvasHeight]
  );

  return <Graphics draw={draw} />;
};
