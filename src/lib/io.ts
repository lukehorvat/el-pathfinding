import parseDDS from 'parse-dds';
import decodeDXT from 'decode-dxt';

/**
 * Read an EL map definition (.elm) file and extract its size + tile walkability info.
 */
export function readMapInfo(mapData: Buffer): MapInfo {
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
  const isTileValid = (x: number, y: number): boolean =>
    x >= 0 && x < elevationMapWidth && y >= 0 && y < elevationMapHeight;
  const isTileWalkable = (x: number, y: number): boolean =>
    isTileValid(x, y) && (elevationMap[y * elevationMapWidth + x] & 0x3f) !== 0;

  return {
    width: elevationMapWidth,
    height: elevationMapHeight,
    isTileValid,
    isTileWalkable,
  };
}

/**
 * Read an EL map texture (.dds) file and extract its image info.
 */
export function readMapImageInfo(textureData: Buffer): MapImageInfo {
  // Extract the first (largest) mipmap texture.
  const ddsInfo = parseDDS(textureData.buffer);
  const [image] = ddsInfo.images;
  const [imageWidth, imageHeight] = image.shape;
  const imageDataView = new DataView(
    textureData.buffer,
    image.offset,
    image.length
  );

  // Convert the compressed DXT texture to RGBA pixel data.
  const rgbaData = decodeDXT(
    imageDataView,
    imageWidth,
    imageHeight,
    ddsInfo.format as any
  );

  return { rgbaData, imageWidth, imageHeight };
}

export interface MapInfo {
  width: number;
  height: number;
  isTileValid(x: number, y: number): boolean;
  isTileWalkable(x: number, y: number): boolean;
}

export interface MapImageInfo {
  rgbaData: Uint8Array; // An array of RGBA pixel data.
  imageWidth: number;
  imageHeight: number;
}
