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
    constructor(isActive: boolean, r: number, g: number, b: number, a: number);
    colorEquals(block: IColor4): boolean;
    update(isActive: boolean, r: number, g: number, b: number, a: number): void;
    resetDrawnSide(): void;
}
