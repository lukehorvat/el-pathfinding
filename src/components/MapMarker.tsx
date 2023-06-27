import React, { useCallback } from 'react';
import { Graphics } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { ColorSource as PixiColorSource } from '@pixi/color';
import { MapData } from '../hooks/useMap';

export const MapMarker: React.FC<{
  map: MapData;
  position: { x: number; y: number };
  color: PixiColorSource;
  canvasWidth: number;
  canvasHeight: number;
}> = ({ map, position, color, canvasWidth, canvasHeight }) => {
  const draw = useCallback(
    (g: PixiGraphics) => {
      const tileWidth = canvasWidth / map.width;
      const tileHeight = canvasHeight / map.height;
      const markerSize = 7;

      g.clear();
      g.lineStyle(4, color);
      g.moveTo(
        position.x * tileWidth + tileWidth / 2 - markerSize,
        (map.height - position.y - 1) * tileHeight + tileHeight / 2 - markerSize
      );
      g.lineTo(
        position.x * tileWidth + tileWidth / 2 + markerSize,
        (map.height - position.y - 1) * tileHeight + tileHeight / 2 + markerSize
      );
      g.moveTo(
        position.x * tileWidth + tileWidth / 2 + markerSize,
        (map.height - position.y - 1) * tileHeight + tileHeight / 2 - markerSize
      );
      g.lineTo(
        position.x * tileWidth + tileWidth / 2 - markerSize,
        (map.height - position.y - 1) * tileHeight + tileHeight / 2 + markerSize
      );
    },
    [map, position, color, canvasWidth, canvasHeight]
  );

  return <Graphics draw={draw} />;
};
