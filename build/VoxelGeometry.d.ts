import { BufferGeometry } from 'three';
import VoxelChunk from './VoxelChunk';
export default class VoxelGeometry extends BufferGeometry {
    chunk: VoxelChunk;
    faceOptions: any;
    constructor(chunk: VoxelChunk, faceOptions?: {
        left: import("./VoxelChunk").VOXEL_BUILD_TYPE;
        right: import("./VoxelChunk").VOXEL_BUILD_TYPE;
        top: import("./VoxelChunk").VOXEL_BUILD_TYPE;
        bottom: import("./VoxelChunk").VOXEL_BUILD_TYPE;
        front: import("./VoxelChunk").VOXEL_BUILD_TYPE;
        back: import("./VoxelChunk").VOXEL_BUILD_TYPE;
    });
    update(): void;
}
