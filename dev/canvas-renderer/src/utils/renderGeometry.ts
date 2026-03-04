/**
 * 矩形の座標・サイズを表す型
 */
export type Rect = {
	absX: number;
	absY: number;
	width: number;
	height: number;
};

/**
 * 2つの矩形が交差するかどうかを判定する（AABB交差判定）
 * 辺が接触している場合は交差しないとみなす
 */
export function intersectsRects(a: Rect, b: Rect): boolean {
	return !(
		a.absX + a.width <= b.absX ||
		b.absX + b.width <= a.absX ||
		a.absY + a.height <= b.absY ||
		b.absY + b.height <= a.absY
	);
}

/**
 * 複数の矩形リストをマージして重複を取り除いた最小セットを返す
 * 重複または接触している矩形同士を1つにまとめる
 */
export function mergeRenderAreas(areas: Rect[]): Rect[] {
	if (areas.length === 0) return [];
	if (areas.length === 1) return [areas[0]];

	// 重複・接触している矩形をマージするグリーディアルゴリズム
	const merged: Rect[] = [...areas];
	let changed = true;

	while (changed) {
		changed = false;
		for (let i = 0; i < merged.length; i++) {
			for (let j = i + 1; j < merged.length; j++) {
				const a = merged[i];
				const b = merged[j];

				// 接触または重複している場合はマージ
				if (
					a.absX + a.width >= b.absX &&
					b.absX + b.width >= a.absX &&
					a.absY + a.height >= b.absY &&
					b.absY + b.height >= a.absY
				) {
					const x1 = Math.min(a.absX, b.absX);
					const y1 = Math.min(a.absY, b.absY);
					const x2 = Math.max(a.absX + a.width, b.absX + b.width);
					const y2 = Math.max(a.absY + a.height, b.absY + b.height);

					merged[i] = {
						absX: x1,
						absY: y1,
						width: x2 - x1,
						height: y2 - y1,
					};
					merged.splice(j, 1);
					changed = true;
					break;
				}
			}
			if (changed) break;
		}
	}

	return merged;
}
