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
		createImageData: vi.fn(
			(w: number, h: number) =>
				({
					data: new Uint8ClampedArray(w * h * 4),
					width: w,
					height: h,
				}) as ImageData,
		),
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

// ResizeObserver のモック
if (!globalThis.ResizeObserver) {
	globalThis.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
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
	configurable: true,
});

// OffscreenCanvas のモック（グリフ描画などで使用）
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

// PIXI.js のモック（WebGL不要な環境でのテスト用）
vi.mock("pixi.js", () => {
	function makeContainer() {
		const self: Record<string, unknown> = {
			children: [] as unknown[],
			x: 0,
			y: 0,
			zIndex: 0,
			eventMode: "passive",
			hitArea: null,
			sortableChildren: false,
			destroyed: false,
			label: "",
			scale: { x: 1, y: 1, set: vi.fn() },
			addChild: vi.fn(function (this: Record<string, unknown>, child: unknown) {
				(this.children as unknown[]).push(child);
				return child;
			}),
			addChildAt: vi.fn(function (
				this: Record<string, unknown>,
				child: unknown,
				index: number,
			) {
				(this.children as unknown[]).splice(index, 0, child);
				return child;
			}),
			removeChild: vi.fn(function (
				this: Record<string, unknown>,
				child: unknown,
			) {
				const arr = this.children as unknown[];
				const idx = arr.indexOf(child);
				if (idx !== -1) arr.splice(idx, 1);
				return child;
			}),
			removeChildren: vi.fn(function (this: Record<string, unknown>) {
				const arr = this.children as unknown[];
				const removed = [...arr];
				arr.length = 0;
				return removed;
			}),
			sortChildren: vi.fn(),
			removeAllListeners: vi.fn(),
			on: vi.fn(),
			destroy: vi.fn(function (this: Record<string, unknown>) {
				this.destroyed = true;
				(this.children as unknown[]).length = 0;
			}),
		};
		return self;
	}

	class ContainerMock {
		children: unknown[] = [];
		x = 0;
		y = 0;
		zIndex = 0;
		eventMode = "passive";
		hitArea: unknown = null;
		sortableChildren = false;
		destroyed = false;
		label = "";
		scale = { x: 1, y: 1, set: vi.fn() };

		addChild(child: unknown) {
			this.children.push(child);
			return child;
		}
		addChildAt(child: unknown, index: number) {
			this.children.splice(index, 0, child);
			return child;
		}
		removeChild(child: unknown) {
			const idx = this.children.indexOf(child);
			if (idx !== -1) this.children.splice(idx, 1);
			return child;
		}
		removeChildren() {
			const removed = [...this.children];
			this.children = [];
			return removed;
		}
		sortChildren() {}
		removeAllListeners() {}
		on(_event: string, _handler: unknown) {}
		destroy() {
			this.destroyed = true;
			this.children = [];
		}
	}

	class ApplicationMock {
		stage = new ContainerMock();
		renderer = {
			resize: vi.fn(),
			background: { color: 0, alpha: 0 },
		};
		canvas = document.createElement("canvas");

		async init(_options: unknown) {
			this.stage.sortableChildren = true;
		}
		destroy() {}
	}

	class GraphicsMock {
		_calls: string[] = [];
		rect(..._args: unknown[]) {
			this._calls.push("rect");
			return this;
		}
		roundRect(..._args: unknown[]) {
			this._calls.push("roundRect");
			return this;
		}
		circle(..._args: unknown[]) {
			this._calls.push("circle");
			return this;
		}
		poly(..._args: unknown[]) {
			this._calls.push("poly");
			return this;
		}
		moveTo(..._args: unknown[]) {
			this._calls.push("moveTo");
			return this;
		}
		lineTo(..._args: unknown[]) {
			this._calls.push("lineTo");
			return this;
		}
		fill(..._args: unknown[]) {
			this._calls.push("fill");
			return this;
		}
		stroke(..._args: unknown[]) {
			this._calls.push("stroke");
			return this;
		}
		destroy() {}
		children: unknown[] = [];
		addChild(child: unknown) {
			this.children.push(child);
			return child;
		}
		removeChildren() {
			this.children = [];
		}
		destroyed = false;
	}

	class SpriteMock {
		x = 0;
		y = 0;
		width = 0;
		height = 0;
		scale = { x: 1, y: 1 };
		destroyed = false;
		children: unknown[] = [];
		destroy() {
			this.destroyed = true;
		}
	}

	class TextMock {
		x = 0;
		y = 0;
		width = 0;
		height = 0;
		destroyed = false;
		destroy() {
			this.destroyed = true;
		}
	}

	const TextureEmptyMock = {
		width: 0,
		height: 0,
		valid: false,
	};

	return {
		Application: ApplicationMock,
		Container: ContainerMock,
		Graphics: GraphicsMock,
		Sprite: SpriteMock,
		Text: TextMock,
		Texture: {
			EMPTY: TextureEmptyMock,
			from: vi.fn(() => ({ width: 4, height: 4, valid: true })),
		},
		Assets: {
			load: vi.fn(async () => ({ width: 100, height: 100 })),
		},
		Color: vi.fn((value: unknown) => ({
			toNumber: () => 0x000000,
			alpha: 1,
			_value: value,
		})),
		Rectangle: vi.fn(
			(x: number, y: number, w: number, h: number) => ({
				x,
				y,
				width: w,
				height: h,
			}),
		),
		FederatedPointerEvent: class {},
	};
});
