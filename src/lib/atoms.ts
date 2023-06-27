import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import maps from './maps';

const mapFile = atom<string>(maps[0].file);
const map = atom<
  Promise<{ width: number; height: number; walkability: number[][] }>
>(async (get) => {
  const res = await fetch(
    `https://raw.githubusercontent.com/lukehorvat/el-pathfinder/map-data/dist/map-walkability-${get(
      mapFile
    )}.json`
  );
  return res.json();
});
const showUnwalkableTiles = atom<boolean>(false);
const startTile = atom<{ x: number; y: number } | null>(null);
const endTile = atom<{ x: number; y: number } | null>(null);
const canvasWidth = atom<number>(600);
const canvasHeight = atom<number>(600);

export default {
  mapFile,
  map: loadable(map),
  showUnwalkableTiles,
  startTile,
  endTile,
  canvasWidth,
  canvasHeight,
};
