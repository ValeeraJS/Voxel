import VoxelChunk from "./VoxelChunk";
import { BoxBufferGeometry, Face3 } from "three";
export default class VoxelBoundingGeometry extends BoxBufferGeometry {
    chunk: VoxelChunk;
    constructor(chunk: VoxelChunk);
    getVoxelPositionByFace(face: Face3): number[];
}
