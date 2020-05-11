import { BufferGeometry, BufferAttribute, Face3, Vector3 } from 'three';
import VoxelChunk, { DEFAULT_BUILD_OPTIONS } from './VoxelChunk';

export default class VoxelGeometry extends BufferGeometry {
    chunk: VoxelChunk;
    faceOptions: any;
    constructor(chunk: VoxelChunk, faceOptions = DEFAULT_BUILD_OPTIONS) {
        super();
        this.faceOptions = faceOptions;
        this.chunk = chunk;
        this.update();
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

    update() {
        const { vertices, colors } = this.chunk.rebuild(this.faceOptions);
        const vertexBuffer = new BufferAttribute(new Float32Array(vertices.length * 3), 3);
        for (var i = 0; i < vertices.length; i++) {
            vertexBuffer.setXYZ(i, vertices[i][0], vertices[i][1], vertices[i][2]);
        }
        this.setAttribute('position', vertexBuffer);

        var colorBuffer = new BufferAttribute(new Float32Array(colors.length * 4), 4);
        for (var i = 0; i < colors.length; i++) {
            colorBuffer.setXYZW(i, colors[i][0] / 255, colors[i][1] / 255, colors[i][2] / 255, colors[i][3] / 255);
        }
        this.setAttribute('color', colorBuffer);
        this.deleteAttribute('normal');

        this.computeVertexNormals();
        this.computeBoundingSphere();
    }
}