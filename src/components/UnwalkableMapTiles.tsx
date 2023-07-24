import React, { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { ColorSource as PixiColorSource } from '@pixi/color';
import atoms from '../lib/atoms';

export const UnwalkableMapTiles: React.FC<{
  color: PixiColorSource;
}> = ({ color }) => {
  const mapInfo = useAtomValue(atoms.mapInfo);
  const canvasWidth = useAtomValue(atoms.canvasWidth);
  const canvasHeight = useAtomValue(atoms.canvasHeight);
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (mapInfo.state !== 'hasData') {
        return;
      }

      const tileWidth = canvasWidth / mapInfo.data.width;
      const tileHeight = canvasHeight / mapInfo.data.height;

      for (let x = 0; x < mapInfo.data.width; x++) {
        for (let y = 0; y < mapInfo.data.height; y++) {
          if (!mapInfo.data.walkability[x][y] /* Is not walkable? */) {
            g.beginFill(color, 1);
            g.drawRect(
              x * tileWidth,
              (mapInfo.data.height - y - 1) * tileHeight,
              tileWidth,
              tileHeight
            );
            g.endFill();
          }
        }
      }
    },
    [mapInfo, color, canvasWidth, canvasHeight]
  );

  return <Graphics draw={draw} />;
};
