import React from 'react';
import { useAtomValue } from 'jotai';
import { Sprite } from '@pixi/react';
import atoms from '../lib/atoms';

export const MapImage: React.FC = () => {
  const mapName = useAtomValue(atoms.mapName);
  const canvasWidth = useAtomValue(atoms.canvasWidth);
  const canvasHeight = useAtomValue(atoms.canvasHeight);

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
