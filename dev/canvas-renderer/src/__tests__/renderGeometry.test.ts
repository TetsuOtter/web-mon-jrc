import { describe, expect, it } from "vitest";
import { intersectsRects, mergeRenderAreas } from "../utils/renderGeometry";
import type { Rect } from "../utils/renderGeometry";

describe("intersectsRects", () => {
	it("重複している矩形は交差する", () => {
		const a: Rect = { absX: 0, absY: 0, width: 100, height: 100 };
		const b: Rect = { absX: 50, absY: 50, width: 100, height: 100 };
		expect(intersectsRects(a, b)).toBe(true);
	});

	it("一方が完全に他方に含まれる場合は交差する", () => {
		const outer: Rect = { absX: 0, absY: 0, width: 200, height: 200 };
		const inner: Rect = { absX: 50, absY: 50, width: 50, height: 50 };
		expect(intersectsRects(outer, inner)).toBe(true);
		expect(intersectsRects(inner, outer)).toBe(true);
	});

	it("完全に離れている矩形は交差しない", () => {
		const a: Rect = { absX: 0, absY: 0, width: 50, height: 50 };
		const b: Rect = { absX: 100, absY: 100, width: 50, height: 50 };
		expect(intersectsRects(a, b)).toBe(false);
	});

	it("X方向で離れている矩形は交差しない", () => {
		const a: Rect = { absX: 0, absY: 0, width: 50, height: 100 };
		const b: Rect = { absX: 100, absY: 0, width: 50, height: 100 };
		expect(intersectsRects(a, b)).toBe(false);
	});

	it("Y方向で離れている矩形は交差しない", () => {
		const a: Rect = { absX: 0, absY: 0, width: 100, height: 50 };
		const b: Rect = { absX: 0, absY: 100, width: 100, height: 50 };
		expect(intersectsRects(a, b)).toBe(false);
	});

	it("辺が接触しているだけの矩形は交差しない（境界値）", () => {
		const a: Rect = { absX: 0, absY: 0, width: 50, height: 50 };
		const b: Rect = { absX: 50, absY: 0, width: 50, height: 50 }; // 右辺が接触
		expect(intersectsRects(a, b)).toBe(false);
	});

	it("辺が1ピクセル重複する矩形は交差する", () => {
		const a: Rect = { absX: 0, absY: 0, width: 51, height: 50 };
		const b: Rect = { absX: 50, absY: 0, width: 50, height: 50 };
		expect(intersectsRects(a, b)).toBe(true);
	});

	it("同一の矩形は交差する", () => {
		const a: Rect = { absX: 10, absY: 20, width: 100, height: 50 };
		expect(intersectsRects(a, a)).toBe(true);
	});

	it("交差判定は対称である", () => {
		const a: Rect = { absX: 0, absY: 0, width: 100, height: 100 };
		const b: Rect = { absX: 80, absY: 80, width: 100, height: 100 };
		expect(intersectsRects(a, b)).toBe(intersectsRects(b, a));
	});
});

describe("mergeRenderAreas", () => {
	it("空のリストは空を返す", () => {
		expect(mergeRenderAreas([])).toEqual([]);
	});

	it("1要素のリストはそのまま返す", () => {
		const area: Rect = { absX: 0, absY: 0, width: 100, height: 100 };
		expect(mergeRenderAreas([area])).toEqual([area]);
	});

	it("重複する矩形は1つにマージされる", () => {
		const a: Rect = { absX: 0, absY: 0, width: 100, height: 100 };
		const b: Rect = { absX: 50, absY: 50, width: 100, height: 100 };
		const result = mergeRenderAreas([a, b]);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({ absX: 0, absY: 0, width: 150, height: 150 });
	});

	it("完全に重なる矩形は1つにマージされる", () => {
		const a: Rect = { absX: 0, absY: 0, width: 200, height: 200 };
		const b: Rect = { absX: 50, absY: 50, width: 50, height: 50 };
		const result = mergeRenderAreas([a, b]);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({ absX: 0, absY: 0, width: 200, height: 200 });
	});

	it("接触する矩形はマージされる", () => {
		const a: Rect = { absX: 0, absY: 0, width: 50, height: 50 };
		const b: Rect = { absX: 50, absY: 0, width: 50, height: 50 }; // 右辺が接触
		const result = mergeRenderAreas([a, b]);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({ absX: 0, absY: 0, width: 100, height: 50 });
	});

	it("離れた矩形はマージされない", () => {
		const a: Rect = { absX: 0, absY: 0, width: 50, height: 50 };
		const b: Rect = { absX: 100, absY: 100, width: 50, height: 50 };
		const result = mergeRenderAreas([a, b]);
		expect(result).toHaveLength(2);
	});

	it("同一の矩形が複数ある場合は1つにマージされる", () => {
		const a: Rect = { absX: 10, absY: 10, width: 50, height: 50 };
		const result = mergeRenderAreas([a, a, a]);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(a);
	});

	it("3つの重複矩形は1つにマージされる", () => {
		const areas: Rect[] = [
			{ absX: 0, absY: 0, width: 60, height: 60 },
			{ absX: 40, absY: 40, width: 60, height: 60 },
			{ absX: 80, absY: 80, width: 60, height: 60 },
		];
		const result = mergeRenderAreas(areas);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({ absX: 0, absY: 0, width: 140, height: 140 });
	});

	it("マージ後の矩形は元の矩形をすべて包含する", () => {
		const areas: Rect[] = [
			{ absX: 10, absY: 20, width: 50, height: 30 },
			{ absX: 30, absY: 10, width: 40, height: 80 },
		];
		const result = mergeRenderAreas(areas);
		// 結果の矩形がすべての元矩形を包含するか確認
		for (const merged of result) {
			// 少なくとも1つの元矩形が完全にマージ結果に含まれるはず
			// (マージされた場合)
			expect(merged.width).toBeGreaterThan(0);
			expect(merged.height).toBeGreaterThan(0);
		}
		// 元の矩形がすべてカバーされているか確認
		for (const original of areas) {
			const isCovered = result.some(
				(r) =>
					r.absX <= original.absX &&
					r.absY <= original.absY &&
					r.absX + r.width >= original.absX + original.width &&
					r.absY + r.height >= original.absY + original.height
			);
			expect(isCovered).toBe(true);
		}
	});
});
