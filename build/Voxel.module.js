import { RGBAColor } from '@valeera/mathx';
import { AbstractTreeNode } from '@valeera/tree';
import { BufferGeometry, BufferAttribute } from 'three';
import Fetcher from '@valeera/fetcher';

class VoxelBlock extends RGBAColor {
    constructor(isActive, r, g, b, a) {
        super(r, g, b, a);
        this.update(isActive, r, g, b, a);
        this.resetDrawnSide();
    }
    update(isActive, r, g, b, a) {
        this.active = isActive;
        return this.set(r, g, b, a);
    }
    resetDrawnSide() {
        this.drawnLeftSide = false;
        this.drawnTopSide = false;
        this.drawnFrontSide = false;
        this.drawnRightSide = false;
        this.drawnBottomSide = false;
        this.drawnBackSide = false;
        return this;
    }
}

var VOXEL_BUILD_TYPE;
(function (VOXEL_BUILD_TYPE) {
    VOXEL_BUILD_TYPE["NONE"] = "NONE";
    VOXEL_BUILD_TYPE["SURFACE"] = "SURFACE";
    VOXEL_BUILD_TYPE["VOLUME"] = "VOLUME";
    VOXEL_BUILD_TYPE["BRICKS"] = "BRICKS"; // 表面不合并（用于编辑）
})(VOXEL_BUILD_TYPE || (VOXEL_BUILD_TYPE = {}));
const DEFAULT_BUILD_OPTIONS = {
    left: VOXEL_BUILD_TYPE.BRICKS,
    right: VOXEL_BUILD_TYPE.BRICKS,
    top: VOXEL_BUILD_TYPE.BRICKS,
    bottom: VOXEL_BUILD_TYPE.BRICKS,
    front: VOXEL_BUILD_TYPE.BRICKS,
    back: VOXEL_BUILD_TYPE.BRICKS,
};
class VoxelChunk extends AbstractTreeNode {
    constructor() {
        super(...arguments);
        this.blockSize = 1;
        this.sizeX = 0;
        this.sizeY = 0;
        this.sizeZ = 0;
        this.rangeX = [0, Infinity];
        this.rangeY = [0, Infinity];
        this.rangeZ = [0, Infinity];
        this.activeTriangles = 0;
        this.sides = 0;
    }
    create(sizex, sizey, sizez, blockSize = 1) {
        this.sizeX = sizex;
        this.sizeY = sizey;
        this.sizeZ = sizez;
        this.rangeX[1] = sizex;
        this.rangeY[1] = sizey;
        this.rangeZ[1] = sizez;
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
    activateBlock(x, y, z, color) {
        const block = this.blocks[x][y][z];
        if (!block) {
            return;
        }
        if (color.a === 0) {
            block.active = false;
        }
        else {
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
            this.loopBlocks((block) => {
                if (block.active) {
                    b++;
                }
            });
        }
        return b;
    }
    hasActiveBlocks() {
        if (this.blocks) {
            return this.loopBlocks((block) => {
                if (block.active) {
                    return { 'return': true };
                }
            }, false, false);
        }
        return false;
    }
    loopBlocks(func, needRange = false, value) {
        let res;
        const startX = needRange ? this.rangeX[0] : 0;
        const startY = needRange ? this.rangeY[0] : 0;
        const startZ = needRange ? this.rangeZ[0] : 0;
        const endX = needRange ? this.rangeX[1] : this.sizeX;
        const endY = needRange ? this.rangeY[1] : this.sizeY;
        const endZ = needRange ? this.rangeZ[1] : this.sizeZ;
        console.log(startX, startY, startZ, endX, endY, endZ);
        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                for (let z = startZ; z < endZ; z++) {
                    res = func(this.blocks[x][y][z], x, y, z);
                    if (res && 'return' in res) {
                        return res.return;
                    }
                    else if (res && res.continue) {
                        continue;
                    }
                    else if (res && res.break) {
                        break;
                    }
                }
            }
        }
        return value;
    }
    resetDrawnSide() {
        this.loopBlocks((block) => {
            block.resetDrawnSide();
        });
    }
    // 检测某一个方块是否应该被画，如果方块周围都有其他方块，那么该方块不可以被画
    checkBlockActive(x, y, z) {
        if (!this.blocks[x][y][z].active) {
            return false;
        }
        if (y > 0 && y < this.sizeY - 1 &&
            x > 0 && x < this.sizeX - 1 &&
            z > 0 && z < this.sizeZ - 1) {
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
    checkDrawLeft(x, y, z) {
        if (x > this.rangeX[0] && this.blocks[x - 1][y][z].active) {
            return false;
        }
        return true;
    }
    checkDrawRight(x, y, z) {
        if (x < this.rangeX[1] - 1 && this.blocks[x + 1][y][z].active) {
            return false;
        }
        return true;
    }
    checkDrawBack(x, y, z) {
        if (z > this.rangeZ[0] && this.blocks[x][y][z - 1].active) {
            return false;
        }
        return true;
    }
    checkDrawFront(x, y, z) {
        if (z < this.rangeZ[1] - 1 && this.blocks[x][y][z + 1].active) {
            return false;
        }
        return true;
    }
    checkDrawTop(x, y, z) {
        if (y < this.rangeY[1] - 1 && this.blocks[x][y + 1][z].active) {
            return false;
        }
        return true;
    }
    checkDrawBottom(x, y, z) {
        if (y > this.rangeY[0] && this.blocks[x][y - 1][z].active) {
            return false;
        }
        return true;
    }
    drawBottom(vertices, colors, x, y, z, type) {
        const block = this.blocks[x][y][z];
        if (block.drawnBottomSide) {
            return;
        }
        let blockSize = this.blockSize;
        let countX = 0;
        let countZ = 0;
        let blockX, blockZ;
        if (type !== VOXEL_BUILD_TYPE.BRICKS) {
            for (let cx = 0; cx + x < this.rangeX[1]; cx++) {
                blockX = this.blocks[x + cx][y][z];
                if (blockX.active && !blockX.drawnBottomSide && blockX.equals(block)
                    && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawBottom(x + cx, y, z) : true)) {
                    countX++;
                    let tmpCountZ = 0;
                    for (let cz = 0; cz + z < this.rangeZ[1]; cz++) {
                        blockZ = this.blocks[x + cx][y][z + cz];
                        if (blockZ.active && !blockZ.drawnBottomSide && blockZ.equals(block)
                            && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawBottom(x + cx, y, z + cz) : true)) {
                            tmpCountZ++;
                        }
                        else {
                            break;
                        }
                    }
                    if (tmpCountZ < countZ || countZ === 0) {
                        countZ = tmpCountZ;
                    }
                    if (tmpCountZ === 0 && countZ > countX) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            for (let x1 = 0; x1 < countX; x1++) {
                for (let y1 = 0; y1 < countZ; y1++) {
                    this.blocks[x + x1][y][z + y1].drawnBottomSide = true;
                }
            }
        }
        else {
            countX++;
            countZ++;
            this.blocks[x][y][z].drawnBottomSide = true;
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
    drawTop(vertices, colors, x, y, z, type) {
        const block = this.blocks[x][y][z];
        if (block.drawnTopSide) {
            return;
        }
        let blockSize = this.blockSize;
        let countX = 0;
        let countZ = 0;
        let blockX, blockZ;
        if (type !== VOXEL_BUILD_TYPE.BRICKS) {
            for (let cx = 0; cx + x < this.rangeX[1]; cx++) {
                blockX = this.blocks[x + cx][y][z];
                if (blockX.active && !blockX.drawnTopSide && blockX.equals(block)
                    && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawTop(x + cx, y, z) : true)) {
                    countX++;
                    let tmpCountY = 0;
                    for (let cz = 0; cz + z < this.rangeZ[1]; cz++) {
                        blockZ = this.blocks[x + cx][y][z + cz];
                        if (blockZ.active && !blockZ.drawnTopSide && blockZ.equals(block)
                            && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawTop(x + cx, y, z + cz) : true)) {
                            tmpCountY++;
                        }
                        else {
                            break;
                        }
                    }
                    if (tmpCountY < countZ || countZ === 0) {
                        countZ = tmpCountY;
                    }
                    if (tmpCountY === 0 && countZ > countX) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            for (let x1 = 0; x1 < countX; x1++) {
                for (let y1 = 0; y1 < countZ; y1++) {
                    this.blocks[x + x1][y][z + y1].drawnTopSide = true;
                }
            }
        }
        else {
            countX++;
            countZ++;
            this.blocks[x][y][z].drawnTopSide = true;
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
    drawFront(vertices, colors, x, y, z, type) {
        const block = this.blocks[x][y][z];
        if (block.drawnFrontSide) {
            return;
        }
        let blockSize = this.blockSize;
        let countX = 0;
        let countY = 0;
        let blockX, blockY;
        if (type !== VOXEL_BUILD_TYPE.BRICKS) {
            for (let cx = 0; cx + x < this.rangeX[1]; cx++) {
                blockX = this.blocks[x + cx][y][z];
                if (blockX.active && !blockX.drawnFrontSide && blockX.equals(block)
                    && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawFront(x + cx, y, z) : true)) {
                    countX++;
                    let tmpCountY = 0;
                    for (let cy = 0; cy + y < this.rangeY[1]; cy++) {
                        blockY = this.blocks[x + cx][y + cy][z];
                        if (blockY.active && !blockY.drawnFrontSide && blockY.equals(block)
                            && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawFront(x + cx, y + cy, z) : true)) {
                            tmpCountY++;
                        }
                        else {
                            break;
                        }
                    }
                    if (tmpCountY < countY || countY === 0) {
                        countY = tmpCountY;
                    }
                    if (tmpCountY === 0 && countY > countX) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            for (let x1 = 0; x1 < countX; x1++) {
                for (let y1 = 0; y1 < countY; y1++) {
                    this.blocks[x + x1][y + y1][z].drawnFrontSide = true;
                }
            }
        }
        else {
            countX++;
            countY++;
            this.blocks[x][y][z].drawnFrontSide = true;
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
    drawBack(vertices, colors, x, y, z, type) {
        const block = this.blocks[x][y][z];
        if (block.drawnBackSide) {
            return;
        }
        let blockSize = this.blockSize;
        let countX = 0;
        let countY = 0;
        let blockX, blockY;
        if (type !== VOXEL_BUILD_TYPE.BRICKS) {
            for (let cx = 0; cx + x < this.rangeX[1]; cx++) {
                blockX = this.blocks[x + cx][y][z];
                if (blockX.active && !blockX.drawnBackSide && blockX.equals(block)
                    && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawBack(x + cx, y, z) : true)) {
                    countX++;
                    let tmpCountY = 0;
                    for (let cy = 0; cy + y < this.rangeY[1]; cy++) {
                        blockY = this.blocks[x + cx][y + cy][z];
                        if (blockY.active && !blockY.drawnBackSide && blockY.equals(block)
                            && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawBack(x + cx, y + cy, z) : true)) {
                            tmpCountY++;
                        }
                        else {
                            break;
                        }
                    }
                    if (tmpCountY < countY || countY === 0) {
                        countY = tmpCountY;
                    }
                    if (tmpCountY === 0 && countY > countX) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            for (let x1 = 0; x1 < countX; x1++) {
                for (let y1 = 0; y1 < countY; y1++) {
                    this.blocks[x + x1][y + y1][z].drawnBackSide = true;
                }
            }
        }
        else {
            countX++;
            countY++;
            this.blocks[x][y][z].drawnBackSide = true;
        }
        vertices.push([(x + countX) * blockSize, (y + countY) * blockSize, z * blockSize]);
        vertices.push([x * blockSize, (y + countY) * blockSize, z * blockSize]);
        vertices.push([(x + countX) * blockSize, y * blockSize, z * blockSize]);
        vertices.push([x * blockSize, (y + countY) * blockSize, z * blockSize]);
        vertices.push([x * blockSize, y * blockSize, z * blockSize]);
        vertices.push([(x + countX) * blockSize, y * blockSize, z * blockSize]);
        this.setColorData(colors, block);
        return;
    }
    drawRight(vertices, colors, x, y, z, type) {
        const block = this.blocks[x][y][z];
        if (block.drawnRightSide) {
            return;
        }
        let blockSize = this.blockSize;
        let countY = 0;
        let countZ = 0;
        let blockY, blockZ;
        if (type !== VOXEL_BUILD_TYPE.BRICKS) {
            for (let cy = 0; cy + y < this.rangeY[1]; cy++) {
                blockY = this.blocks[x][y + cy][z];
                if (blockY.active && !blockY.drawnRightSide && blockY.equals(block)
                    && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawRight(x, y + cy, z) : true)) {
                    countY++;
                    let tmpCountY = 0;
                    for (let cz = 0; cz + z < this.rangeZ[1]; cz++) {
                        blockZ = this.blocks[x][y + cy][z + cz];
                        if (blockZ.active && !blockZ.drawnRightSide && blockZ.equals(block)
                            && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawRight(x, y + cy, z + cz) : true)) {
                            tmpCountY++;
                        }
                        else {
                            break;
                        }
                    }
                    if (tmpCountY < countZ || countZ === 0) {
                        countZ = tmpCountY;
                    }
                    if (tmpCountY === 0 && countZ > countY) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            for (let x1 = 0; x1 < countY; x1++) {
                for (let y1 = 0; y1 < countZ; y1++) {
                    this.blocks[x][y + x1][z + y1].drawnRightSide = true;
                }
            }
        }
        else {
            countZ++;
            countY++;
            this.blocks[x][y][z].drawnRightSide = true;
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
    drawLeft(vertices, colors, x, y, z, type) {
        const block = this.blocks[x][y][z];
        // 如果这个方块面已经被其他方块面融合为一个面，就不再对这个方块做处理。
        if (block.drawnLeftSide) {
            return;
        }
        let countY = 0;
        let countZ = 0;
        let blockSize = this.blockSize;
        let ycy = 0, blockY, blockZ;
        if (type !== VOXEL_BUILD_TYPE.BRICKS) {
            for (let cy = 0; y + cy < this.rangeY[1]; cy++) {
                ycy = y + cy;
                blockY = this.blocks[x][ycy][z];
                if (blockY.active && !blockY.drawnLeftSide && blockY.equals(block)
                    && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawLeft(x, ycy, z) : true)) {
                    countY++;
                    let tmpCountY = 0;
                    for (let cz = 0; z + cz < this.rangeZ[1]; cz++) {
                        blockZ = this.blocks[x][ycy][z + cz];
                        if (blockZ.active && !blockZ.drawnLeftSide && blockZ.equals(block)
                            && (type === VOXEL_BUILD_TYPE.SURFACE ? this.checkDrawLeft(x, ycy, z + cz) : true)) {
                            tmpCountY++;
                        }
                        else {
                            break;
                        }
                    }
                    if (tmpCountY < countZ || countZ === 0) {
                        countZ = tmpCountY;
                    }
                    if (tmpCountY === 0 && countZ > countY) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            for (let x1 = 0; x1 < countY; x1++) {
                for (let y1 = 0; y1 < countZ; y1++) {
                    this.blocks[x][y + x1][z + y1].drawnLeftSide = true;
                }
            }
        }
        else {
            countZ++;
            countY++;
            this.blocks[x][y][z].drawnLeftSide = true;
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
    setColorData(colors, block) {
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
    rebuild(faceOptions = {}) {
        faceOptions = {
            ...DEFAULT_BUILD_OPTIONS,
            ...faceOptions
        };
        this.sides = 0;
        const vertices = [];
        const colors = [];
        if (!this.hasActiveBlocks()) {
            return {
                vertices,
                colors
            };
        }
        // 重置所有邻接关系
        this.resetDrawnSide();
        // 遍历所有方块，确定方块到底哪些需要画，需要画哪一个面。active表示是否是个空的格子
        this.loopBlocks((block, x, y, z) => {
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
        }, true);
        return {
            vertices,
            colors
        };
    }
}
VoxelChunk.buildType = VOXEL_BUILD_TYPE;

class VoxelGeometry extends BufferGeometry {
    constructor(chunk, faceOptions = DEFAULT_BUILD_OPTIONS) {
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

// 工具类，用于将图片转成体素
class VoxelImageConverter {
    static createChunk(imgData, width, height, depth) {
        const chunk = new VoxelChunk();
        chunk.create(width, height, depth);
        for (let h = 0; h < depth; h++) {
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    chunk.activateBlock(j, i, h, {
                        r: imgData[(height - 1 - i) * height * 4 + j * 4],
                        g: imgData[(height - 1 - i) * height * 4 + j * 4 + 1],
                        b: imgData[(height - 1 - i) * height * 4 + j * 4 + 2],
                        a: imgData[(height - 1 - i) * height * 4 + j * 4 + 3],
                    });
                }
            }
        }
        return chunk;
    }
}
VoxelImageConverter.canvas = document.createElement("canvas");
VoxelImageConverter.convert = (image, width, height, depth = 1, options) => {
    const canvas = VoxelImageConverter.canvas;
    canvas.width = width || image.naturalWidth;
    canvas.height = height || image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return false;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (options) {
        ctx.drawImage(image, options.x || 0, options.y || 0, options.width || image.naturalWidth, options.height || image.naturalHeight, 0, 0, canvas.width, canvas.height);
    }
    else {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return VoxelImageConverter.createChunk(data, canvas.width, canvas.height, depth);
};

class VoxelData {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.color = 0;
    }
    fromBuffer(buffer, i, subSample) {
        this.x = (subSample ? buffer[i] & 0xFF / 2 : buffer[i++] & 0xFF);
        this.y = (subSample ? buffer[i] & 0xFF / 2 : buffer[i++] & 0xFF);
        this.z = (subSample ? buffer[i] & 0xFF / 2 : buffer[i++] & 0xFF);
        this.color = buffer[i] & 0xFF;
    }
}

var VoxelColors = [
    0x00000000, 0xffffffff, 0xffccffff, 0xff99ffff, 0xff66ffff, 0xff33ffff, 0xff00ffff, 0xffffccff, 0xffccccff, 0xff99ccff, 0xff66ccff, 0xff33ccff, 0xff00ccff, 0xffff99ff, 0xffcc99ff, 0xff9999ff,
    0xff6699ff, 0xff3399ff, 0xff0099ff, 0xffff66ff, 0xffcc66ff, 0xff9966ff, 0xff6666ff, 0xff3366ff, 0xff0066ff, 0xffff33ff, 0xffcc33ff, 0xff9933ff, 0xff6633ff, 0xff3333ff, 0xff0033ff, 0xffff00ff,
    0xffcc00ff, 0xff9900ff, 0xff6600ff, 0xff3300ff, 0xff0000ff, 0xffffffcc, 0xffccffcc, 0xff99ffcc, 0xff66ffcc, 0xff33ffcc, 0xff00ffcc, 0xffffcccc, 0xffcccccc, 0xff99cccc, 0xff66cccc, 0xff33cccc,
    0xff00cccc, 0xffff99cc, 0xffcc99cc, 0xff9999cc, 0xff6699cc, 0xff3399cc, 0xff0099cc, 0xffff66cc, 0xffcc66cc, 0xff9966cc, 0xff6666cc, 0xff3366cc, 0xff0066cc, 0xffff33cc, 0xffcc33cc, 0xff9933cc,
    0xff6633cc, 0xff3333cc, 0xff0033cc, 0xffff00cc, 0xffcc00cc, 0xff9900cc, 0xff6600cc, 0xff3300cc, 0xff0000cc, 0xffffff99, 0xffccff99, 0xff99ff99, 0xff66ff99, 0xff33ff99, 0xff00ff99, 0xffffcc99,
    0xffcccc99, 0xff99cc99, 0xff66cc99, 0xff33cc99, 0xff00cc99, 0xffff9999, 0xffcc9999, 0xff999999, 0xff669999, 0xff339999, 0xff009999, 0xffff6699, 0xffcc6699, 0xff996699, 0xff666699, 0xff336699,
    0xff006699, 0xffff3399, 0xffcc3399, 0xff993399, 0xff663399, 0xff333399, 0xff003399, 0xffff0099, 0xffcc0099, 0xff990099, 0xff660099, 0xff330099, 0xff000099, 0xffffff66, 0xffccff66, 0xff99ff66,
    0xff66ff66, 0xff33ff66, 0xff00ff66, 0xffffcc66, 0xffcccc66, 0xff99cc66, 0xff66cc66, 0xff33cc66, 0xff00cc66, 0xffff9966, 0xffcc9966, 0xff999966, 0xff669966, 0xff339966, 0xff009966, 0xffff6666,
    0xffcc6666, 0xff996666, 0xff666666, 0xff336666, 0xff006666, 0xffff3366, 0xffcc3366, 0xff993366, 0xff663366, 0xff333366, 0xff003366, 0xffff0066, 0xffcc0066, 0xff990066, 0xff660066, 0xff330066,
    0xff000066, 0xffffff33, 0xffccff33, 0xff99ff33, 0xff66ff33, 0xff33ff33, 0xff00ff33, 0xffffcc33, 0xffcccc33, 0xff99cc33, 0xff66cc33, 0xff33cc33, 0xff00cc33, 0xffff9933, 0xffcc9933, 0xff999933,
    0xff669933, 0xff339933, 0xff009933, 0xffff6633, 0xffcc6633, 0xff996633, 0xff666633, 0xff336633, 0xff006633, 0xffff3333, 0xffcc3333, 0xff993333, 0xff663333, 0xff333333, 0xff003333, 0xffff0033,
    0xffcc0033, 0xff990033, 0xff660033, 0xff330033, 0xff000033, 0xffffff00, 0xffccff00, 0xff99ff00, 0xff66ff00, 0xff33ff00, 0xff00ff00, 0xffffcc00, 0xffcccc00, 0xff99cc00, 0xff66cc00, 0xff33cc00,
    0xff00cc00, 0xffff9900, 0xffcc9900, 0xff999900, 0xff669900, 0xff339900, 0xff009900, 0xffff6600, 0xffcc6600, 0xff996600, 0xff666600, 0xff336600, 0xff006600, 0xffff3300, 0xffcc3300, 0xff993300,
    0xff663300, 0xff333300, 0xff003300, 0xffff0000, 0xffcc0000, 0xff990000, 0xff660000, 0xff330000, 0xff0000ee, 0xff0000dd, 0xff0000bb, 0xff0000aa, 0xff000088, 0xff000077, 0xff000055, 0xff000044,
    0xff000022, 0xff000011, 0xff00ee00, 0xff00dd00, 0xff00bb00, 0xff00aa00, 0xff008800, 0xff007700, 0xff005500, 0xff004400, 0xff002200, 0xff001100, 0xffee0000, 0xffdd0000, 0xffbb0000, 0xffaa0000,
    0xff880000, 0xff770000, 0xff550000, 0xff440000, 0xff220000, 0xff110000, 0xffeeeeee, 0xffdddddd, 0xffbbbbbb, 0xffaaaaaa, 0xff888888, 0xff777777, 0xff555555, 0xff444444, 0xff222222, 0xff111111
];

class VoxelLoader {
    readInt(buffer, from) {
        return buffer[from] | (buffer[from + 1] << 8) | (buffer[from + 2] << 16) | (buffer[from + 3] << 24);
    }
    parse(arrayBuffer) {
        // var colors = [];
        let colors2 = undefined;
        let voxelData = [];
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
            }
            else if (id === "XYZI") {
                var numVoxels = Math.abs(this.readInt(buffer, i));
                i += 4;
                voxelData = new Array(numVoxels);
                for (var n = 0; n < voxelData.length; n++) {
                    voxelData[n] = new VoxelData();
                    voxelData[n].fromBuffer(buffer, i, subSample); // Read 4 bytes
                    i += 4;
                }
            }
            else if (id === "RGBA") {
                colors2 = new Array(256);
                for (var n = 0; n < 256; n++) {
                    var r = buffer[i++] & 0xFF;
                    var g = buffer[i++] & 0xFF;
                    var b = buffer[i++] & 0xFF;
                    var a = buffer[i++] & 0xFF;
                    colors2[n] = { 'r': r, 'g': g, 'b': b, 'a': a };
                }
            }
            else {
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
            }
            else {
                chunk.activateBlock(voxelData[n].x, voxelData[n].y, voxelData[n].z, colors2[Math.abs(voxelData[n].color - 1)]);
            }
        }
        return chunk;
    }
    load(url) {
        let fetcher = new Fetcher(url);
        return fetcher.on(Fetcher.PROGRESSING, (e) => {
            console.log(e, '=========');
        }).fetch().then((data) => {
            return data.arrayBuffer();
        }).then((buffer) => {
            return this.parse(buffer);
        });
    }
}

export { VoxelBlock, VoxelChunk, VoxelChunk as VoxelData, VoxelGeometry, VoxelImageConverter, VoxelLoader };
//# sourceMappingURL=Voxel.module.js.map
