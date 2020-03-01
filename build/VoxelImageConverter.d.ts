import VoxelChunk from "./VoxelChunk";
export default class VoxelImageConverter {
    static canvas: HTMLCanvasElement;
    static convert: (image: HTMLImageElement, width?: number | undefined, height?: number | undefined, depth?: number, options?: {
        x?: number | undefined;
        y?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
    } | undefined) => false | VoxelChunk;
    static createChunk(imgData: Uint8ClampedArray, width: number, height: number, depth: number): VoxelChunk;
}
