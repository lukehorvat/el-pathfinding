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
      const markerSize = 7;

      g.lineStyle(4, color);
      g.moveTo(
        tile.x * tileWidth + tileWidth / 2 - markerSize,
        (mapInfo.data.height - tile.y - 1) * tileHeight +
          tileHeight / 2 -
          markerSize
      );
      g.lineTo(
        tile.x * tileWidth + tileWidth / 2 + markerSize,
        (mapInfo.data.height - tile.y - 1) * tileHeight +
          tileHeight / 2 +
          markerSize
      );
      g.moveTo(
        tile.x * tileWidth + tileWidth / 2 + markerSize,
        (mapInfo.data.height - tile.y - 1) * tileHeight +
          tileHeight / 2 -
          markerSize
      );
      g.lineTo(
        tile.x * tileWidth + tileWidth / 2 - markerSize,
        (mapInfo.data.height - tile.y - 1) * tileHeight +
          tileHeight / 2 +
          markerSize
      );
    },
    [mapInfo, tile, color, canvasWidth, canvasHeight]
  );

  return <Graphics draw={draw} />;
};
