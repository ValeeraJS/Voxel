import VoxelChunk from './VoxelChunk';
export default class VoxelLoader {
    chunk: VoxelChunk;
    private readInt;
    parse(arrayBuffer: ArrayBuffer): VoxelChunk | null;
    load(url: string): Promise<VoxelChunk | null>;
}
