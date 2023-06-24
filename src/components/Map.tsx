import React, { useCallback, useEffect, useState } from 'react';
import { useMap } from '../hooks/useMap';
import { Stage, Graphics, Sprite } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import './Map.css';

const canvasWidth = 600;
const canvasHeight = 600;

export const Map: React.FC<{ mapName: string }> = ({ mapName }) => {
  const map = useMap(mapName);
  const [origin, setOrigin] = useState<{
    x: number;
    y: number;
  } | null>();
  const [destination, setDestination] = useState<{
    x: number;
    y: number;
  } | null>();

  useEffect(() => {
    setOrigin(null);
    setDestination(null);
  }, [mapName]);

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (!map.data) {
        return;
      }

      const canvasRect = event.currentTarget.getBoundingClientRect();
      const canvasX = event.clientX - canvasRect.left;
      const canvasY = canvasRect.bottom - event.clientY;
      const percentageX = canvasX / canvasWidth;
      const percentageY = canvasY / canvasHeight;
      const tileX = Math.floor(percentageX * map.data!.width);
      const tileY = Math.floor(percentageY * map.data!.height);

      if (
        tileX >= 0 &&
        tileX < map.data!.width &&
        tileY >= 0 &&
        tileY < map.data!.height &&
        !!map.data!.tiles[tileX][tileY] // Is walkable?
      ) {
        if (event.shiftKey) {
          setDestination({ x: tileX, y: tileY });
        } else {
          setOrigin({ x: tileX, y: tileY });
        }
      }
    },
    [map.data]
  );

  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (!map.data) {
        return;
      }

      const tileWidth = canvasWidth / map.data!.width;
      const tileHeight = canvasHeight / map.data!.height;

      for (let x = 0; x < map.data.width; x++) {
        for (let y = 0; y < map.data.height; y++) {
          if (!map.data.tiles[x][y] /* Is not walkable? */) {
            g.beginFill('#222', 1);
            g.drawRect(
              x * tileWidth,
              (map.data.height - y - 1) * tileHeight,
              tileWidth,
              tileHeight
            );
            g.endFill();
          }
        }
      }

      if (origin) {
        g.beginFill('#0000ff', 1);
        g.drawRect(
          origin.x * tileWidth,
          (map.data.height - origin.y - 1) * tileHeight,
          tileWidth,
          tileHeight
        );
        g.endFill();
      }

      if (destination) {
        g.beginFill('#ff0000', 1);
        g.drawRect(
          destination.x * tileWidth,
          (map.data.height - destination.y - 1) * tileHeight,
          tileWidth,
          tileHeight
        );
        g.endFill();
      }
    },
    [map.data, origin, destination]
  );

  if (map.isLoading) return <div>Loading map...</div>;
  if (map.isError) return <div>Failed to load map!</div>;

  return (
    <Stage
      width={canvasWidth}
      height={canvasHeight}
      options={{ background: '#fff' }}
      onClick={onClick}
      className="map"
    >
      {/* <Sprite
        image={`https://raw.githubusercontent.com/lukehorvat/el-userscripts/map-images/dist/map-image-${mapName}.jpg`}
        x={0}
        y={0}
        width={canvasWidth}
        height={canvasHeight}
      /> */}
      <Graphics draw={draw} />
    </Stage>
  );
};
