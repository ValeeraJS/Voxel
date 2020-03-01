import VoxelBlock from "./VoxelBlock";
import IColor4 from "./interfaces/IColor4";

export enum VOXEL_BUILD_TYPE {
    NONE = "NONE",
    SURFACE = "SURFACE",
    VOLUME = "VOLUME",
    BRICKS = "BRICKS"
};

export const DEFAULT_BUILD_OPTIONS = {
    left: VOXEL_BUILD_TYPE.SURFACE,
    right: VOXEL_BUILD_TYPE.SURFACE,
    top: VOXEL_BUILD_TYPE.SURFACE,
    bottom: VOXEL_BUILD_TYPE.SURFACE,
    front: VOXEL_BUILD_TYPE.SURFACE,
    back: VOXEL_BUILD_TYPE.SURFACE,
}

export default class VoxelChunk {
    static buildType = VOXEL_BUILD_TYPE;
    blockSize = 1;
    chunkSizeX = 0;
    chunkSizeY = 0;
    chunkSizeZ = 0;
    posX = 0;
    posY = 0;
    posZ = 0;
    type = "GenericChunk";
    activeTriangles = 0;
    blocks: VoxelBlock[][][];
    avgHeight = 0;
    sides = 0;

    create(sizex: number, sizey: number, sizez: number, blockSize = 1) {
        this.chunkSizeX = sizex;
        this.chunkSizeY = sizey;
        this.chunkSizeZ = sizez;
        this.blockSize = blockSize;
        this.blocks = [];

        for (let x = 0; x < sizex; x++) {
            this.blocks[x] = [];
            for (let y = 0; y < sizey; y++) {
                this.blocks[x][y] = [];
                for (let z = 0; z < sizez; z++) {
                    this.blocks[x][y][z] = new VoxelBlock(false, 0, 0, 0, 0);
                }
            }
        }
    }

    activateBlock(x: number, y: number, z: number, color: IColor4) {
        const block = this.blocks[x][y][z];
        if (!block) {
            return;
        }
        if (color.a === 0) {
            block.active = false;
        } else {
            block.active = true;
        }
        block.r = color.r;
        block.g = color.g;
        block.b = color.b;
        block.a = color.a;
    }

    getActiveBlocksCount() {
        let b = 0;
        if (this.blocks) {
            this.traverse((block: VoxelBlock) => {
                if (block.active) {
                    b++;
                }
            });
        }
        return b;
    }

    hasActiveBlocks() {
        if (this.blocks) {
            return this.traverse((block: VoxelBlock) => {
                if (block.active) {
                    return { 'return': true };
                }
            }, false);
        }
        return false;
    }

    traverse(func: (block: VoxelBlock, x: number, y: number, z: number) => any, value?: any) {
        let res;
        for (let x = 0; x < this.chunkSizeX; x++) {
            for (let y = 0; y < this.chunkSizeY; y++) {
                for (let z = 0; z < this.chunkSizeZ; z++) {
                    res = func(this.blocks[x][y][z], x, y, z);
                    if (res && 'return' in res) {
                        return res.return;
                    } else if (res && res.continue) {
                        continue;
                    } else if (res && res.break) {
                        break;
                    }
                }
            }
        }
        return value;
    }

    resetDrawnSide() {
        this.traverse((block: VoxelBlock) => {
            block.resetDrawnSide();
        });
    }

    // 检测某一个方块是否应该被画，如果方块周围都有其他方块，那么该方块不可以被画
    checkBlockActive(x: number, y: number, z: number) {
        if (!this.blocks[x][y][z].active) {
            return false;
        }
        if (y > 0 && y < this.chunkSizeY - 1 &&
            x > 0 && x < this.chunkSizeX - 1 &&
            z > 0 && z < this.chunkSizeZ - 1) {
            if (this.blocks[x - 1][y][z].active &&
                this.blocks[x + 1][y][z].active &&
                this.blocks[x][y][z + 1].active &&
                this.blocks[x][y][z - 1].active &&
                this.blocks[x][y + 1][z].active &&
                this.blocks[x][y - 1][z].active) {
                return false;
            }
        }
        return true;
    }

    checkDrawLeft(x: number, y: number, z: number) {
        if (x > 0 && this.blocks[x - 1][y][z].active) {
            return false;
        }
        return true;
    }

