import { memo, useState } from "react";

import {
	CanvasRenderer,
	CanvasText,
	CanvasRect,
	CanvasCircle,
	CanvasHorizontalLine,
	CanvasLine,
	CanvasOrderDemoItem,
	CanvasVerticalLine,
} from "@web-mon-jrc/canvas-renderer";

import BlinkingItem from "./components/BlinkingItem";
import QuadrilateralTest from "./components/QuadrilateralTest";

export default memo(function CanvasDemo() {
	const [clickedPoint, setClickedPoint] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [clickedObject, setClickedObject] = useState<string | null>(null);
	const [orderDemoOrder, setOrderDemoOrder] = useState<
		("rect" | "circle1" | "circle2")[]
	>(["rect", "circle1", "circle2"]);
	const [orderDemoClickedObject, setOrderDemoClickedObject] = useState<
		string | null
	>(null);
	const showLinePixelTest =
		typeof window !== "undefined" &&
		new URLSearchParams(window.location.search).get("linePixelTest") === "1";
	return (
		<div style={{ padding: "20px" }}>
			<h1>Canvas Renderer Demo</h1>

			<div style={{ marginBottom: "30px" }}>
				<h2>クリックイベント対応デモ</h2>
				<p>以下のオブジェクトをクリックしてみてください：</p>
				{clickedObject && (
					<div
						style={{
							marginBottom: "10px",
							padding: "10px",
							backgroundColor: "#f0f0f0",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<div>
							<p>
								クリック対象: <strong>{clickedObject}</strong>
							</p>
							{clickedPoint && (
								<p>
									クリック座標: ({clickedPoint.x}, {clickedPoint.y})
								</p>
							)}
						</div>
						<button
							type="button"
							onClick={() => {
								setClickedPoint(null);
								setClickedObject(null);
							}}
							style={{
								padding: "8px 16px",
								cursor: "pointer",
								backgroundColor: "#999",
								color: "#fff",
								border: "none",
								borderRadius: "4px",
							}}
						>
							閉じる
						</button>
					</div>
				)}
				<CanvasRenderer
					width={600}
					height={300}
				>
					{/* 背景（クリック判定：空白の領域をクリック時にリセット） */}
					<CanvasRect
						relX={0}
						relY={0}
						width={600}
						height={300}
						fillColor="transparent"
						onClick={() => {
							setClickedPoint(null);
							setClickedObject(null);
							return true;
						}}
					/>
					{/* クリック可能な赤い四角形 */}
					<CanvasRect
						relX={30}
						relY={30}
						width={120}
						height={80}
						fillColor="#ff6b6b"
						strokeColor="#000000"
						strokeWidth={2}
						onClick={(x, y) => {
							setClickedPoint({ x, y });
							setClickedObject("赤い四角形");
							return true;
						}}
					>
						{/* クリック可能なテキスト */}
						<CanvasText
							relX={30}
							relY={30}
							text="Click Me"
							fillColor="#ffffff"
							align="center"
							onClick={(x, y) => {
								setClickedPoint({ x, y });
								setClickedObject("テキスト（Click Me）");
								return true;
							}}
						/>
					</CanvasRect>

					{/* クリック可能な青い円 */}
					<CanvasCircle
						centerRelX={260}
						centerRelY={70}
						radius={35}
						fillColor="#4dabf7"
						strokeColor="#000000"
						strokeWidth={2}
						onClick={(x, y) => {
							setClickedPoint({ x, y });
							setClickedObject("青い円");
							return true;
						}}
					/>

					{/* クリック可能な緑の四角形（枠線のみ） */}
					<CanvasRect
						relX={380}
						relY={30}
						width={120}
						height={80}
						strokeColor="#51cf66"
						strokeWidth={3}
						onClick={(x, y) => {
							setClickedPoint({ x, y });
							setClickedObject("緑の四角形（枠線）");
							return true;
						}}
					/>

					{/* クリック可能な直線 */}
					<CanvasLine
						relX1={30}
						relY1={150}
						relX2={200}
						relY2={220}
						color="#ffa94d"
						width={4}
						onClick={(x, y) => {
							setClickedPoint({ x, y });
							setClickedObject("オレンジの直線");
							return true;
						}}
					/>

					{/* クリック可能な黄色の円 */}
					<CanvasCircle
						centerRelX={350}
						centerRelY={200}
						radius={40}
						fillColor="#ffd43b"
						strokeColor="#000000"
						strokeWidth={1}
						onClick={(x, y) => {
							setClickedPoint({ x, y });
							setClickedObject("黄色の円");
							return true;
						}}
					/>

					{/* クリック可能なテキスト "Text Button" */}
					<CanvasText
						relX={520}
						relY={150}
						text={"Text\nButton"}
						fillColor="#a78bfa"
						align="center"
						lineHeight={1.5}
						onClick={(x, y) => {
							setClickedPoint({ x, y });
							setClickedObject("テキストボタン（Text Button）");
							return true;
						}}
					/>
				</CanvasRenderer>
			</div>

			{showLinePixelTest && (
				<div
					style={{ marginBottom: "30px" }}
					data-testid="line-pixel-alignment-test"
				>
					<h2>CanvasLine ピクセル位置検証</h2>
					<p>E2Eで 1px 線の位置ずれを検証するための固定描画です。</p>
					<CanvasRenderer
						width={260}
						height={400}
						fill="#ffffff"
					>
						<CanvasVerticalLine
							relX={197}
							relY1={363}
							relY2={372}
							width={1}
							color="#000000"
						/>
						<CanvasHorizontalLine
							relX1={213}
							relX2={222}
							relY={341}
							width={1}
							color="#000000"
						/>
						<CanvasHorizontalLine
							relX1={194}
							relX2={241}
							relY={211}
							width={2}
							color="#000000"
						/>
					</CanvasRenderer>
				</div>
			)}

			<div style={{ marginBottom: "30px" }}>
				<CanvasRenderer
					width={800}
					height={400}
				>
					{/* 背景グリッド */}
					{/* eslint-disable react/no-array-index-key */}
					{Array.from({ length: 41 }).map((_, i) => (
						<CanvasHorizontalLine
							key={`grid-h-${i}`}
							relX1={0}
							relX2={800}
							relY={i * 10}
							color="#f0f0f0"
							width={1}
						/>
					))}
					{Array.from({ length: 81 }).map((_, i) => (
						<CanvasVerticalLine
							key={`grid-v-${i}`}
							relX={i * 10}
							relY1={0}
							relY2={400}
							color="#f0f0f0"
							width={1}
						/>
					))}
					{/* eslint-enable react/no-array-index-key */}

					{/* テキスト */}
					<CanvasText
						relX={20}
						relY={20}
						text="Canvas Text Demo"
						fillColor="#000000"
					/>

					{/* 塗りつぶしなし四角形 */}
					<CanvasRect
						relX={20}
						relY={60}
						width={100}
						height={80}
						strokeColor="#ff0000"
						strokeWidth={2}
					/>

					{/* 塗りつぶしあり四角形 */}
					<CanvasRect
						relX={140}
						relY={60}
						width={100}
						height={80}
						fillColor="#00ff00"
						strokeColor="#000000"
						strokeWidth={1}
					/>

					{/* 塗りつぶしなし円 */}
					<CanvasCircle
						centerRelX={310}
						centerRelY={100}
						radius={40}
						strokeColor="#0000ff"
						strokeWidth={2}
					/>

					{/* 塗りつぶしあり円 */}
					<CanvasCircle
						centerRelX={430}
						centerRelY={100}
						radius={40}
						fillColor="#ffff00"
						strokeColor="#000000"
						strokeWidth={1}
					/>

					{/* 直線 */}
					<CanvasLine
						relX1={550}
						relY1={60}
						relX2={650}
						relY2={140}
						color="#ff00ff"
						width={3}
					/>

					{/* 改行対応テキスト */}
					<CanvasText
						relX={20}
						relY={180}
						text="複数行テキスト{'\n'}です"
						fillColor="#333333"
						lineHeight={1.5}
					/>

					{/* 最大幅指定テキスト */}
					<CanvasText
						relX={250}
						relY={180}
						text="これは長いテキストです。最大幅を指定して自動折り返しされます。"
						fillColor="#333333"
						maxWidthPx={150}
						lineHeight={1.5}
					/>

					{/* グラデーション的な効果（複数円） */}
					{/* eslint-disable react/no-array-index-key */}
					{Array.from({ length: 5 }).map((_, i) => (
						<CanvasCircle
							key={`circle-${i}`}
							centerRelX={600}
							centerRelY={250}
							radius={40 - i * 8}
							fillColor={`rgba(${i * 50}, ${200 - i * 40}, 255, ${0.3 + i * 0.15})`}
						/>
					))}
					{/* eslint-enable react/no-array-index-key */}

					{/* 複合描画: 四角形 + テキスト */}
					<CanvasRect
						relX={20}
						relY={300}
						width={150}
						height={80}
						fillColor="#e8e8e8"
						strokeColor="#333333"
						strokeWidth={2}
					/>
					<CanvasText
						relX={95}
						relY={330}
						text="Button"
						fillColor="#000000"
						align="center"
					/>
				</CanvasRenderer>
			</div>

			<div style={{ marginBottom: "30px" }}>
				<h2>アンチエイリアスなし（鮮明）な描画テスト</h2>
				<p>
					以下のキャンバスは整数座標に丸めて描画されており、ピクセルパーフェクトな表示になっています。
				</p>
				<CanvasRenderer
					width={400}
					height={300}
				>
					{/* 細い直線（1px） */}
					<CanvasHorizontalLine
						relX1={10}
						relX2={100}
						relY={10}
						color="#000000"
						width={1}
					/>

					{/* 3px直線 */}
					<CanvasHorizontalLine
						relX1={10}
						relX2={100}
						relY={30}
						color="#ff0000"
						width={3}
					/>

					{/* 2px縁取り四角形 */}
					<CanvasRect
						relX={10}
						relY={60}
						width={80}
						height={60}
						strokeColor="#0000ff"
						strokeWidth={2}
					/>

					{/* テキスト */}
					<CanvasText
						relX={10}
						relY={140}
						text="ピクセルパーフェクトX1"
						fillColor="#000000"
					/>
					<CanvasText
						relX={10}
						relY={156}
						text="ピクセルパーフェクトX1.5"
						fillColor="#000000"
						scaleY={1.5}
					/>
					<CanvasText
						relX={10}
						relY={180}
						text="ピクセルパーフェクトX2"
						fillColor="#000000"
						scaleX={2}
						scaleY={2}
					/>
				</CanvasRenderer>
			</div>

			<div style={{ marginBottom: "30px" }}>
				<h2>描画順序変更デモ</h2>
				<p>
					ボタンで図形の描画順序を変更すると、Z-order（重なり順）が変わります：
				</p>
				<div style={{ marginBottom: "15px" }}>
					<button
						type="button"
						onClick={() => {
							const newOrder = [...orderDemoOrder];
							[newOrder[0], newOrder[1]] = [newOrder[1], newOrder[0]];
							setOrderDemoOrder(newOrder);
						}}
						style={{
							padding: "8px 16px",
							marginRight: "10px",
							cursor: "pointer",
							backgroundColor: "#4CAF50",
							color: "#fff",
							border: "none",
							borderRadius: "4px",
						}}
					>
						順序を入れ替える (0 ↔ 1)
					</button>
					<button
						type="button"
						onClick={() => {
							const newOrder = [...orderDemoOrder];
							[newOrder[1], newOrder[2]] = [newOrder[2], newOrder[1]];
							setOrderDemoOrder(newOrder);
						}}
						style={{
							padding: "8px 16px",
							marginRight: "10px",
							cursor: "pointer",
							backgroundColor: "#4CAF50",
							color: "#fff",
							border: "none",
							borderRadius: "4px",
						}}
					>
						順序を入れ替える (1 ↔ 2)
					</button>
					<button
						type="button"
						onClick={() => setOrderDemoOrder(["rect", "circle1", "circle2"])}
						style={{
							padding: "8px 16px",
							cursor: "pointer",
							backgroundColor: "#999",
							color: "#fff",
							border: "none",
							borderRadius: "4px",
						}}
					>
						リセット
					</button>
				</div>
				<div
					style={{
						marginBottom: "10px",
						padding: "10px",
						backgroundColor: "#f0f0f0",
						borderRadius: "4px",
					}}
				>
					<p>
						<strong>現在の描画順序:</strong> {orderDemoOrder.join(" → ")}
					</p>
					<p style={{ fontSize: "12px", color: "#666" }}>
						後に描画されたオブジェクトが手前に表示されます。
						<br />
						重なっている部分をクリックすると、手前のオブジェクトがハンドラーを受け取ります。
					</p>
				</div>
				<CanvasRenderer
					width={600}
					height={300}
				>
					{/* 背景 */}
					<CanvasRect
						relX={0}
						relY={0}
						width={600}
						height={300}
						fillColor="#f5f5f5"
					/>

					{orderDemoOrder.map((itemKey) => {
						if (itemKey === "rect") {
							return (
								<CanvasOrderDemoItem
									key="rect"
									relX={120}
									relY={100}
									width={120}
									height={100}
									label="Rectangle"
									color="#ff6b6b"
									onClick={() => {
										setOrderDemoClickedObject("赤い四角形 (Rectangle)");
										return true;
									}}
								/>
							);
						}
						if (itemKey === "circle1") {
							return (
								<CanvasOrderDemoItem
									key="circle1"
									relX={220}
									relY={80}
									width={140}
									height={140}
									label="Circle1"
									color="#4ecdc4"
									onClick={() => {
										setOrderDemoClickedObject("青緑の円 (Circle1)");
										return true;
									}}
								/>
							);
						}
						if (itemKey === "circle2") {
							return (
								<CanvasOrderDemoItem
									key="circle2"
									relX={320}
									relY={100}
									width={120}
									height={100}
									label="Circle2"
									color="#ffd93d"
									onClick={() => {
										setOrderDemoClickedObject("黄色の円 (Circle2)");
										return true;
									}}
								/>
							);
						}
						return null;
					})}

					{/* 説明テキスト */}
					<CanvasText
						relX={10}
						relY={10}
						text="図形をクリックして描画順序を確認してください"
						fillColor="#333333"
					/>
				</CanvasRenderer>
				{orderDemoClickedObject && (
					<div
						style={{
							marginTop: "10px",
							padding: "10px",
							backgroundColor: "#e8f5e9",
							borderRadius: "4px",
						}}
					>
						<p>
							クリック対象: <strong>{orderDemoClickedObject}</strong>
						</p>
						<button
							type="button"
							onClick={() => setOrderDemoClickedObject(null)}
							style={{
								padding: "6px 12px",
								cursor: "pointer",
								backgroundColor: "#999",
								color: "#fff",
								border: "none",
								borderRadius: "4px",
							}}
						>
							閉じる
						</button>
					</div>
				)}
			</div>

			<div style={{ marginBottom: "30px" }}>
				<h2>部分再描画デモ（点滅）</h2>
				<p>
					各図形は異なる間隔で独立して点滅します。点滅のたびに
					<strong>その図形の領域のみ</strong>が
					クリア＋再描画され、背景や他の静的オブジェクトは再描画されません。
				</p>
				<CanvasRenderer
					width={600}
					height={220}
					fill="#f8f9fa"
				>
					{/* 静的オブジェクト（点滅図形が再描画されても影響を受けない） */}
					<CanvasText
						relX={10}
						relY={18}
						text="← 静的オブジェクト（点滅による再描画の影響を受けません）"
						fillColor="#868e96"
					/>
					<CanvasCircle
						centerRelX={555}
						centerRelY={110}
						radius={45}
						fillColor="#dee2e6"
						strokeColor="#adb5bd"
						strokeWidth={1}
					/>
					<CanvasText
						relX={555}
						relY={110}
						text={"静的\n円"}
						fillColor="#868e96"
						align="center"
						lineHeight={1.4}
					/>
					<CanvasHorizontalLine
						relX1={10}
						relX2={590}
						relY={155}
						color="#dee2e6"
						width={1}
					/>
					<CanvasText
						relX={10}
						relY={174}
						text="↑ 静的な区切り線"
						fillColor="#adb5bd"
					/>
					<CanvasText
						relX={10}
						relY={196}
						text="点滅中も常に表示されます"
						fillColor="#adb5bd"
					/>

					{/* 点滅する図形（各自の領域のみ部分再描画） */}
					<BlinkingItem
						relX={30}
						relY={45}
						width={130}
						height={90}
						intervalMs={400}
						fillColor="#ff8787"
						strokeColor="#fa5252"
						label={"速い点滅\n400ms"}
					/>
					<BlinkingItem
						relX={210}
						relY={45}
						width={130}
						height={90}
						intervalMs={900}
						fillColor="#74c0fc"
						strokeColor="#339af0"
						label={"中程度\n900ms"}
					/>
					<BlinkingItem
						relX={390}
						relY={45}
						width={130}
						height={90}
						intervalMs={1600}
						fillColor="#8ce99a"
						strokeColor="#40c057"
						label={"遅い点滅\n1600ms"}
					/>
				</CanvasRenderer>
				<p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
					DevTools の Rendering → Paint flashing
					を有効にすると、点滅図形の領域のみが
					再描画されていることを視覚的に確認できます。
				</p>
			</div>

			<QuadrilateralTest />
		</div>
	);
});
