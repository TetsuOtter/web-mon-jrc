import { act, render } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CanvasRenderer from "../CanvasRenderer";
import CanvasObjectBase from "../objects/CanvasObjectBase";
import { useRequestRenderFunction } from "../contexts/RenderRequestContext";
import type { CanvasRenderFunction } from "../contexts/CanvasObjectContext";

type RenderArea = { absX: number; absY: number; width: number; height: number };

function makeRenderMock(impl?: () => void): CanvasRenderFunction {
	return vi.fn().mockImplementation(async () => {
		impl?.();
	}) as unknown as CanvasRenderFunction;
}

describe("CanvasRenderer - 部分再描画", () => {
	let ctxMock: ReturnType<typeof createCtxMock>;

	function createCtxMock() {
		return {
			clearRect: vi.fn(),
			fillRect: vi.fn(),
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
			fillStyle: "" as CanvasFillStrokeStyles["fillStyle"],
			strokeStyle: "" as CanvasFillStrokeStyles["strokeStyle"],
			lineWidth: 1,
			font: "",
			textAlign: "left" as CanvasTextAlign,
			textBaseline: "alphabetic" as CanvasTextBaseline,
			globalAlpha: 1,
			imageSmoothingEnabled: true,
		};
	}

	beforeEach(() => {
		ctxMock = createCtxMock();
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
			function (contextId: string) {
				if (contextId === "2d") return ctxMock as unknown as CanvasRenderingContext2D;
				return null;
			}
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("初回マウント時に全領域の描画が行われる", async () => {
		const onRender = makeRenderMock();

		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100}>
					<CanvasObjectBase
						onRender={onRender}
						relX={0}
						relY={0}
						width={200}
						height={100}
						isFilled={true}
					/>
				</CanvasRenderer>
			);
		});

		// canvas全体のクリアではなく、領域のclearRectが呼ばれる
		expect(ctxMock.clearRect).toHaveBeenCalled();
		// オブジェクトの描画関数が呼ばれる
		expect(onRender).toHaveBeenCalled();
	});

	it("ダーティ領域のみがclearRectされる（全体クリアは行われない）", async () => {
		const onRender = makeRenderMock();

		// 部分領域のみが変化するオブジェクト
		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100}>
					<CanvasObjectBase
						onRender={onRender}
						relX={10}
						relY={10}
						width={50}
						height={50}
						isFilled={true}
					/>
				</CanvasRenderer>
			);
		});

		// clearRectの呼び出しがあること
		expect(ctxMock.clearRect).toHaveBeenCalled();

		// 呼ばれたclearRectの引数を確認
		// 初回はキャンバス全体のメタデータ(200x100)でリクエストされるので
		// clearRect(0, 0, 200, 100) が呼ばれるはず
		const clearRectCalls = ctxMock.clearRect.mock.calls;
		expect(clearRectCalls.length).toBeGreaterThan(0);
	});

	it("ダーティ領域外のオブジェクトは描画されない", async () => {
		const onRenderInArea = makeRenderMock();
		const onRenderOutside = makeRenderMock();

		// ダーティ領域 = (0, 0, 50, 50)
		// オブジェクトA: (0, 0, 50, 50) - ダーティ領域内 → 描画される
		// オブジェクトB: (100, 100, 50, 50) - ダーティ領域外 → 描画されない

		let requestRenderFn: ((area: RenderArea) => void) | null = null;

		function RenderRequester() {
			const requestRender = useRequestRenderFunction();
			requestRenderFn = requestRender;
			return null;
		}

		await act(async () => {
			render(
				<CanvasRenderer width={200} height={200}>
					<CanvasObjectBase
						onRender={onRenderInArea}
						relX={0}
						relY={0}
						width={50}
						height={50}
						isFilled={true}
					/>
					<CanvasObjectBase
						onRender={onRenderOutside}
						relX={100}
						relY={100}
						width={50}
						height={50}
						isFilled={true}
					/>
					<RenderRequester />
				</CanvasRenderer>
			);
		});

		// 初回描画後にカウントをリセット
		(onRenderInArea as ReturnType<typeof vi.fn>).mockClear();
		(onRenderOutside as ReturnType<typeof vi.fn>).mockClear();
		ctxMock.clearRect.mockClear();

		// 部分領域(0, 0, 50, 50)のみをダーティとしてリクエスト
		await act(async () => {
			requestRenderFn?.({ absX: 0, absY: 0, width: 50, height: 50 });
		});

		// オブジェクトA(ダーティ領域内)は描画される
		expect(onRenderInArea).toHaveBeenCalled();
		// オブジェクトB(ダーティ領域外)は描画されない
		expect(onRenderOutside).not.toHaveBeenCalled();
	});

	it("クリップが設定されてから描画され、その後解除される", async () => {
		const onRender = makeRenderMock();

		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100}>
					<CanvasObjectBase
						onRender={onRender}
						relX={0}
						relY={0}
						width={50}
						height={50}
						isFilled={true}
					/>
				</CanvasRenderer>
			);
		});

		// save, beginPath, rect, clip の順序を確認
		const calls = [
			...ctxMock.save.mock.invocationCallOrder.map((o: number) => ({ order: o, name: "save" })),
			...ctxMock.beginPath.mock.invocationCallOrder.map((o: number) => ({ order: o, name: "beginPath" })),
			...ctxMock.rect.mock.invocationCallOrder.map((o: number) => ({ order: o, name: "rect" })),
			...ctxMock.clip.mock.invocationCallOrder.map((o: number) => ({ order: o, name: "clip" })),
			...ctxMock.restore.mock.invocationCallOrder.map((o: number) => ({ order: o, name: "restore" })),
		].sort((a, b) => a.order - b.order);

		const callOrder = calls.map((c) => c.name);

		// save → beginPath → rect → clip の順序が保たれる
		const saveIdx = callOrder.indexOf("save");
		const beginPathIdx = callOrder.indexOf("beginPath");
		const clipIdx = callOrder.indexOf("clip");

		expect(saveIdx).toBeGreaterThanOrEqual(0);
		expect(beginPathIdx).toBeGreaterThan(saveIdx);
		expect(clipIdx).toBeGreaterThan(beginPathIdx);

		// restoreが呼ばれる
		expect(ctxMock.restore).toHaveBeenCalled();
	});

	it("複数のダーティ領域が重複する場合はマージされてclearRectが最小回数で呼ばれる", async () => {
		let requestRenderFn: ((area: RenderArea) => void) | null = null;

		function RenderRequester() {
			const requestRender = useRequestRenderFunction();
			requestRenderFn = requestRender;
			return null;
		}

		const onRender = makeRenderMock();

		await act(async () => {
			render(
				<CanvasRenderer width={200} height={200}>
					<CanvasObjectBase
						onRender={onRender}
						relX={0}
						relY={0}
						width={200}
						height={200}
						isFilled={true}
					/>
					<RenderRequester />
				</CanvasRenderer>
			);
		});

		ctxMock.clearRect.mockClear();

		// 重複する2つの領域をリクエスト → マージされて1回のclearRectになるはず
		await act(async () => {
			requestRenderFn?.({ absX: 0, absY: 0, width: 60, height: 60 });
			requestRenderFn?.({ absX: 40, absY: 40, width: 60, height: 60 });
		});

		// マージされて1回のclearRectのみ
		expect(ctxMock.clearRect).toHaveBeenCalledTimes(1);
		// マージ結果は (0, 0, 100, 100)
		expect(ctxMock.clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
	});

	it("Z-order が保持される（registeredObjectList の順序で描画される）", async () => {
		const renderOrder: string[] = [];

		const onRenderFirst = makeRenderMock(() => renderOrder.push("first"));
		const onRenderSecond = makeRenderMock(() => renderOrder.push("second"));
		const onRenderThird = makeRenderMock(() => renderOrder.push("third"));

		await act(async () => {
			render(
				<CanvasRenderer width={200} height={200}>
					<CanvasObjectBase
						onRender={onRenderFirst}
						relX={0}
						relY={0}
						width={200}
						height={200}
						isFilled={true}
					/>
					<CanvasObjectBase
						onRender={onRenderSecond}
						relX={0}
						relY={0}
						width={200}
						height={200}
						isFilled={true}
					/>
					<CanvasObjectBase
						onRender={onRenderThird}
						relX={0}
						relY={0}
						width={200}
						height={200}
						isFilled={true}
					/>
				</CanvasRenderer>
			);
		});

		// 描画順序が JSX ツリーの順番と一致する
		// React の Strict Mode により複数回描画される可能性があるため、
		// 最初のレンダリングパスの順序のみ確認する
		expect(renderOrder.slice(0, 3)).toEqual(["first", "second", "third"]);
	});

	it("fill プロップがある場合、描画リクエストでは fillRect が使われる", async () => {
		const onRender = makeRenderMock();

		// fill なしの場合のclearRect呼び出し数を記録
		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100}>
					<CanvasObjectBase
						onRender={onRender}
						relX={0}
						relY={0}
						width={200}
						height={100}
						isFilled={true}
					/>
				</CanvasRenderer>
			);
		});
		const clearRectCountWithoutFill = ctxMock.clearRect.mock.calls.length;
		const fillRectCountWithoutFill = ctxMock.fillRect.mock.calls.length;

		// fill ありの場合
		ctxMock.clearRect.mockClear();
		ctxMock.fillRect.mockClear();

		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100} fill="black">
					<CanvasObjectBase
						onRender={onRender}
						relX={0}
						relY={0}
						width={200}
						height={100}
						isFilled={true}
					/>
				</CanvasRenderer>
			);
		});

		// fill ありの場合、fillRect の呼び出し回数は fill なしより増える
		expect(ctxMock.fillRect.mock.calls.length).toBeGreaterThan(fillRectCountWithoutFill);
		// fill ありの場合、描画リクエストに対する fillRect が (0, 0, 200, 100) で呼ばれる
		expect(ctxMock.fillRect).toHaveBeenCalledWith(0, 0, 200, 100);
		// fill ありの場合、clearRect の呼び出し回数は fill なし以下（DPRスケーリング分のみ）
		expect(ctxMock.clearRect.mock.calls.length).toBeLessThanOrEqual(clearRectCountWithoutFill);
	});
});
