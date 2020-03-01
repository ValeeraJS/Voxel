import Fetcher from '@valeera/fetcher';
import VoxelChunk from './VoxelChunk';
import VoxelData from './VoxelData';
import VoxelColors from './constants/VoxelColors';

export default class VoxelLoader {

    chunk: VoxelChunk;

    private readInt(buffer: Uint8Array, from: number) {
        return buffer[from] | (buffer[from + 1] << 8) | (buffer[from + 2] << 16) | (buffer[from + 3] << 24);
    }

    parse(arrayBuffer: ArrayBuffer) {
        // var colors = [];
        let colors2 = undefined;
        let voxelData: VoxelData[] = [];
        const chunk = new VoxelChunk();

        const buffer = new Uint8Array(arrayBuffer);
        const voxId = this.readInt(buffer, 0);
        const version = this.readInt(buffer, 4);
        console.log(voxId, version);
        let i = 8;
        while (i < buffer.length) {
            let subSample = false;
            let sizex = 0, sizey = 0, sizez = 0;
            const id = String.fromCharCode(buffer[i++]) +
                String.fromCharCode(buffer[i++]) +
                String.fromCharCode(buffer[i++]) +
                String.fromCharCode(buffer[i++]);

            const chunkSize = this.readInt(buffer, i) & 0xFF;
            console.log('chunkSize', chunkSize);
            i += 4;
            // TODO
            const childChunks = this.readInt(buffer, i) & 0xFF;
            console.log('childChunks===', childChunks);
            i += 4;
            if (id === "SIZE") {
                sizex = this.readInt(buffer, i) & 0xFF;
                i += 4;
                sizey = this.readInt(buffer, i) & 0xFF;
                i += 4;
                sizez = this.readInt(buffer, i) & 0xFF;
                i += 4;
                if (sizex > 32 || sizey > 32) {
                    subSample = true;
                }
                chunk.create(sizex, sizey, sizez);
                i += chunkSize - 4 * 3;
            } else if (id === "XYZI") {
                var numVoxels = Math.abs(this.readInt(buffer, i));
                i += 4;
                voxelData = new Array(numVoxels);
                for (var n = 0; n < voxelData.length; n++) {
                    ;
                    voxelData[n] = new VoxelData();
                    voxelData[n].fromBuffer(buffer, i, subSample); // Read 4 bytes
                    i += 4;
                }
            } else if (id === "RGBA") {
                colors2 = new Array(256);
                for (var n = 0; n < 256; n++) {
                    var r = buffer[i++] & 0xFF;
                    var g = buffer[i++] & 0xFF;
                    var b = buffer[i++] & 0xFF;
                    var a = buffer[i++] & 0xFF;
                    colors2[n] = { 'r': r, 'g': g, 'b': b, 'a': a };
                }
            } else {
                // console.log('unknow id', id);
                i += chunkSize;
            }
        }
        if (voxelData === null || voxelData.length === 0) {
            return null;
        }

        let c, cRGBA;
        for (var n = 0; n < voxelData.length; n++) {
            if (colors2 === undefined) {
                c = VoxelColors[Math.abs(voxelData[n].color - 1)];
                cRGBA = {
                    b: (c & 0xff0000) >> 16,
                    g: (c & 0x00ff00) >> 8,
                    r: (c & 0x0000ff),
                    a: 1
                };
                chunk.activateBlock(voxelData[n].x, voxelData[n].y, voxelData[n].z, cRGBA);
            } else {
                chunk.activateBlock(voxelData[n].x, voxelData[n].y, voxelData[n].z, colors2[Math.abs(voxelData[n].color - 1)]);
            }
        }
        return chunk;
    }

    load(url: string) {
        let fetcher = new Fetcher(url);
        return fetcher.on(Fetcher.PROGRESSING, (e) => {
            console.log(e, '=========');
        }).fetch().then((data: Response) => {
            return data.arrayBuffer();
        }).then((buffer: ArrayBuffer) => {
            return this.parse(buffer);
        });
    }
}
