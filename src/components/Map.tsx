import React, { useCallback } from 'react';
import { useMap } from '../hooks/useMap';
import { Stage, Graphics, Sprite } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import './Map.css';

const width = 600;
const height = 600;

export const Map: React.FC<{ mapName: string }> = ({ mapName }) => {
  const map = useMap(mapName);
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (!map.data) {
        return;
      }

      const tileWidth = width / map.data!.width;
      const tileHeight = height / map.data!.height;

      for (let x = 0; x < map.data.width; x++) {
        for (let y = 0; y < map.data.height; y++) {
          const isWalkable = !!map.data.tiles[x][y];
          if (!isWalkable) {
            g.beginFill('#222', 1);
            g.drawRect(
              x * tileWidth,
              (map.data!.height - y - 1) * tileHeight,
              tileWidth,
              tileHeight
            );
            g.endFill();
          }
        }
      }
    },
    [map.data]
  );

  if (map.isLoading) return <div>Loading map...</div>;
  if (map.isError) return <div>Failed to load map!</div>;

  return (
    <Stage width={width} height={height} options={{ background: '#fff' }}>
      {/* <Sprite
        image={`https://raw.githubusercontent.com/lukehorvat/el-userscripts/map-images/dist/map-image-${mapName}.jpg`}
        x={0}
        y={0}
        width={width}
        height={height}
      /> */}
      <Graphics draw={draw} />
    </Stage>
  );
};
