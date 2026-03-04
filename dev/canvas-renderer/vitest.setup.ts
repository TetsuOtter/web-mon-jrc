import { vi } from "vitest";

/**
 * jsdom は Canvas API を実装していないため、最小限のモックを提供する
 */
function createCanvasContextMock() {
	return {
		clearRect: vi.fn(),
		fillRect: vi.fn(),
		strokeRect: vi.fn(),
		save: vi.fn(),
		restore: vi.fn(),
		beginPath: vi.fn(),
		rect: vi.fn(),
		clip: vi.fn(),
		scale: vi.fn(),
		translate: vi.fn(),
		drawImage: vi.fn(),
		fillText: vi.fn(),
		strokeText: vi.fn(),
		measureText: vi.fn(() => ({ width: 0 })),
		createImageData: vi.fn(() => ({
			data: new Uint8ClampedArray(4),
			width: 1,
			height: 1,
		})),
		putImageData: vi.fn(),
		getImageData: vi.fn(() => ({
			data: new Uint8ClampedArray(4),
			width: 1,
			height: 1,
		})),
		arc: vi.fn(),
		moveTo: vi.fn(),
		lineTo: vi.fn(),
		stroke: vi.fn(),
		fill: vi.fn(),
		closePath: vi.fn(),
		setTransform: vi.fn(),
		resetTransform: vi.fn(),
		fillStyle: "",
		strokeStyle: "",
		lineWidth: 1,
		font: "",
		textAlign: "left" as CanvasTextAlign,
		textBaseline: "alphabetic" as CanvasTextBaseline,
		globalAlpha: 1,
		imageSmoothingEnabled: true,
	};
}

// HTMLCanvasElement.getContext のモック
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
	value: vi.fn(function (this: HTMLCanvasElement, contextId: string) {
		if (contextId === "2d") {
			return createCanvasContextMock();
		}
		return null;
	}),
	writable: true,
});

// OffscreenCanvas のモック（テキスト描画などで使用）
if (!globalThis.OffscreenCanvas) {
	class OffscreenCanvasMock {
		width: number;
		height: number;
		constructor(width: number, height: number) {
			this.width = width;
			this.height = height;
		}
		getContext(_contextId: string) {
			return createCanvasContextMock();
		}
	}
	// @ts-expect-error mock implementation
	globalThis.OffscreenCanvas = OffscreenCanvasMock;
}