    checkDrawRight(x: number, y: number, z: number) {
        if (x < this.chunkSizeX - 1 && this.blocks[x + 1][y][z].active) {
            return false;
        }
        return true;
    }

    checkDrawBack(x: number, y: number, z: number) {
        if (z > 0 && this.blocks[x][y][z - 1].active) {
            return false;
        }
        return true;
    }

    checkDrawFront(x: number, y: number, z: number) {
        if (z < this.chunkSizeZ - 1 && this.blocks[x][y][z + 1].active) {
            return false;
        }
        return true;
    }

    checkDrawTop(x: number, y: number, z: number) {
        if (y < this.chunkSizeY - 1 && this.blocks[x][y + 1][z].active) {
            return false;
        }
        return true;
    }

    checkDrawBottom(x: number, y: number, z: number) {
        if (y > 0 && this.blocks[x][y - 1][z].active) {
            return false;
        }
        return true;
    }

    drawBottom(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE) {
        const block: VoxelBlock = this.blocks[x][y][z];
        if (block.drawnBottomSide) {
            return;
        }
        let blockSize = this.blockSize;
        let countX = 0;
        let countZ = 0;
        let blockX, blockZ;
        for (let cx = 0; cx + x < this.chunkSizeX; cx++) {
            blockX = this.blocks[x + cx][y][z];
            if (blockX.active && !blockX.drawnBottomSide && blockX.colorEquals(block)
                && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawBottom(x + cx, y, z) : true)) {
                countX++;
                let tmpCountZ = 0;
                for (let cz = 0; cz + z < this.chunkSizeZ; cz++) {
                    blockZ = this.blocks[x + cx][y][z + cz];
                    if (blockZ.active && !blockZ.drawnBottomSide && blockZ.colorEquals(block) 
                        && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawBottom(x + cx, y, z + cz) : true)) {
                        tmpCountZ++;
                    } else {
                        break;
                    }
                }
                if (tmpCountZ < countZ || countZ === 0) {
                    countZ = tmpCountZ;
                }
                if (tmpCountZ === 0 && countZ > countX) {
                    break;
                }
            } else {
                break;
            }
        }
        for (let x1 = 0; x1 < countX; x1++) {
            for (let y1 = 0; y1 < countZ; y1++) {
                this.blocks[x + x1][y][z + y1].drawnBottomSide = true;
            }
        }

        vertices.push([(x + countX) * blockSize, y * blockSize, (z + countZ) * blockSize]);
        vertices.push([x * blockSize, y * blockSize, (z + countZ) * blockSize]);
        vertices.push([x * blockSize, y * blockSize, z * blockSize]);

        vertices.push([(x + countX) * blockSize, y * blockSize, (z + countZ) * blockSize]);
        vertices.push([x * blockSize, y * blockSize, z * blockSize]);
        vertices.push([(x + countX) * blockSize, y * blockSize, z * blockSize]);

        this.setColorData(colors, block);
        return;
    }

    drawTop(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE) {
        const block: VoxelBlock = this.blocks[x][y][z];
        if (block.drawnTopSide) {
            return;
        }
        let blockSize = this.blockSize;
        let countX = 0;
        let countZ = 0;
        let blockX, blockZ;
        for (let cx = 0; cx + x < this.chunkSizeX; cx++) {
            blockX = this.blocks[x + cx][y][z];
            if (blockX.active && !blockX.drawnTopSide && blockX.colorEquals(block) 
                && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawTop(x + cx, y, z) : true)) {
                countX++;
                let tmpCountY = 0;
                for (let cz = 0; cz + z < this.chunkSizeZ; cz++) {
                    blockZ = this.blocks[x + cx][y][z + cz];
                    if (blockZ.active && !blockZ.drawnTopSide && blockZ.colorEquals(block) 
                        && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawTop(x + cx, y, z + cz) : true)) {
                        tmpCountY++;
                    } else {
                        break;
                    }
                }
                if (tmpCountY < countZ || countZ === 0) {
                    countZ = tmpCountY;
                }
                if (tmpCountY === 0 && countZ > countX) {
                    break;
                }
            } else {
                break;
            }
        }
        for (let x1 = 0; x1 < countX; x1++) {
            for (let y1 = 0; y1 < countZ; y1++) {
                this.blocks[x + x1][y][z + y1].drawnTopSide = true;
            }
        }
        vertices.push([(x + countX) * blockSize, y * blockSize + blockSize, (z + countZ) * blockSize]);
        vertices.push([x * blockSize, y * blockSize + blockSize, z * blockSize]);
        vertices.push([x * blockSize, y * blockSize + blockSize, (z + countZ) * blockSize]);

        vertices.push([(x + countX) * blockSize, y * blockSize + blockSize, (z + countZ) * blockSize]);
        vertices.push([(x + countX) * blockSize, y * blockSize + blockSize, z * blockSize]);
        vertices.push([x * blockSize, y * blockSize + blockSize, z * blockSize]);

        this.setColorData(colors, block);
        return;
    }

    drawFront(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE) {
        const block: VoxelBlock = this.blocks[x][y][z];
        if (block.drawnFrontSide) {
            return;
        }
        let blockSize = this.blockSize;
        let countX = 0;
        let countY = 0;
        let blockX, blockY;
        for (let cx = 0; cx + x < this.chunkSizeX; cx++) {
            blockX = this.blocks[x + cx][y][z];
            if (blockX.active && !blockX.drawnFrontSide && blockX.colorEquals(block) 
                && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawFront(x + cx, y, z) : true)) {
                countX++;
                let tmpCountY = 0;
                for (let cy = 0; cy + y < this.chunkSizeY; cy++) {
                    blockY = this.blocks[x + cx][y + cy][z];
                    if (blockY.active && !blockY.drawnFrontSide && blockY.colorEquals(block)
                        && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawFront(x + cx, y + cy, z) : true)) {
                        tmpCountY++;
                    } else {
                        break;
                    }
                }
                if (tmpCountY < countY || countY === 0) {
                    countY = tmpCountY;
                }
                if (tmpCountY === 0 && countY > countX) {
                    break;
                }
            } else {
                break;
            }
        }
        for (let x1 = 0; x1 < countX; x1++) {
            for (let y1 = 0; y1 < countY; y1++) {
                this.blocks[x + x1][y + y1][z].drawnFrontSide = true;
            }
        }
        vertices.push([(x + countX) * blockSize, (y + countY) * blockSize, z * blockSize + blockSize]);
        vertices.push([x * blockSize, (y + countY) * blockSize, z * blockSize + blockSize]);
        vertices.push([(x + countX) * blockSize, y * blockSize, z * blockSize + blockSize]);

        vertices.push([x * blockSize, (y + countY) * blockSize, z * blockSize + blockSize]);
        vertices.push([x * blockSize, y * blockSize, z * blockSize + blockSize]);
        vertices.push([(x + countX) * blockSize, y * blockSize, z * blockSize + blockSize]);

        this.setColorData(colors, block);

        return;
    }

    drawBack(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE) {
        const block: VoxelBlock = this.blocks[x][y][z];
        if (block.drawnBackSide) {
            return;
        }
        let blockSize = this.blockSize;
        let countX = 0;
        let countY = 0;
        let blockX, blockY;
        for (let cx = 0; cx + x < this.chunkSizeX; cx++) {
            blockX = this.blocks[x + cx][y][z];
            if (blockX.active && !blockX.drawnBackSide && blockX.colorEquals(block)
                && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawBack(x + cx, y, z) : true)) {
                countX++;
                let tmpCountY = 0;
                for (let cy = 0; cy + y < this.chunkSizeY; cy++) {
                    blockY = this.blocks[x + cx][y + cy][z];
                    if (blockY.active && !blockY.drawnBackSide && blockY.colorEquals(block)
                        && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawBack(x + cx, y + cy, z) : true)) {
                        tmpCountY++;
                    } else {
                        break;
                    }
                }
                if (tmpCountY < countY || countY === 0) {
                    countY = tmpCountY;
                }
                if (tmpCountY === 0 && countY > countX) {
                    break;
                }
            } else {
                break;
            }
        }
        for (let x1 = 0; x1 < countX; x1++) {
            for (let y1 = 0; y1 < countY; y1++) {
                this.blocks[x + x1][y + y1][z].drawnBackSide = true;
            }
        }
        vertices.push([(x + countX) * blockSize, (y + countY) * blockSize, z * blockSize]);
        vertices.push([x * blockSize, (y + countY) * blockSize, z * blockSize]);
        vertices.push([(x + countX) * blockSize, y * blockSize, z * blockSize]);

        vertices.push([x * blockSize, (y + countY) * blockSize, z * blockSize]);
        vertices.push([x * blockSize, y * blockSize, z * blockSize]);
        vertices.push([(x + countX) * blockSize, y * blockSize, z * blockSize]);

        this.setColorData(colors, block);
        return;

        // const block: VoxelBlock = this.blocks[x][y][z];
        // let blockSize = this.blockSize;
        // sides++;
        // vertices.push([x * blockSize + blockSize, y * blockSize + blockSize, z * blockSize]);
        // vertices.push([x * blockSize + blockSize, y * blockSize, z * blockSize]);
        // vertices.push([x * blockSize, y * blockSize, z * blockSize]);

        // vertices.push([x * blockSize + blockSize, y * blockSize + blockSize, z * blockSize]);
        // vertices.push([x * blockSize, y * blockSize, z * blockSize]);
        // vertices.push([x * blockSize, y * blockSize + blockSize, z * blockSize]);
        // for (let i = 0; i < 6; i++) {
        //     colors.push([
        //         block.r,
        //         block.g,
        //         block.b,
        //         block.a
        //     ]);
        // }
        // return sides;
    }

    drawRight(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE) {
        const block: VoxelBlock = this.blocks[x][y][z];
        if (block.drawnRightSide) {
            return;
        }
        let blockSize = this.blockSize;
        let countY = 0;
        let countZ = 0;
        let blockY, blockZ;
        for (let cy = 0; cy < this.chunkSizeY; cy++) {
            if (y + cy >= this.chunkSizeY) {
                break;
            }
            blockY = this.blocks[x][y + cy][z];
            if (blockY.active && !blockY.drawnRightSide && blockY.colorEquals(block)
                && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawRight(x, y + cy, z) : true)) {
                countY++;
                let tmpCountY = 0;
                for (let cz = 0; cz < this.chunkSizeZ; cz++) {
                    if (z + cz >= this.chunkSizeZ) {
                        break;
                    }
                    blockZ = this.blocks[x][y + cy][z + cz];
                    if (blockZ.active && !blockZ.drawnRightSide && blockZ.colorEquals(block)
                        && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawRight(x, y + cy, z + cz) : true)) {
                        tmpCountY++;
                    } else {
                        break;
                    }
                }
                if (tmpCountY < countZ || countZ === 0) {
                    countZ = tmpCountY;
                }
                if (tmpCountY === 0 && countZ > countY) {
                    break;
                }
            } else {
                break;
            }
        }
        for (let x1 = 0; x1 < countY; x1++) {
            for (let y1 = 0; y1 < countZ; y1++) {
                this.blocks[x][y + x1][z + y1].drawnRightSide = true;
            }
        }
        vertices.push([x * blockSize + blockSize, y * blockSize, z * blockSize]);
        vertices.push([x * blockSize + blockSize, (y + countY) * blockSize, (z + countZ) * blockSize]);
        vertices.push([x * blockSize + blockSize, y * blockSize, (z + countZ) * blockSize]);

        vertices.push([x * blockSize + blockSize, (y + countY) * blockSize, (z + countZ) * blockSize]);
        vertices.push([x * blockSize + blockSize, y * blockSize, z * blockSize]);
        vertices.push([x * blockSize + blockSize, (y + countY) * blockSize, z * blockSize]);

        this.setColorData(colors, block);
        return;
    }

    // 绘制左侧部分，将某一个方块所有相邻同色方块合并为一个方块面，减少顶点数。
    drawLeft(vertices: number[][], colors: number[][], x: number, y: number, z: number, type: VOXEL_BUILD_TYPE) {
        const block: VoxelBlock = this.blocks[x][y][z];
        // 如果这个方块面已经被其他方块面融合为一个面，就不再对这个方块做处理。
        if (block.drawnLeftSide) {
            return;
        }
        let countY = 0;
        let countZ = 0;
        let blockSize = this.blockSize;
        let ycy = 0, blockY: VoxelBlock, blockZ: VoxelBlock;
        for (let cy = 0; y + cy < this.chunkSizeY; cy++) {
            ycy = y + cy;
            blockY = this.blocks[x][ycy][z];
            if (blockY.active && !blockY.drawnLeftSide && blockY.colorEquals(block)
                && (type === VOXEL_BUILD_TYPE.SURFACE ?this.checkDrawLeft(x, ycy, z) : true)) {
                countY++;
                let tmpCountY = 0;
                for (let cz = 0; z + cz < this.chunkSizeZ; cz++) {
                    blockZ = this.blocks[x][ycy][z + cz];
                    if (blockZ.active && !blockZ.drawnLeftSide && blockZ.colorEquals(block)
                        && (type === VOXEL_BUILD_TYPE.SURFACE ?this.checkDrawLeft(x, ycy, z + cz) : true)) {
                        tmpCountY++;
                    } else {
                        break;
                    }
                }
                if (tmpCountY < countZ || countZ === 0) {
                    countZ = tmpCountY;
                }
                if (tmpCountY === 0 && countZ > countY) {
                    break;
                }
            } else {
                break;
            }
        }
        for (let x1 = 0; x1 < countY; x1++) {
            for (let y1 = 0; y1 < countZ; y1++) {
                this.blocks[x][y + x1][z + y1].drawnLeftSide = true;
            }
        }
        block.drawnLeftSide = true;
        vertices.push([x * blockSize, y * blockSize, z * blockSize]);
        vertices.push([x * blockSize, y * blockSize, (z + countZ) * blockSize]);
        vertices.push([x * blockSize, (y + countY) * blockSize, (z + countZ) * blockSize]);

        vertices.push([x * blockSize, y * blockSize, z * blockSize]);
        vertices.push([x * blockSize, (y + countY) * blockSize, (z + countZ) * blockSize]);
        vertices.push([x * blockSize, (y + countY) * blockSize, z * blockSize]);

        this.setColorData(colors, block);
        return;
    }

    private setColorData(colors: number[][], block: VoxelBlock) {
        for (let i = 0; i < 6; i++) {
            colors.push([
                block.r, 
                block.g,
                block.b,
                block.a
            ]);
        }
        this.sides++;
    }

    rebuild(faceOptions: any = {}) {
        faceOptions = {
            ...DEFAULT_BUILD_OPTIONS,
            ...faceOptions
        }

        this.sides = 0;
        const vertices: number[][] = [];
        const colors: number[][] = [];
        if (!this.hasActiveBlocks()) {
            return {
                vertices,
                colors
            };
        }
        // 重置所有邻接关系
        this.resetDrawnSide();
        // 遍历所有方块，确定方块到底哪些需要画，需要画哪一个面。active表示是否是个空的格子
        this.traverse((block, x, y, z) => {
            // 空的方格直接跳过
            if (!block.active) {
                return { 'continue': true };
            }
            // 检查左侧绘制
            if (faceOptions.left !== VOXEL_BUILD_TYPE.NONE && this.checkDrawLeft(x, y, z)) {
                this.drawLeft(vertices, colors, x, y, z, faceOptions.left);
            }
            if (faceOptions.right !== VOXEL_BUILD_TYPE.NONE && this.checkDrawRight(x, y, z)) {
                this.drawRight(vertices, colors, x, y, z, faceOptions.right);
            }
            if (faceOptions.back !== VOXEL_BUILD_TYPE.NONE && this.checkDrawBack(x, y, z)) {
                this.drawBack(vertices, colors, x, y, z, faceOptions.back);
            }
            if (faceOptions.front !== VOXEL_BUILD_TYPE.NONE && this.checkDrawFront(x, y, z)) {
                this.drawFront(vertices, colors, x, y, z, faceOptions.front);
            }
            if (faceOptions.top !== VOXEL_BUILD_TYPE.NONE && this.checkDrawTop(x, y, z)) {
                this.drawTop(vertices, colors, x, y, z, faceOptions.top);
            }
            if (faceOptions.bottom !== VOXEL_BUILD_TYPE.NONE && this.checkDrawBottom(x, y, z)) {
                this.drawBottom(vertices, colors, x, y, z, faceOptions.bottom);
            }
        });
        return {
            vertices,
            colors
        }
    }
}
