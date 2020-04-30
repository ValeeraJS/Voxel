import VoxelChunk from "./VoxelChunk";

// 工具类，用于将线段转成体素

export default class VoxelLineConverter {
    static canvas = document.createElement("canvas");
    static convert = (image: HTMLImageElement, width?: number, height?: number, depth: number = 1, options?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }) => {
        const canvas = VoxelLineConverter.canvas;
        canvas.width = width || image.naturalWidth;
        canvas.height = height || image.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return false;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (options) {
            ctx.drawImage(image, options.x || 0, options.y || 0, options.width || image.naturalWidth, options.height || image.naturalHeight, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        return VoxelLineConverter.createChunk(data, canvas.width, canvas.height, depth);
    }

    static createChunk(imgData: Uint8ClampedArray, width: number, height: number, depth: number) {
        const chunk = new VoxelChunk();
        chunk.create(width, height, depth);
        for(let h = 0; h < depth; h++) {
            for (let i = 0; i < height; i ++) {
                for (let j = 0; j < width; j ++) {
                    chunk.activateBlock(j, i, h, {
                        r: imgData[(height - 1 - i) * height * 4 + j * 4],
                        g: imgData[(height - 1 - i) * height * 4 + j * 4 + 1],
                        b: imgData[(height - 1 - i) * height * 4 + j * 4 + 2],
                        a: imgData[(height - 1 - i) * height * 4 + j * 4 + 3],
                    })
                }
            }
        }
        return chunk;
    }
}