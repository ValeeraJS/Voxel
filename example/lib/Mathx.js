(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.Mathx = {}));
}(this, (function (exports) { 'use strict';

	const ColorName = {
	    aliceblue: 0xF0F8FF,
	    antiquewhite: 0xFAEBD7,
	    aqua: 0x00FFFF,
	    aquamarine: 0x7FFFD4,
	    azure: 0xF0FFFF,
	    beige: 0xF5F5DC,
	    bisque: 0xFFE4C4,
	    black: 0x000000,
	    blanchedalmond: 0xFFEBCD,
	    blue: 0x0000FF,
	    blueviolet: 0x8A2BE2,
	    brown: 0xA52A2A,
	    burlywood: 0xDEB887,
	    cadetblue: 0x5F9EA0,
	    chartreuse: 0x7FFF00,
	    chocolate: 0xD2691E,
	    coral: 0xFF7F50,
	    cornflowerblue: 0x6495ED,
	    cornsilk: 0xFFF8DC,
	    crimson: 0xDC143C,
	    cyan: 0x00FFFF,
	    darkblue: 0x00008B,
	    darkcyan: 0x008B8B,
	    darkgoldenrod: 0xB8860B,
	    darkgray: 0xA9A9A9,
	    darkgreen: 0x006400,
	    darkgrey: 0xA9A9A9,
	    darkkhaki: 0xBDB76B,
	    darkmagenta: 0x8B008B,
	    darkolivegreen: 0x556B2F,
	    darkorange: 0xFF8C00,
	    darkorchid: 0x9932CC,
	    darkred: 0x8B0000,
	    darksalmon: 0xE9967A,
	    darkseagreen: 0x8FBC8F,
	    darkslateblue: 0x483D8B,
	    darkslategray: 0x2F4F4F,
	    darkslategrey: 0x2F4F4F,
	    darkturquoise: 0x00CED1,
	    darkviolet: 0x9400D3,
	    deeppink: 0xFF1493,
	    deepskyblue: 0x00BFFF,
	    dimgray: 0x696969,
	    dimgrey: 0x696969,
	    dodgerblue: 0x1E90FF,
	    firebrick: 0xB22222,
	    floralwhite: 0xFFFAF0,
	    forestgreen: 0x228B22,
	    fuchsia: 0xFF00FF,
	    gainsboro: 0xDCDCDC,
	    ghostwhite: 0xF8F8FF,
	    gold: 0xFFD700,
	    goldenrod: 0xDAA520,
	    gray: 0x808080,
	    green: 0x008000,
	    greenyellow: 0xADFF2F,
	    grey: 0x808080,
	    honeydew: 0xF0FFF0,
	    hotpink: 0xFF69B4,
	    indianred: 0xCD5C5C,
	    indigo: 0x4B0082,
	    ivory: 0xFFFFF0,
	    khaki: 0xF0E68C,
	    lavender: 0xE6E6FA,
	    lavenderblush: 0xFFF0F5,
	    lawngreen: 0x7CFC00,
	    lemonchiffon: 0xFFFACD,
	    lightblue: 0xADD8E6,
	    lightcoral: 0xF08080,
	    lightcyan: 0xE0FFFF,
	    lightgoldenrodyellow: 0xFAFAD2,
	    lightgray: 0xD3D3D3,
	    lightgreen: 0x90EE90,
	    lightgrey: 0xD3D3D3,
	    lightpink: 0xFFB6C1,
	    lightsalmon: 0xFFA07A,
	    lightseagreen: 0x20B2AA,
	    lightskyblue: 0x87CEFA,
	    lightslategray: 0x778899,
	    lightslategrey: 0x778899,
	    lightsteelblue: 0xB0C4DE,
	    lightyellow: 0xFFFFE0,
	    lime: 0x00FF00,
	    limegreen: 0x32CD32,
	    linen: 0xFAF0E6,
	    magenta: 0xFF00FF,
	    maroon: 0x800000,
	    mediumaquamarine: 0x66CDAA,
	    mediumblue: 0x0000CD,
	    mediumorchid: 0xBA55D3,
	    mediumpurple: 0x9370DB,
	    mediumseagreen: 0x3CB371,
	    mediumslateblue: 0x7B68EE,
	    mediumspringgreen: 0x00FA9A,
	    mediumturquoise: 0x48D1CC,
	    mediumvioletred: 0xC71585,
	    midnightblue: 0x191970,
	    mintcream: 0xF5FFFA,
	    mistyrose: 0xFFE4E1,
	    moccasin: 0xFFE4B5,
	    navajowhite: 0xFFDEAD,
	    navy: 0x000080,
	    oldlace: 0xFDF5E6,
	    olive: 0x808000,
	    olivedrab: 0x6B8E23,
	    orange: 0xFFA500,
	    orangered: 0xFF4500,
	    orchid: 0xDA70D6,
	    palegoldenrod: 0xEEE8AA,
	    palegreen: 0x98FB98,
	    paleturquoise: 0xAFEEEE,
	    palevioletred: 0xDB7093,
	    papayawhip: 0xFFEFD5,
	    peachpuff: 0xFFDAB9,
	    peru: 0xCD853F,
	    pink: 0xFFC0CB,
	    plum: 0xDDA0DD,
	    powderblue: 0xB0E0E6,
	    purple: 0x800080,
	    rebeccapurple: 0x663399,
	    red: 0xFF0000,
	    rosybrown: 0xBC8F8F,
	    royalblue: 0x4169E1,
	    saddlebrown: 0x8B4513,
	    salmon: 0xFA8072,
	    sandybrown: 0xF4A460,
	    seagreen: 0x2E8B57,
	    seashell: 0xFFF5EE,
	    sienna: 0xA0522D,
	    silver: 0xC0C0C0,
	    skyblue: 0x87CEEB,
	    slateblue: 0x6A5ACD,
	    slategray: 0x708090,
	    slategrey: 0x708090,
	    snow: 0xFFFAFA,
	    springgreen: 0x00FF7F,
	    steelblue: 0x4682B4,
	    tan: 0xD2B48C,
	    teal: 0x008080,
	    thistle: 0xD8BFD8,
	    tomato: 0xFF6347,
	    turquoise: 0x40E0D0,
	    violet: 0xEE82EE,
	    wheat: 0xF5DEB3,
	    white: 0xFFFFFF,
	    whitesmoke: 0xF5F5F5,
	    yellow: 0xFFFF00,
	    yellowgreen: 0x9ACD32
	};

	class RGBAColor {
	    constructor(r = 0, g = 0, b = 0, a = 1) {
	        this.r = r;
	        this.g = g;
	        this.b = b;
	        this.a = a;
	    }
	    static create(r = 0, g = 0, b = 0, a = 1) {
	        return new RGBAColor(r, g, b, a);
	    }
	    clone() {
	        return new RGBAColor(this.r, this.g, this.b, this.a);
	    }
	    equals(color) {
	        return color.r === this.r && color.g === this.g && color.b === this.b && color.a === this.a;
	    }
	    from(color) {
	        this.r = color.r;
	        this.g = color.g;
	        this.b = color.b;
	        this.a = color.a;
	        return this;
	    }
	    fromRGB(color) {
	        this.r = color.r;
	        this.g = color.g;
	        this.b = color.b;
	        this.a = 1;
	        return this;
	    }
	    fromArray(array, offset = 0) {
	        this.r = array[offset];
	        this.g = array[offset + 1];
	        this.b = array[offset + 2];
	        this.a = array[offset + 3];
	        return this;
	    }
	    fromHex(hex, a = 1) {
	        this.r = hex >> 16;
	        this.g = hex >> 8 & 255;
	        this.b = hex & 255;
	        this.a = a;
	        return this;
	    }
	    fromScalar(scalar, a = 1) {
	        this.r = scalar;
	        this.g = scalar;
	        this.b = scalar;
	        this.a = a;
	        return this;
	    }
	    fromString(str, a = 1) {
	        if (str in ColorName) {
	            return this.fromHex(ColorName[str]);
	        }
	        this.a = a;
	        return this;
	    }
	    set(r = 0, g = 0, b = 0, a = 1) {
	        this.r = r;
	        this.g = g;
	        this.b = b;
	        this.a = a;
	        return this;
	    }
	    toJson() {
	        return {
	            r: this.r,
	            g: this.g,
	            b: this.b,
	            a: this.a
	        };
	    }
	}

	class RGBColor {
	    constructor(r = 0, g = 0, b = 0) {
	        this.r = r;
	        this.g = g;
	        this.b = b;
	    }
	    static create(r = 0, g = 0, b = 0) {
	        return new RGBColor(r, g, b);
	    }
	    clone() {
	        return new RGBColor(this.r, this.g, this.b);
	    }
	    equals(color) {
	        return color.r === this.r && color.g === this.g && color.b === this.b;
	    }
	    from(color) {
	        this.r = color.r;
	        this.g = color.g;
	        this.b = color.b;
	        return this;
	    }
	    fromArray(array, offset = 0) {
	        this.r = array[offset];
	        this.g = array[offset + 1];
	        this.b = array[offset + 2];
	        return this;
	    }
	    fromHex(hex) {
	        this.r = hex >> 16;
	        this.g = (hex >> 8) & 255;
	        this.b = hex & 255;
	        return this;
	    }
	    fromScalar(scalar) {
	        this.r = scalar;
	        this.g = scalar;
	        this.b = scalar;
	        return this;
	    }
	    fromString(str) {
	        if (str in ColorName) {
	            return this.fromHex(ColorName[str]);
	        }
	        return this;
	    }
	    set(r = 0, g = 0, b = 0) {
	        this.r = r;
	        this.g = g;
	        this.b = b;
	        return this;
	    }
	    toJson() {
	        return {
	            b: this.b,
	            g: this.g,
	            r: this.r
	        };
	    }
	}

	/**
	 * @function clamp
	 * @desc 将目标值限定在指定区间内。假定min小于等于max才能得到正确的结果。
	 * @see clampSafe
	 * @param {number} val 目标值
	 * @param {number} min 最小值，必须小于等于max
	 * @param {number} max 最大值，必须大于等于min
	 * @returns {number} 限制之后的值
	 * @example Mathx.clamp(1, 0, 2); // 1;
	 * Mathx.clamp(-1, 0, 2); // 0;
	 * Mathx.clamp(3, 0, 2); // 2;
	 */
	var clamp = (val, min, max) => {
	    return Math.max(min, Math.min(max, val));
	};

	/**
	 * @function floorToZero
	 * @desc 以0为中心取整
	 * @param {number} num 数值
	 * @return {number} 取整之后的结果
	 * @example Mathx.roundToZero(0.8 ); // 0;
	 * Mathx.roundToZero(-0.8); // 0;
	 * Mathx.roundToZero(-1.1); // -1;
	 */
	var floorToZero = (num) => {
	    return num < 0 ? Math.ceil(num) : Math.floor(num);
	};

	let circle;
	/**
	 * @function clampCircle
	 * @desc 将目标值限定在指定周期区间内。假定min小于等于max才能得到正确的结果。
	 * @param {number} val 目标值
	 * @param {number} min 最小值，必须小于等于max
	 * @param {number} max 最大值，必须大于等于min
	 * @returns {number} 限制之后的值
	 * @example Mathx.clampCircle(3 * Math.PI, 0, 2 * Math.PI); // Math.PI;
	 * Mathx.clampCircle(2 * Math.PI, -Math.PI, Math.PI); // 0;
	 */
	var clampCircle = (val, min, max) => {
	    circle = max - min;
	    return floorToZero(min / circle) * circle + (val % circle);
	};

	/**
	 * @function clampSafe
	 * @desc 与clamp函数功能一样，将目标值限定在指定区间内。但此函数是安全的，不要求第二个参数必须小于第三个参数
	 * @see clamp
	 * @param {number} val 目标值
	 * @param {number} a 区间中一个最值
	 * @param {number} b 区间中另一个最值
	 * @returns {number} 限制之后的值
	 * @example Mathx.clamp(1, 0, 2); // 1;
	 * Mathx.clamp(1, 2, 0); // 1;
	 * Mathx.clamp(-1, 0, 2); // 0;
	 * Mathx.clamp(-1, 2, 0); // 0;
	 * Mathx.clamp(3, 0, 2); // 2;
	 * Mathx.clamp(3, 2, 0); // 2;
	 */
	var clampSafe = (val, a, b) => {
	    if (a > b) {
	        return Math.max(b, Math.min(a, val));
	    }
	    else if (b > a) {
	        return Math.max(a, Math.min(b, val));
	    }
	    return a;
	};

	const EPSILON = Math.pow(2, -52);

	/**
	 * @function closeTo
	 * @desc 判断一个数是否在另一个数的邻域内，通常用于检验浮点计算是否精度在EPSILON以内
	 * @param {number} val 需要判断的数值
	 * @param {number} target 目标数值
	 * @param {number} [epsilon = Number.EPSILON] 邻域半径
	 * @example Mathx.closeTo(0.1 + 0.2, 0.3); // true;
	 * Mathx.clamp(2, 3, 1); // true;
	 * Mathx.clamp(2, 3, 0.5); // false;
	 */
	var closeTo = (val, target, epsilon = EPSILON) => {
	    return Math.abs(val - target) <= epsilon;
	};

	let len = 0, sum = 0;
	/**
	 * @function sumArray
	 * @desc 求数组的和
	 * @see sum
	 * @param {number[]} arr
	 * @returns {number} 和
	 * @example Mathx.sumArray([1, 2, 3]); // 6;
	 */
	var sumArray = (arr) => {
	    sum = 0;
	    len = arr.length;
	    for (let i = 0; i < len; i++) {
	        sum += arr[i];
	    }
	    return sum;
	};

	/**
	 * @function sum
	 * @desc 求参数之和
	 * @see sumArray
	 * @param {number[]} arr
	 * @returns {number} 和
	 * @example Mathx.sumArray(1, 2, 3); // 6;
	 * Mathx.sumArray(1, 2, 3, 4, 5); // 15;
	 */
	var sum$1 = (...arr) => {
	    return sumArray(arr);
	};

	/**
	 * @class
	 * @classdesc 极坐标
	 * @implements {Mathx.IPolar}
	 * @name Mathx.Polar
	 * @desc 极坐标，遵守数学右手定则。规定逆时针方向为正方向。
	 * @param {number} [r=0] | 距离极点距离
	 * @param {number} [a=0] | 旋转弧度，规定0弧度为笛卡尔坐标系x轴方向
	 */
	class Polar {
	    /**
	     * @public
	     * @member {number} Mathx.Polar.prototype.a
	     * @desc 旋转弧度
	     * @default 0
	     */
	    /**
	     * @public
	     * @member {number} Mathx.Polar.prototype.r
	     * @desc 距离
	     * @default 0
	     */
	    constructor(r = 0, a = 0) {
	        this.r = r;
	        this.a = a;
	    }
	    /**
	     * @public
	     * @method create
	     * @memberof Mathx.Polar
	     * @desc 创建一个极坐标
	     * @param {number} [r=0] 距离
	     * @param {number} [a=0] 弧度
	     * @returns {Mathx.Polar} 新的极坐标实例
	     */
	    static create(r = 0, a = 0) {
	        return new Polar(r, a);
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.distanceTo
	     * @desc 求该坐标到另一个极坐标的欧几里得距离
	     * @param {Mathx.IPolar} p | 目标极坐标
	     * @returns {number} 欧几里得距离
	     */
	    distanceTo(p) {
	        return Math.sqrt(this.distanceToSquared(p));
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.distanceToManhattan
	     * @desc 求该坐标到另一个极坐标的曼哈顿距离
	     * @param {Mathx.IPolar} p | 目标极坐标
	     * @returns {number} 曼哈顿距离
	     */
	    distanceToManhattan({ r, a }) {
	        return Math.cos(a) * r - this.x() + Math.sin(a) * r - this.y();
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.distanceToSquared
	     * @desc 求该坐标到另一个极坐标的欧几里得距离平方
	     * @param {Mathx.IPolar} p | 目标极坐标
	     * @returns {number} 欧几里得距离平方
	     */
	    distanceToSquared({ r, a }) {
	        return this.r * this.r + r * r - 2 * r * this.r * Math.cos(a - this.a);
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.fromVector2
	     * @desc 将一个二维向量数据转化为自身的极坐标值
	     * @param {Mathx.IVector2} vector2 | 二维向量
	     * @returns {number} this
	     */
	    fromVector2({ x, y }) {
	        this.r = Math.sqrt(x * x + y * y);
	        this.a = Math.atan2(y, x);
	        return this;
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.lengthManhattan
	     * @desc 求自身离原点的曼哈顿距离
	     * @returns {number} 曼哈顿距离
	     */
	    lengthManhattan() {
	        return (Math.cos(this.a) + Math.sin(this.a)) * this.r;
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.set
	     * @desc 设置极坐标值
	     * @param {number} [r=0] 距离
	     * @param {number} [a=0] 弧度
	     * @returns {number} this
	     */
	    set(r = 0, a = 0) {
	        this.r = r;
	        this.a = a;
	        return this;
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.setA
	     * @desc 设置极坐标的弧度
	     * @param {number} [a=0] 角度
	     * @returns {number} this
	     */
	    setA(a = 0) {
	        this.a = a;
	        return this;
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.setR
	     * @desc 设置极坐标的弧度
	     * @param {number} [r=0] 距离
	     * @returns {number} this
	     */
	    setR(r = 0) {
	        this.r = r;
	        return this;
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.toJson
	     * @desc 将极坐标转化为纯json对象，纯数据
	     * @param {IPolar} [json] 被修改的json对象，如果不传则会新创建json对象。
	     * @returns {Mathx.IPolar} json
	     */
	    toJson(json = { a: 0, r: 0 }) {
	        json.r = this.r;
	        json.a = this.a;
	        return json;
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.toString
	     * @desc 将极坐标转化为字符串
	     * @returns {string} 形式为"(r, a)"的字符串
	     */
	    toString() {
	        return `(${this.r}, ${this.a})`;
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.toVector2Json
	     * @desc 将极坐标转化为二维向量的json形式，纯数据
	     * @param {IVector2} [json] 被修改的json对象，如果不传则会新创建json对象。
	     * @returns {IVector2} json
	     */
	    toVector2Json(vec2 = { x: 0, y: 0 }) {
	        vec2.x = this.x();
	        vec2.y = this.y();
	        return vec2;
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.x
	     * @desc 获取极坐标对应二维向量的x的值
	     * @returns {number} x
	     */
	    x() {
	        return Math.cos(this.a) * this.r;
	    }
	    /**
	     * @public
	     * @method Mathx.Polar.prototype.y
	     * @desc 获取极坐标对应二维向量的y的值
	     * @returns {number} y
	     */
	    y() {
	        return Math.sin(this.a) * this.r;
	    }
	}

	var rndFloat = (low, high) => {
	    return low + Math.random() * (high - low);
	};

	var rndFloatRange = (range) => {
	    return range * (0.5 - Math.random());
	};

	var rndInt = (low, high) => {
	    return low + Math.floor(Math.random() * (high - low + 1));
	};

	let len$1, x, y, c, s;
	/**
	 * @class
	 * @classdesc 二维向量
	 * @implements {Mathx.IVector2}
	 * @name Mathx.Vector2
	 * @desc 极坐标，遵守数学右手定则。规定逆时针方向为正方向。
	 * @param {number} [x=0] | 距离极点距离
	 * @param {number} [y=0] | 旋转弧度，规定0弧度为笛卡尔坐标系x轴方向
	 */
	class Vector2 {
	    constructor(x = 0, y = 0) {
	        this.x = x;
	        this.y = y;
	    }
	    static create(x = 0, y = 0) {
	        return new Vector2(x, y);
	    }
	    add(vec2) {
	        this.x += vec2.x;
	        this.y += vec2.y;
	        return this;
	    }
	    addScalar(num) {
	        this.x += num;
	        this.y += num;
	        return this;
	    }
	    addVectors(...vecArr) {
	        len$1 = vecArr.length;
	        for (let i = 0; i < len$1; i++) {
	            this.add(vecArr[i]);
	        }
	        return this;
	    }
	    angle() {
	        return Math.atan2(this.y, this.x);
	    }
	    ceil() {
	        this.x = Math.ceil(this.x);
	        this.y = Math.ceil(this.y);
	        return this;
	    }
	    clamp(min, max) {
	        this.x = clamp(this.x, min.x, max.x);
	        this.y = clamp(this.y, min.y, max.y);
	        return this;
	    }
	    clampSafe(min, max) {
	        this.x = clampSafe(this.x, min.x, max.x);
	        this.y = clampSafe(this.y, min.y, max.y);
	        return this;
	    }
	    clampLength(min, max) {
	        len$1 = this.length();
	        return this.divideScalar(len$1 || 1).multiplyScalar(clamp(len$1, min, max));
	    }
	    clampScalar(min, max) {
	        this.x = clamp(this.x, min, max);
	        this.y = clamp(this.y, min, max);
	        return this;
	    }
	    closeTo(vec2, epsilon = EPSILON) {
	        return this.distanceTo(vec2) <= epsilon;
	    }
	    closeToRect(vec2, epsilon = EPSILON) {
	        return closeTo(this.x, vec2.x, epsilon) && closeTo(this.y, vec2.y, epsilon);
	    }
	    closeToManhattan(vec2, epsilon = EPSILON) {
	        return this.distanceToManhattan(vec2) <= epsilon;
	    }
	    clone() {
	        return new Vector2(this.x, this.y);
	    }
	    cross(vec2) {
	        return this.x * vec2.y - this.y * vec2.x;
	    }
	    distanceTo(vec2) {
	        return Math.sqrt(this.distanceToSquared(vec2));
	    }
	    distanceToManhattan(vec2) {
	        return Math.abs(this.x - vec2.x) + Math.abs(this.y - vec2.y);
	    }
	    distanceToSquared(vec2) {
	        x = this.x - vec2.x;
	        y = this.y - vec2.y;
	        return x * x + y * y;
	    }
	    divide(v) {
	        this.x /= v.x;
	        this.y /= v.y;
	        return this;
	    }
	    divideScalar(scalar) {
	        return this.multiplyScalar(1 / scalar);
	    }
	    dot(vec2) {
	        return this.x * vec2.x + this.y * vec2.y;
	    }
	    equals(vec2) {
	        return vec2.x === this.x && vec2.y === this.y;
	    }
	    floor() {
	        this.x = Math.floor(this.x);
	        this.y = Math.floor(this.y);
	        return this;
	    }
	    from(vec2) {
	        this.x = vec2.x;
	        this.y = vec2.y;
	        return this;
	    }
	    fromArray(arr, index = 0) {
	        this.x = arr[index];
	        this.y = arr[index + 1];
	        return this;
	    }
	    fromPolar(p) {
	        this.x = Math.cos(p.a) * p.r;
	        this.y = Math.sin(p.a) * p.r;
	        return this;
	    }
	    fromScalar(value = 0) {
	        this.x = this.y = value;
	        return this;
	    }
	    length() {
	        return Math.sqrt(this.x * this.x + this.y * this.y);
	    }
	    lengthManhattan() {
	        return Math.abs(this.x) + Math.abs(this.y);
	    }
	    lengthSquared() {
	        return this.x * this.x + this.y * this.y;
	    }
	    lerp(vec2, alpha) {
	        this.x += (vec2.x - this.x) * alpha;
	        this.y += (vec2.y - this.y) * alpha;
	        return this;
	    }
	    max(vec2) {
	        this.x = Math.max(this.x, vec2.x);
	        this.y = Math.max(this.y, vec2.y);
	        return this;
	    }
	    min(vec2) {
	        this.x = Math.min(this.x, vec2.x);
	        this.y = Math.min(this.y, vec2.y);
	        return this;
	    }
	    minus(vec2) {
	        this.x -= vec2.x;
	        this.y -= vec2.y;
	        return this;
	    }
	    minusScalar(num) {
	        this.x -= num;
	        this.y -= num;
	        return this;
	    }
	    minusVectors(...vecArr) {
	        len$1 = vecArr.length;
	        for (let i = 0; i < len$1; i++) {
	            this.minus(vecArr[i]);
	        }
	        return this;
	    }
	    multiplyScalar(scalar) {
	        this.x *= scalar;
	        this.y *= scalar;
	        return this;
	    }
	    negate() {
	        this.x = -this.x;
	        this.y = -this.y;
	        return this;
	    }
	    normalize() {
	        return this.divideScalar(this.length() || 1);
	    }
	    rotate(angle, center = { x: 0, y: 0 }) {
	        c = Math.cos(angle);
	        s = Math.sin(angle);
	        x = this.x - center.x;
	        y = this.y - center.y;
	        this.x = x * c - y * s + center.x;
	        this.y = x * s + y * c + center.y;
	        return this;
	    }
	    round() {
	        this.x = Math.round(this.x);
	        this.y = Math.round(this.y);
	        return this;
	    }
	    floorToZero() {
	        this.x = floorToZero(this.x);
	        this.y = floorToZero(this.y);
	        return this;
	    }
	    set(x = 0, y = 0) {
	        this.x = x;
	        this.y = y;
	        return this;
	    }
	    setLength(length) {
	        return this.normalize().multiplyScalar(length);
	    }
	    setX(x = 0) {
	        this.x = x;
	        return this;
	    }
	    setY(y = 0) {
	        this.y = y;
	        return this;
	    }
	    toArray(arr = []) {
	        arr[0] = this.x;
	        arr[1] = this.y;
	        return arr;
	    }
	    toJson(json = { x: 0, y: 0 }) {
	        json.x = this.x;
	        json.y = this.y;
	        return json;
	    }
	    toPalorJson(p = { a: 0, r: 0 }) {
	        p.r = this.length();
	        p.a = this.angle();
	        return p;
	    }
	    toString() {
	        return `(${this.x}, ${this.y})`;
	    }
	}

	/**
	 * @classdesc 三维向量
	 * @class
	 * @name Mathx.Vector3
	 */
	class Vector3 {
	}

	exports.ColorName = ColorName;
	exports.Polar = Polar;
	exports.RGBAColor = RGBAColor;
	exports.RGBColor = RGBColor;
	exports.Vector2 = Vector2;
	exports.Vector3 = Vector3;
	exports.clamp = clamp;
	exports.clampCircle = clampCircle;
	exports.clampSafe = clampSafe;
	exports.closeTo = closeTo;
	exports.floorToZero = floorToZero;
	exports.rndFloat = rndFloat;
	exports.rndFloatRange = rndFloatRange;
	exports.rndInt = rndInt;
	exports.sum = sum$1;
	exports.sumArray = sumArray;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=Mathx.js.map
