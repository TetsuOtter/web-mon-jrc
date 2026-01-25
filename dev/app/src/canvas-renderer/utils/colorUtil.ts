export type RgbColor = {
	r: number;
	g: number;
	b: number;

	setToData(data: Uint8ClampedArray, offset: number): void;
};
export function hexToRgb(hex: string): RgbColor {
	const result6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result6) {
		return {
			r: parseInt(result6[1], 16),
			g: parseInt(result6[2], 16),
			b: parseInt(result6[3], 16),

			setToData,
		};
	}
	const result3 = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
	if (result3) {
		return {
			r: parseInt(result3[1] + result3[1], 16),
			g: parseInt(result3[2] + result3[2], 16),
			b: parseInt(result3[3] + result3[3], 16),

			setToData,
		};
	}
	return { r: 0, g: 0, b: 0, setToData };
}
export function rgbToHex(color: RgbColor): string {
	const rHex = color.r.toString(16).padStart(2, "0");
	const gHex = color.g.toString(16).padStart(2, "0");
	const bHex = color.b.toString(16).padStart(2, "0");
	return `#${rHex}${gHex}${bHex}`;
}

function setToData(
	this: RgbColor,
	data: Uint8ClampedArray,
	offset: number
): void {
	data[offset] = this.r;
	data[offset + 1] = this.g;
	data[offset + 2] = this.b;
	data[offset + 3] = 255;
}

export function setTransparentToData(data: Uint8ClampedArray, offset: number) {
	data[offset + 3] = 0;
}
