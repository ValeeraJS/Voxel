import VoxelBlock from "./VoxelBlock";
import IColor4 from "./interfaces/IColor4";
import { AbstractTreeNode } from '@valeera/tree';
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
export default class VoxelChunk extends AbstractTreeNode {
    static buildType: typeof VOXEL_BUILD_TYPE;
    blockSize: number;
    sizeX: number;
    sizeY: number;
    sizeZ: number;
    rangeX: number[];
    rangeY: number[];
    rangeZ: number[];
    activeTriangles: number;
    blocks: VoxelBlock[][][];
    sides: number;
    create(sizex: number, sizey: number, sizez: number, blockSize?: number): this;
    activateBlock(x: number, y: number, z: number, color: IColor4): this;
    getActiveBlocksCount(): number;
    hasActiveBlocks(): any;
    loopBlocks(func: (block: VoxelBlock, x: number, y: number, z: number) => any, needRange?: boolean, value?: any): any;
    resetDrawnSide(): this;
    checkBlockActive(x: number, y: number, z: number): boolean;
    checkDrawLeft(x: number, y: number, z: number): boolean;
    checkDrawRight(x: number, y: number, z: number): boolean;
    checkDrawBack(x: number, y: number, z: number): boolean;
    checkDrawFront(x: number, y: number, z: number): boolean;
    checkDrawTop(x: number, y: number, z: number): boolean;
    checkDrawBottom(x: number, y: number, z: number): boolean;
    drawBottom(vertices: number[], colors: number[], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    drawTop(vertices: number[], colors: number[], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    drawFront(vertices: number[], colors: number[], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    drawBack(vertices: number[], colors: number[], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    drawRight(vertices: number[], colors: number[], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    drawLeft(vertices: number[], colors: number[], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE): void;
    private setColorData;
    rebuild(faceOptions?: any): {
        vertices: number[];
        colors: number[];
    };
}
