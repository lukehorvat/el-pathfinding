import parseDDS from 'parse-dds';
import decodeDXT from 'decode-dxt';

/**
 * Read an EL map definition (.elm) file and extract its size + tile walkability info.
 */
export function readMapInfo(buffer: ArrayBuffer): MapInfo {
  const view = new DataView(buffer);

  const magicToken = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3)
  );
  if (magicToken !== 'elmf') {
    throw new Error('Not a valid map file.');
  }

  const tileMapWidth = view.getUint32(4, true);
  const tileMapHeight = view.getUint32(8, true);
  const elevationMapWidth = tileMapWidth * 6;
  const elevationMapHeight = tileMapHeight * 6;
  const elevationMapOffset = view.getUint32(16, true);
  const elevationMap = new DataView(
    buffer,
    elevationMapOffset,
    elevationMapWidth * elevationMapHeight
  );

  const isTileValid = (x: number, y: number): boolean =>
    x >= 0 && x < elevationMapWidth && y >= 0 && y < elevationMapHeight;
  const isTileWalkable = (x: number, y: number): boolean =>
    isTileValid(x, y) &&
    (elevationMap.getUint8(y * elevationMapWidth + x) & 0x3f) !== 0;

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
export function readMapImageInfo(buffer: ArrayBuffer): MapImageInfo {
  // Extract the first (largest) mipmap texture.
  const ddsInfo = parseDDS(buffer);
  const [image] = ddsInfo.images;
  const [imageWidth, imageHeight] = image.shape;
  const view = new DataView(buffer, image.offset, image.length);

  // Convert the compressed DXT texture to RGBA pixel data.
  const rgbaData = decodeDXT(
    view,
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
