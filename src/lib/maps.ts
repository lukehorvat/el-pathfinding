import pako from 'pako';
import parseDDS from 'parse-dds';
import decodeDXT from 'decode-dxt';

export default [
  {
    file: 'startmap',
    name: 'Isla Prima',
  },
  {
    file: 'map2',
    name: 'White Stone',
  },
  {
    file: 'map3',
    name: 'Desert Pines',
  },
  {
    file: 'map4f',
    name: 'Ruins of Tirnym',
  },
  {
    file: 'map5nf',
    name: 'Valley of the Dwarves',
  },
  {
    file: 'map6nf',
    name: 'Portland',
  },
  {
    file: 'map7',
    name: 'Morcraven Marsh',
  },
  {
    file: 'map8',
    name: 'Naralik',
  },
  {
    file: 'map9f',
    name: 'Grubani Peninsula',
  },
  {
    file: 'map11',
    name: 'Tarsengaard',
  },
  {
    file: 'map12',
    name: 'Nordcarn',
  },
  {
    file: 'map13',
    name: 'Southern Kilaran',
  },
  {
    file: 'map14f',
    name: 'Kilaran Field',
  },
  {
    file: 'map15f',
    name: 'Tahraji Desert',
  },
  {
    file: 'anitora',
    name: 'Port Anitora',
  },
  {
    file: 'cont2map1',
    name: 'Idaloran',
  },
  {
    file: 'cont2map2',
    name: 'Bethel',
  },
  {
    file: 'cont2map3',
    name: 'Sedicolis',
  },
  {
    file: 'cont2map4',
    name: 'Melinis',
  },
  {
    file: 'cont2map5',
    name: 'Palon Vertas',
  },
  {
    file: 'cont2map6',
    name: 'Thelinor',
  },
  {
    file: 'cont2map7',
    name: 'Irsis',
  },
  {
    file: 'cont2map8',
    name: 'Emerald Valley Trade Route',
  },
  {
    file: 'cont2map9',
    name: 'Kusamura Jungle',
  },
  {
    file: 'cont2map10',
    name: 'Zirakinbar',
  },
  {
    file: 'cont2map11',
    name: 'Willowvine Forest',
  },
  {
    file: 'cont2map12',
    name: 'Aeth Aelfan',
  },
  {
    file: 'cont2map13',
    name: 'Egratia Point',
  },
  {
    file: 'cont2map14',
    name: 'Arius',
  },
  {
    file: 'cont2map15',
    name: 'North Redmoon',
  },
  {
    file: 'cont2map16',
    name: 'South Redmoon',
  },
  {
    file: 'cont2map17',
    name: 'Hurquin',
  },
  {
    file: 'cont2map18',
    name: 'Trassian',
  },
  {
    file: 'cont2map19',
    name: 'Hulda',
  },
  {
    file: 'cont2map20',
    name: 'Isle of the Forgotten',
  },
  {
    file: 'cont2map21',
    name: 'Imbroglio Islands',
  },
  {
    file: 'cont2map22',
    name: 'Irinveron',
  },
  {
    file: 'cont2map23',
    name: 'Glacmor',
  },
  {
    file: 'cont2map24',
    name: 'Iscalrith',
  },
];

/**
 * Fetch an EL map file (.elm.gz) and extract its size + tile walkability info.
 */
export async function loadMapInfo(mapFile: string): Promise<MapInfo> {
  // Fetch the map file and decompress it.
  const res = await fetch(`data/maps/${mapFile}.elm.gz`);
  const compressedMapData = await res.arrayBuffer();
  const mapData = Buffer.from(pako.inflate(compressedMapData));

  // Read the map file header.
  const magicToken = mapData.toString('ascii', 0, 4);
  if (magicToken !== 'elmf') {
    throw new Error('Not a valid map file.');
  }
  const tileMapWidth = mapData.readUInt32LE(4);
  const tileMapHeight = mapData.readUInt32LE(8);
  const elevationMapWidth = tileMapWidth * 6;
  const elevationMapHeight = tileMapHeight * 6;
  const elevationMapOffset = mapData.readUInt32LE(16);

  // Read the tile walkability info.
  const elevationMap = mapData.subarray(
    elevationMapOffset,
    elevationMapOffset + elevationMapWidth * elevationMapHeight
  );
  const isTileValid = (x: number, y: number) =>
    x >= 0 && x < elevationMapWidth && y >= 0 && y < elevationMapHeight;
  const isTileWalkable = (x: number, y: number) =>
    isTileValid(x, y) && (elevationMap[y * elevationMapWidth + x] & 0x3f) !== 0;

  return {
    width: elevationMapWidth,
    height: elevationMapHeight,
    isTileValid,
    isTileWalkable,
  };
}

/**
 * Fetch an EL map texture file (.dds) and extract its image info.
 */
export async function loadMapImageInfo(mapFile: string): Promise<MapImageInfo> {
  // Fetch the map texture file.
  const res = await fetch(`data/maps/${mapFile}.dds`);
  const ddsFile = await res.arrayBuffer();

  // Extract the first (largest) mipmap texture.
  const ddsInfo = parseDDS(ddsFile);
  const [image] = ddsInfo.images;
  const [imageWidth, imageHeight] = image.shape;
  const imageDataView = new DataView(ddsFile, image.offset, image.length);

  // Convert the compressed DXT texture to RGBA pixel data.
  const rgbaData = decodeDXT(
    imageDataView,
    imageWidth,
    imageHeight,
    ddsInfo.format as any
  );

  return { rgbaData, imageWidth, imageHeight };
}

export type MapInfo = {
  width: number;
  height: number;
  isTileValid(x: number, y: number): boolean;
  isTileWalkable(x: number, y: number): boolean;
};

export type MapImageInfo = {
  rgbaData: Uint8Array; // An array of RGBA pixel data.
  imageWidth: number;
  imageHeight: number;
};
