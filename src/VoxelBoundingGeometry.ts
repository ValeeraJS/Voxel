import VoxelChunk from "./VoxelChunk";
import { BoxBufferGeometry, Vector3, Face3 } from "three";

export default class VoxelBoundingGeometry extends BoxBufferGeometry {
    chunk: VoxelChunk;

    constructor(chunk: VoxelChunk) {
        const {sizeX, sizeY, sizeZ, blockSize} = chunk;
        super(sizeX * blockSize, sizeY * blockSize, sizeZ * blockSize, sizeX, sizeY, sizeZ);
        this.chunk = chunk;
        let attr = this.getAttribute('position');
        let {array, count} = attr;
        const dx = sizeX * blockSize / 2;
        const dy = sizeY * blockSize / 2;
        const dz = sizeZ * blockSize / 2;
        for (let i = 0; i < count; i++) {
            attr.setX(i, array[i * 3] + dx);
            attr.setY(i, array[i * 3 + 1] + dy);
            attr.setZ(i, array[i * 3 + 2] + dz);
        }
    }

    getVoxelPositionByFace(face: Face3) {
        let normal = face.normal;
        const arr = this.getAttribute('position');
        let i = face.a * 3;
        const v1 = new Vector3(arr.array[i], arr.array[i + 1], arr.array[i + 2]);
        i = face.b * 3;
        const v2 = new Vector3(arr.array[i], arr.array[i + 1], arr.array[i + 2]);
        i = face.c * 3;
        const v3 = new Vector3(arr.array[i], arr.array[i + 1], arr.array[i + 2]);

        let minX = Math.min(Math.min(v1.x, v2.x), v3.x) / this.chunk.blockSize;
        let minY = Math.min(Math.min(v1.y, v2.y), v3.y) / this.chunk.blockSize;
        let minZ = Math.min(Math.min(v1.z, v2.z), v3.z) / this.chunk.blockSize;
        if (normal.x > 0) {
            minX--;
        }
        if (normal.y > 0) {
            minY--;
        }
        if (normal.z > 0) {
            minZ--;
        }

        return [minX, minY, minZ];
    }
}
