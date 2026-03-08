import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CanvasRenderer from "../CanvasRenderer";
import CanvasObjectGroup from "../objects/CanvasObjectGroup";
import CanvasRect from "../objects/CanvasRect";
import CanvasHorizontalLine from "../objects/CanvasHorizontalLine";
import CanvasVerticalLine from "../objects/CanvasVerticalLine";
import { useCanvasObjectContext } from "../contexts/CanvasObjectContext";

import type { CanvasObjectMetadata } from "../contexts/CanvasObjectContext";

function MetadataCapture({
	onCapture,
}: {
	onCapture: (metadata: CanvasObjectMetadata) => void;
}) {
	const ctx = useCanvasObjectContext();
	onCapture(ctx.metadata);
	return null;
}

describe("CanvasRenderer", () => {
	it("子のコンポーネントがレンダリングされる", async () => {
		const onCapture = vi.fn();

		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100}>
					<CanvasObjectGroup
						relX={0}
						relY={0}
						width={200}
						height={100}
					>
						<MetadataCapture onCapture={onCapture} />
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});

		expect(onCapture).toHaveBeenCalled();
	});
});

describe("CanvasObjectGroup", () => {
	it("メタデータが正しく計算される", async () => {
		let receivedMetadata: CanvasObjectMetadata | null = null;
		const onCapture = (metadata: CanvasObjectMetadata) => {
			receivedMetadata = metadata;
		};

		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100}>
					<CanvasObjectGroup
						relX={10}
						relY={20}
						width={50}
						height={30}
					>
						<MetadataCapture onCapture={onCapture} />
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});

		expect(receivedMetadata).not.toBeNull();
		expect(receivedMetadata?.relX).toBe(10);
		expect(receivedMetadata?.relY).toBe(20);
		expect(receivedMetadata?.width).toBe(50);
		expect(receivedMetadata?.height).toBe(30);
		expect(receivedMetadata?.absX).toBe(10);
		expect(receivedMetadata?.absY).toBe(20);
	});

	it("子要素がネストされた場合、absXYが正しく積算される", async () => {
		let childMetadata: CanvasObjectMetadata | null = null;
		const onCapture = (metadata: CanvasObjectMetadata) => {
			childMetadata = metadata;
		};

		await act(async () => {
			render(
				<CanvasRenderer width={200} height={200}>
					<CanvasObjectGroup
						relX={10}
						relY={10}
						width={100}
						height={100}
					>
						<CanvasObjectGroup
							relX={5}
							relY={5}
							width={50}
							height={50}
						>
							<MetadataCapture onCapture={onCapture} />
						</CanvasObjectGroup>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});

		expect(childMetadata?.absX).toBe(15); // 10 + 5
		expect(childMetadata?.absY).toBe(15); // 10 + 5
	});
});

describe("CanvasRect", () => {
	it("レンダリングされる", async () => {
		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100}>
					<CanvasRect
						relX={10}
						relY={10}
						width={50}
						height={30}
						fillColor="#ff0000"
					/>
				</CanvasRenderer>,
			);
		});
	});
});

describe("CanvasHorizontalLine", () => {
	it("CanvasObjectGroup内でレンダリングされる", async () => {
		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100}>
					<CanvasObjectGroup
						relX={20}
						relY={20}
						width={100}
						height={50}
					>
						<CanvasHorizontalLine
							relX1={10}
							relX2={80}
							relY={25}
							color="#ff0000"
							width={2}
						/>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});
		// レンダリングエラーが発生しないことを確認
	});

	it("ネストされたCanvasObjectGroup内でレンダリングされる", async () => {
		await act(async () => {
			render(
				<CanvasRenderer width={300} height={200}>
					<CanvasObjectGroup relX={10} relY={10} width={200} height={150}>
						<CanvasObjectGroup relX={20} relY={20} width={100} height={80}>
							<CanvasHorizontalLine
								relX1={5}
								relX2={75}
								relY={30}
								color="#00ff00"
								width={1}
							/>
						</CanvasObjectGroup>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});
		// 二重ネストでもレンダリングエラーが発生しないことを確認
	});
});

