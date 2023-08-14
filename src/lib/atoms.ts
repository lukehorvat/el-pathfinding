import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import pako from 'pako';
import maps, {
  MapImageInfo,
  MapInfo,
  readMapInfo,
  readMapImageInfo,
} from './maps';

const mapFile = atom<string>(maps[0].file);
const mapInfo = atom<Promise<MapInfo>>(async (get) => {
  const res = await fetch(`data/maps/${get(mapFile)}.elm.gz`);
  const compressedMapData = await res.arrayBuffer();
  const mapData = Buffer.from(pako.inflate(compressedMapData));
  return readMapInfo(mapData);
});
const mapImageInfo = atom<Promise<MapImageInfo>>(async (get) => {
  const res = await fetch(`data/maps/${get(mapFile)}.dds`);
  const textureData = Buffer.from(await res.arrayBuffer());
  return readMapImageInfo(textureData);
});
const showUnwalkableTiles = atom<boolean>(false);
const startTile = atom<{ x: number; y: number } | null>(null);
const endTile = atom<{ x: number; y: number } | null>(null);
const canvasWidth = atom<number>(600);
const canvasHeight = atom<number>(600);

export default {
  mapFile,
  mapInfo: loadable(mapInfo),
  mapImageInfo: loadable(mapImageInfo),
  showUnwalkableTiles,
  startTile,
  endTile,
  canvasWidth,
  canvasHeight,
};
