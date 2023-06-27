import React from 'react';
import { Sprite } from '@pixi/react';

export const MapImage: React.FC<{
  mapName: string;
  canvasWidth: number;
  canvasHeight: number;
}> = ({ mapName, canvasWidth, canvasHeight }) => {
  return (
    <Sprite
      image={`https://raw.githubusercontent.com/lukehorvat/el-userscripts/map-images/dist/map-image-${mapName}.jpg`}
      x={0}
      y={0}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};
