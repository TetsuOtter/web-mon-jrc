import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CanvasRenderer from "../CanvasRenderer";
import CanvasObjectGroup from "../objects/CanvasObjectGroup";
import CanvasRect from "../objects/CanvasRect";
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
