import React, { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Sprite } from '@pixi/react';
import * as PIXI from 'pixi.js';
import atoms from '../lib/atoms';

export const MapImage: React.FC = () => {
  const mapImageInfo = useAtomValue(atoms.mapImageInfo);
  const canvasWidth = useAtomValue(atoms.canvasWidth);
  const canvasHeight = useAtomValue(atoms.canvasHeight);
  const texture = useMemo(() => {
    if (mapImageInfo.state !== 'hasData') {
      return;
    }

    const { rgbaData, imageWidth, imageHeight } = mapImageInfo.data;
    return PIXI.Texture.fromBuffer(rgbaData, imageWidth, imageHeight, {
      scaleMode: PIXI.SCALE_MODES.LINEAR,
    });
  }, [mapImageInfo]);

  if (!texture) {
    return null;
  }

  return (
    <Sprite
      texture={texture}
      x={0}
      y={0}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};
