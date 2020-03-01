import VoxelBlock from "./VoxelBlock";
import IColor4 from "./interfaces/IColor4";
export declare enum VOXEL_BUILD_TYPE {
    NONE = "NONE",
    SURFACE = "SURFACE",
    VOLUME = "VOLUME",
    BRICKS = "BRICKS"
}
export declare const DEFAULT_BUILD_OPTIONS: {
    left: VOXEL_BUILD_TYPE;
    right: VOXEL_BUILD_TYPE;
    top: VOXEL_BUILD_TYPE;
    bottom: VOXEL_BUILD_TYPE;
    front: VOXEL_BUILD_TYPE;
    back: VOXEL_BUILD_TYPE;
};
export default class VoxelChunk {
    static buildType: typeof VOXEL_BUILD_TYPE;
    blockSize: number;
    chunkSizeX: number;
    chunkSizeY: number;
    chunkSizeZ: number;
    posX: number;
    posY: number;
    posZ: number;
    type: string;
    activeTriangles: number;
    blocks: VoxelBlock[][][];
    avgHeight: number;
    sides: number;
    create(sizex: number, sizey: number, sizez: number, blockSize?: number): void;
    activateBlock(x: number, y: number, z: number, color: IColor4): void;
    getActiveBlocksCount(): number;
    hasActiveBlocks(): any;
    traverse(func: (block: VoxelBlock, x: number, y: number, z: number) => any, value?: any): any;
    resetDrawnSide(): void;
    checkBlockActive(x: number, y: number, z: number): boolean;
    checkDrawLeft(x: number, y: number, z: number): boolean;
    checkDrawRight(x: number, y: number, z: number): boolean;
    checkDrawBack(x: number, y: number, z: number): boolean;
    checkDrawFront(x: number, y: number, z: number): boolean;
    checkDrawTop(x: number, y: number, z: number): boolean;
    checkDrawBottom(x: number, y: number, z: number): boolean;
    drawBottom(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    drawTop(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    drawFront(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    drawBack(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    drawRight(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    drawLeft(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    private setColorData;
    rebuild(faceOptions?: any): {
        vertices: number[][];
        colors: number[][];
    };
}
