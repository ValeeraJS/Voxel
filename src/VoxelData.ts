import IVoxelData from "./interfaces/IVoxelData";

export default class VoxelData implements IVoxelData{
    x: number = 0;
    y: number = 0;
    z: number = 0;
    color: number = 0;

    fromBuffer(buffer: Uint8Array, i: number, subSample: boolean) {
        this.x = (subSample? buffer[i] & 0xFF / 2 : buffer[i++] & 0xFF);
        this.y = (subSample? buffer[i] & 0xFF / 2 : buffer[i++] & 0xFF);
        this.z = (subSample? buffer[i] & 0xFF / 2 : buffer[i++] & 0xFF);
        this.color = buffer[i] & 0xFF;
    }
}