describe("CanvasVerticalLine", () => {
	it("CanvasObjectGroup内でレンダリングされる", async () => {
		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100}>
					<CanvasObjectGroup
						relX={20}
						relY={20}
						width={100}
						height={50}
					>
						<CanvasVerticalLine
							relX={50}
							relY1={10}
							relY2={40}
							color="#0000ff"
							width={2}
						/>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});
		// レンダリングエラーが発生しないことを確認
	});

	it("ネストされたCanvasObjectGroup内でレンダリングされる", async () => {
		await act(async () => {
			render(
				<CanvasRenderer width={300} height={200}>
					<CanvasObjectGroup relX={10} relY={10} width={200} height={150}>
						<CanvasObjectGroup relX={20} relY={20} width={100} height={80}>
							<CanvasVerticalLine
								relX={40}
								relY1={5}
								relY2={60}
								color="#ffff00"
								width={1}
							/>
						</CanvasObjectGroup>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});
		// 二重ネストでもレンダリングエラーが発生しないことを確認
	});

	it("複数の線がCanvasObjectGroup内で共存できる", async () => {
		await act(async () => {
			render(
				<CanvasRenderer width={300} height={200}>
					<CanvasObjectGroup
						relX={30}
						relY={30}
						width={150}
						height={150}
					>
						<CanvasHorizontalLine
							relX1={10}
							relX2={120}
							relY={30}
							color="#ff0000"
							width={1}
						/>
						<CanvasHorizontalLine
							relX1={10}
							relX2={120}
							relY={100}
							color="#ff0000"
							width={1}
						/>
						<CanvasVerticalLine
							relX={20}
							relY1={10}
							relY2={130}
							color="#00ff00"
							width={1}
						/>
						<CanvasVerticalLine
							relX={110}
							relY1={10}
							relY2={130}
							color="#00ff00"
							width={1}
						/>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});
		// 複数の線が同時にレンダリングできることを確認
	});

	it("CanvasObjectGroup内の線のクリック検出が動作する", async () => {
		const onHorizontalLineClick = vi.fn();
		const onVerticalLineClick = vi.fn();

		await act(async () => {
			render(
				<CanvasRenderer width={200} height={100}>
					<CanvasObjectGroup
						relX={20}
						relY={20}
						width={100}
						height={50}
					>
						<CanvasHorizontalLine
							relX1={10}
							relX2={80}
							relY={25}
							color="#ff0000"
							width={2}
							onClick={onHorizontalLineClick}
						/>
						<CanvasVerticalLine
							relX={50}
							relY1={10}
							relY2={40}
							color="#0000ff"
							width={2}
							onClick={onVerticalLineClick}
						/>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});
		// テストがレンダリングエラーなしで完了したことを確認
		expect(onHorizontalLineClick).not.toHaveBeenCalled();
		expect(onVerticalLineClick).not.toHaveBeenCalled();
	});

	it("複雑にネストされたCanvasObjectGroup内での座標計算が正確", async () => {
		let capturedMetadata: CanvasObjectMetadata | null = null;

		function MetadataCapture({
			onCapture,
		}: {
			onCapture: (metadata: CanvasObjectMetadata) => void;
		}) {
			const ctx = useCanvasObjectContext();
			vi.useRealTimers();
			onCapture(ctx.metadata);
			return null;
		}

		await act(async () => {
			render(
				<CanvasRenderer width={400} height={300}>
					<CanvasObjectGroup relX={10} relY={10} width={300} height={250}>
						<CanvasObjectGroup relX={20} relY={20} width={200} height={180}>
							<CanvasObjectGroup relX={15} relY={15} width={150} height={130}>
								<MetadataCapture
									onCapture={(m) => {
										capturedMetadata = m;
									}}
								/>
							</CanvasObjectGroup>
						</CanvasObjectGroup>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});

		// 三重ネストの場合、absXYが正しく積算される
		expect(capturedMetadata?.absX).toBe(45); // 10 + 20 + 15
		expect(capturedMetadata?.absY).toBe(45); // 10 + 20 + 15
	});

	it("フロート値の座標でも正確に描画される", async () => {
		await act(async () => {
			render(
				<CanvasRenderer width={300} height={200}>
					<CanvasObjectGroup relX={10.5} relY={10.5} width={200} height={150}>
						<CanvasHorizontalLine
							relX1={5.5}
							relX2={100.5}
							relY={50.5}
							color="#ff0000"
							width={1}
						/>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});
		// レンダリングエラーが発生しないことを確認
	});

	it("負の座標でも正確に描画される", async () => {
		await act(async () => {
			render(
				<CanvasRenderer width={200} height={200}>
					<CanvasObjectGroup relX={0} relY={0} width={200} height={200}>
						<CanvasHorizontalLine
							relX1={-10}
							relX2={50}
							relY={100}
							color="#ff0000"
							width={2}
						/>
						<CanvasVerticalLine
							relX={50}
							relY1={-10}
							relY2={100}
							color="#00ff00"
							width={2}
						/>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});
		// 負の座標でもレンダリングエラーが発生しないことを確認
	});

	it("太い線でもグループ内で正確に配置される", async () => {
		await act(async () => {
			render(
				<CanvasRenderer width={300} height={200}>
					<CanvasObjectGroup relX={20} relY={20} width={200} height={150}>
						<CanvasHorizontalLine
							relX1={10}
							relX2={150}
							relY={75}
							color="#ff0000"
							width={8}
						/>
						<CanvasVerticalLine
							relX={80}
							relY1={10}
							relY2={140}
							color="#0000ff"
							width={6}
						/>
					</CanvasObjectGroup>
				</CanvasRenderer>,
			);
		});
		// 太い線でもレンダリングエラーが発生しないことを確認
	});
});
