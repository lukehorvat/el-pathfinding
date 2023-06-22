import React from 'react';

export function useMap(mapName?: string) {
  const [data, setData] = React.useState<MapData>();
  const [error, setError] = React.useState<any>();

  React.useEffect(() => {
    if (!mapName) {
      return;
    }

    fetch(
      `https://raw.githubusercontent.com/lukehorvat/el-pathfinding/map-data/dist/${mapName}.json`
    )
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => setError(err));
  }, [mapName]);

  return {
    data,
    isLoading: !data && !error,
    isError: !data && !!error,
  };
}

export type MapData = {
  width: number;
  height: number;
  tiles: number[][];
};
