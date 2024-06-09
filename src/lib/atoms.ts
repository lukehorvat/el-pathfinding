import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import pako from 'pako';
import maps from './maps';
import { MapImageInfo, MapInfo, readMapInfo, readMapImageInfo } from './io';

const mapFile = atom<string>(maps[0].file);
const mapInfo = atom<Promise<MapInfo>>(async (get) => {
  const res = await fetch(`data/maps/${get(mapFile)}.elm.gz`);
  const { buffer } = pako.inflate(await res.arrayBuffer());
  return readMapInfo(buffer);
});
const mapImageInfo = atom<Promise<MapImageInfo>>(async (get) => {
  const res = await fetch(`data/maps/${get(mapFile)}.dds`);
  const buffer = await res.arrayBuffer();
  return readMapImageInfo(buffer);
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
