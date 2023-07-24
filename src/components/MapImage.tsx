import React, { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Sprite } from '@pixi/react';
import atoms from '../lib/atoms';

export const MapImage: React.FC = () => {
  const mapImageInfo = useAtomValue(atoms.mapImageInfo);
  const canvasWidth = useAtomValue(atoms.canvasWidth);
  const canvasHeight = useAtomValue(atoms.canvasHeight);
  const offscreenImageCanvas = useMemo(() => {
    if (mapImageInfo.state !== 'hasData') {
      return;
    }

    // Render the map's pixel data onto an offscreen canvas.
    const { rgbaData, imageWidth, imageHeight } = mapImageInfo.data;
    const canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(imageWidth, imageHeight);
    for (let i = 0; i < imageData.data.length; i++) {
      imageData.data[i] = rgbaData[i];
    }
    ctx.putImageData(imageData, 0, 0);

    return canvas;
  }, [mapImageInfo]);

  if (!offscreenImageCanvas) {
    return null;
  }

  return (
    <Sprite
      source={offscreenImageCanvas}
      x={0}
      y={0}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};
