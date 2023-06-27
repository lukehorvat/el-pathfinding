import React from 'react';
import { useAtomValue } from 'jotai';
import { Sprite } from '@pixi/react';
import atoms from '../lib/atoms';

export const MapImage: React.FC = () => {
  const mapFile = useAtomValue(atoms.mapFile);
  const canvasWidth = useAtomValue(atoms.canvasWidth);
  const canvasHeight = useAtomValue(atoms.canvasHeight);

  return (
    <Sprite
      image={`https://raw.githubusercontent.com/lukehorvat/el-pathfinder/map-data/dist/map-image-${mapFile}.jpg`}
      x={0}
      y={0}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};
