import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import maps, { MapImageInfo, MapInfo, loadMap, loadMapImage } from './maps';

const mapFile = atom<string>(maps[0].file);
const map = atom<Promise<MapInfo>>((get) => loadMap(get(mapFile)));
const mapImageInfo = atom<Promise<MapImageInfo>>((get) =>
  loadMapImage(get(mapFile))
);
const showUnwalkableTiles = atom<boolean>(false);
const startTile = atom<{ x: number; y: number } | null>(null);
const endTile = atom<{ x: number; y: number } | null>(null);
const canvasWidth = atom<number>(600);
const canvasHeight = atom<number>(600);

export default {
  mapFile,
  map: loadable(map),
  mapImageInfo: loadable(mapImageInfo),
  showUnwalkableTiles,
  startTile,
  endTile,
  canvasWidth,
  canvasHeight,
};
