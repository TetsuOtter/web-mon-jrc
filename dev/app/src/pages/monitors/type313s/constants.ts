import { hexToRgb } from "../../../canvas-renderer/utils/colorUtil";

import type { RgbColor } from "../../../canvas-renderer/utils/colorUtil";

export const DISPLAY_WIDTH = 800;
export const DISPLAY_HEIGHT = 600;

export const HEADER_HEIGHT = 40;
export const FOOTER_HEIGHT = 32;

export const FONT_SIZE_1X = 16;
export const FONT_SIZE_2X = 32;

export const COLORS = {
	BLACK: "#000",
	WHITE: "#fff",
	RED: "#f00",
	LIME: "#00FF46",
	BLUE: "#005FED",
	YELLOW: "#ff0",
	AQUA: "#00E1FF",
	MAGENTA: "#FF64FF",

	GRAY: "#96A0C8",
	CYAN: "#5096F0",
} as const satisfies Record<string, string>;
export type ColorName = keyof typeof COLORS;

export const RGB_COLORS = Object.fromEntries(
	Object.entries(COLORS).map(([name, hex]) => [name, hexToRgb(hex)])
) as Record<ColorName, RgbColor>;
