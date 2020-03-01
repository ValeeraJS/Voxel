import { BufferGeometry, BufferAttribute } from 'three';
import VoxelChunk, {DEFAULT_BUILD_OPTIONS} from './VoxelChunk';

export default class VoxelGeometry extends BufferGeometry {
    chunk: VoxelChunk;
    faceOptions: any;
    constructor(chunk: VoxelChunk, faceOptions = DEFAULT_BUILD_OPTIONS) {
        super();
        this.faceOptions = faceOptions;
        this.chunk = chunk;
        this.update();
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

        this.computeVertexNormals();
    }
}