import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import maps from './maps';

const mapName = atom<string>(maps[0].name);
const map = atom<Promise<{ width: number; height: number; tiles: number[][] }>>(
  async (get) => {
    const res = await fetch(
      `https://raw.githubusercontent.com/lukehorvat/el-pathfinder/map-data/dist/${get(
        mapName
      )}.json`
    );
    return res.json();
  }
);
const showUnwalkableTiles = atom<boolean>(false);
const startTile = atom<{ x: number; y: number } | null>(null);
const endTile = atom<{ x: number; y: number } | null>(null);
const canvasWidth = atom<number>(600);
const canvasHeight = atom<number>(600);

export default {
  mapName,
  map: loadable(map),
  showUnwalkableTiles,
  startTile,
  endTile,
  canvasWidth,
  canvasHeight,
};
