import React from 'react';
import { Form } from './Form';
import { Map } from './Map';
import './App.css';

export const App: React.FC = () => {
  return (
    <div className="app">
      <h2>Eternal Lands pathfinding</h2>
      <Form />
      <div className="note">
        Note: To run the pathfinder, click the map to set the start position and
        shift+click to set the end position.
      </div>
      <Map />
    </div>
  );
};
