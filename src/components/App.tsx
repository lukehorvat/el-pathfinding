import React from 'react';
import { Form } from './Form';
import { Map } from './Map';
import './App.css';

export const App: React.FC = () => {
  return (
    <div className="app">
      <h2>Eternal Lands pathfinder</h2>
      <Form />
      <div className="note">
        Note: Click the map to set the start tile and shift+click to set the end
        tile.
      </div>
      <Map />
    </div>
  );
};
