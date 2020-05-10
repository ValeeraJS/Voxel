import { RGBAColor } from '@valeera/mathx';
export default class VoxelBlock extends RGBAColor {
    active: boolean;
    drawnLeftSide: boolean;
    drawnTopSide: boolean;
    drawnFrontSide: boolean;
    drawnRightSide: boolean;
    drawnBackSide: boolean;
    drawnBottomSide: boolean;
    constructor(isActive: boolean, r: number, g: number, b: number, a: number);
    update(isActive: boolean, r: number, g: number, b: number, a: number): this;
    resetDrawnSide(): this;
}
