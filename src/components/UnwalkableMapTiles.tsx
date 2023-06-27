import React, { useCallback } from 'react';
import { Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { ColorSource as PixiColorSource } from '@pixi/color';
import { MapData } from '../hooks/useMap';

export const UnwalkableMapTiles: React.FC<{
  map: MapData;
  color: PixiColorSource;
  canvasWidth: number;
  canvasHeight: number;
}> = ({ map, color, canvasWidth, canvasHeight }) => {
  const draw = useCallback(
    (g: PixiGraphics) => {
      const tileWidth = canvasWidth / map.width;
      const tileHeight = canvasHeight / map.height;

      g.clear();

      for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
          if (!map.tiles[x][y] /* Is not walkable? */) {
            g.beginFill(color, 1);
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
    [map, color, canvasWidth, canvasHeight]
  );

  return <Graphics draw={draw} />;
};
