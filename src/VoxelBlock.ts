import IColor4 from './interfaces/IColor4';

export default class VoxelBlock implements IColor4 {
    r: number;
    g: number;
    b: number;
    a: number;
    active: boolean;
    drawnLeftSide: boolean;
    drawnTopSide: boolean;
    drawnFrontSide: boolean;
    drawnRightSide: boolean;
    drawnBackSide: boolean;
    drawnBottomSide: boolean;
    constructor(isActive: boolean, r: number, g: number, b: number, a: number) {
        this.update(isActive, r, g, b, a);
        this.resetDrawnSide();
    }

    colorEquals(block: IColor4) {
        return this.a === block.a && this.r === block.r && this.g === block.g && this.b === block.b;
    }

    update(isActive: boolean, r: number, g: number, b: number, a: number) {
        this.active = isActive;
        this.a = a;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    resetDrawnSide() {
        this.drawnLeftSide = false;
        this.drawnTopSide = false;
        this.drawnFrontSide = false;
        this.drawnRightSide = false;
        this.drawnBottomSide = false;
        this.drawnBackSide = false;
    }
}
