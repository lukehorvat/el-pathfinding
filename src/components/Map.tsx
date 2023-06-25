import React, { useCallback, useEffect, useState } from 'react';
import { MapData, useMap } from '../hooks/useMap';
import { Stage, Graphics, Sprite } from '@pixi/react';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import './Map.css';

const canvasWidth = 600;
const canvasHeight = 600;

export const MapContainer: React.FC<{ mapName: string }> = ({ mapName }) => {
  const mapRequest = useMap(mapName);

  if (mapRequest.isLoading) return <div>Loading map...</div>;
  if (mapRequest.isError) return <div>Failed to load map!</div>;

  return <Map map={mapRequest.data!} />;
};

export const Map: React.FC<{ map: MapData }> = ({ map }) => {
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
  }, [map]);

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const canvasRect = event.currentTarget.getBoundingClientRect();
      const canvasX = event.clientX - canvasRect.left;
      const canvasY = canvasRect.bottom - event.clientY;
      const percentageX = canvasX / canvasWidth;
      const percentageY = canvasY / canvasHeight;
      const tileX = Math.floor(percentageX * map.width);
      const tileY = Math.floor(percentageY * map.height);

      if (
        tileX >= 0 &&
        tileX < map.width &&
        tileY >= 0 &&
        tileY < map.height &&
        !!map.tiles[tileX][tileY] // Is walkable?
      ) {
        if (event.shiftKey) {
          setDestination({ x: tileX, y: tileY });
        } else {
          setOrigin({ x: tileX, y: tileY });
        }
      }
    },
    [map]
  );

  const drawUnwalkables = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      const tileWidth = canvasWidth / map.width;
      const tileHeight = canvasHeight / map.height;

      for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
          if (!map.tiles[x][y] /* Is not walkable? */) {
            g.beginFill('#222', 1);
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
    [map]
  );

  const drawOrigin = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (origin) {
        const tileWidth = canvasWidth / map.width;
        const tileHeight = canvasHeight / map.height;

        g.beginFill('#0000ff', 1);
        g.drawRect(
          origin.x * tileWidth,
          (map.height - origin.y - 1) * tileHeight,
          tileWidth,
          tileHeight
        );
        g.endFill();
      }
    },
    [map, origin]
  );

  const drawDestination = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      if (destination) {
        const tileWidth = canvasWidth / map.width;
        const tileHeight = canvasHeight / map.height;

        g.beginFill('#ff0000', 1);
        g.drawRect(
          destination.x * tileWidth,
          (map.height - destination.y - 1) * tileHeight,
          tileWidth,
          tileHeight
        );
        g.endFill();
      }
    },
    [map, destination]
  );

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
      <Graphics draw={drawUnwalkables} />
      <Graphics draw={drawOrigin} />
      <Graphics draw={drawDestination} />
    </Stage>
  );
};
