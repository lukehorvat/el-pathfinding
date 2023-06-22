import React from 'react';
import { useMap } from '../hooks/useMap';
import './Map.css';

export const Map: React.FC<{ mapName: string }> = ({ mapName }) => {
  const map = useMap(mapName);

  if (map.isLoading) return <div>Loading map...</div>;
  if (map.isError) return <div>Failed to load map!</div>;

  return (
    <>
      <pre>{JSON.stringify(map.data!)}</pre>
    </>
  );
};
