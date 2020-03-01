import IVoxelData from "./interfaces/IVoxelData";
export default class VoxelData implements IVoxelData {
    x: number;
    y: number;
    z: number;
    color: number;
    fromBuffer(buffer: Uint8Array, i: number, subSample: boolean): void;
}
