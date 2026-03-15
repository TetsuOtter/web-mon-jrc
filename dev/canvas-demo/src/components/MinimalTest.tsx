/**
 * 段階的デバッグ用の最小限テストページ。
 * CanvasRenderer / PIXI 初期化のフリーズ原因を特定するために使用する。
 */
import { memo, useEffect, useRef, useState } from "react";

import { CanvasRenderer, CanvasRect } from "@web-mon-jrc/canvas-renderer";
import CanvasQuadrilateral from "@web-mon-jrc/canvas-renderer/objects/CanvasQuadrilateral";

// ステップ0: 何もなし（PIXI なし）→ 動く？
// ステップ1: CanvasRenderer だけ（PIXI 初期化）→ フリーズ？
// ステップ2: CanvasRect あり
// ステップ3: CanvasQuadrilateral あり

type Step = 0 | 1 | 2 | 3;

export default memo(function MinimalTest() {
	const [step, setStep] = useState<Step>(0);
	const [log, setLog] = useState<string[]>(["start"]);
	const heartbeatRef = useRef<number>(0);

	const addLog = (msg: string) => {
		console.log("[MinimalTest]", msg);
		setLog((prev) => [...prev.slice(-20), msg]); // 最大20件
	};

	useEffect(() => {
		addLog("mounted");

		// ハートビート: 500msごとに動作確認
		let count = 0;
		const id = setInterval(() => {
			count++;
			heartbeatRef.current = count;
			console.log("[heartbeat]", count);
		}, 500);

		return () => {
			clearInterval(id);
			addLog("cleanup");
		};
	}, []);

	return (
		<div style={{ padding: "20px", fontFamily: "monospace" }}>
			<h2>MinimalTest - 段階的デバッグ (step={step})</h2>
			<div style={{ marginBottom: "10px" }}>
				{([0, 1, 2, 3] as Step[]).map((s) => (
					<button
						key={s}
						type="button"
						onClick={() => {
							addLog(`step → ${s}`);
							setStep(s);
						}}
						style={{
							marginRight: "8px",
							padding: "4px 12px",
							backgroundColor: step === s ? "#4caf50" : "#ddd",
							border: "1px solid #999",
							cursor: "pointer",
						}}
					>
						Step{s}
					</button>
				))}
			</div>
			<div style={{ marginBottom: "4px", fontSize: "12px" }}>
				Step0: PIXI なし | Step1: CanvasRenderer のみ | Step2: +CanvasRect |
				Step3: +CanvasQuadrilateral
			</div>

			{step >= 1 && (
				<div style={{ marginBottom: "10px" }}>
					<CanvasRendererTest step={step} addLog={addLog} />
				</div>
			)}

			<div
				style={{
					background: "#f0f0f0",
					padding: "8px",
					maxHeight: "250px",
					overflow: "auto",
					fontSize: "12px",
				}}
			>
				<strong>ログ (最新20件):</strong>
				{log.map((msg, i) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={i}>{msg}</div>
				))}
			</div>
		</div>
	);
});

/** CanvasRenderer を含む部分を別コンポーネントに分離して、マウント/アンマウントを制御 */
const CanvasRendererTest = memo(function CanvasRendererTest({
	step,
	addLog,
}: {
	step: Step;
	addLog: (msg: string) => void;
}) {
	useEffect(() => {
		addLog("CanvasRendererTest mounted");
		return () => addLog("CanvasRendererTest cleanup");
	}, [addLog]);

	return (
		<CanvasRenderer
			width={200}
			height={200}
			fill="white"
			style={{
				border: "2px solid black",
				width: "200px",
				height: "200px",
				display: "inline-flex",
			}}
		>
			{step >= 2 && (
				<CanvasRect relX={10} relY={10} width={80} height={80} fillColor="blue" />
			)}
			{step >= 3 && (
				<CanvasQuadrilateral
					xL1={20}
					yL1={10}
					xL2={10}
					yL2={40}
					xR1={40}
					yR1={10}
					xR2={30}
					yR2={40}
					strokeColor="red"
					fillColor="black"
					lineWidth={4}
				/>
			)}
		</CanvasRenderer>
	);
});
