import {RGBAColor} from '@valeera/mathx';

export default class VoxelBlock extends RGBAColor {
    active: boolean;
    drawnLeftSide: boolean;
    drawnTopSide: boolean;
    drawnFrontSide: boolean;
    drawnRightSide: boolean;
    drawnBackSide: boolean;
    drawnBottomSide: boolean;
    constructor(isActive: boolean, r: number, g: number, b: number, a: number) {
        super(r, g, b, a);
        this.update(isActive, r, g, b, a);
        this.resetDrawnSide();
    }

    update(isActive: boolean, r: number, g: number, b: number, a: number): this {
        this.active = isActive;
        return this.set(r, g, b, a);
    }

    resetDrawnSide(): this {
        this.drawnLeftSide = false;
        this.drawnTopSide = false;
        this.drawnFrontSide = false;
        this.drawnRightSide = false;
        this.drawnBottomSide = false;
        this.drawnBackSide = false;

        return this;
    }
}
