import { memo } from "react";

import { CanvasRenderer, CanvasRect } from "@web-mon-jrc/canvas-renderer";
import CanvasQuadrilateral from "@web-mon-jrc/canvas-renderer/objects/CanvasQuadrilateral";

export default memo(function QuadrilateralTest() {
	return (
		<div
			style={{ marginBottom: "30px" }}
			data-testid="quadrilateral-test"
		>
			<h2>Quadrilateral ストローク/フィル テスト</h2>
			<p>
				平行四辺形 (20,10)-(40,10)-(30,40)-(10,40) に 赤 4px
				ストローク・黒フィル
			</p>
			<CanvasRenderer
				width={50}
				height={50}
				fill="white"
				style={{ border: "1px solid black", marginRight: "30px" }}
			>
				{/* ストローク外側の確認用背景 */}
				<CanvasRect
					relX={0}
					relY={0}
					width={50}
					height={50}
					fillColor="white"
				/>
				{/* テスト対象：平行四辺形 */}
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
			</CanvasRenderer>

			{/* 比較用：CanvasRect でシンプルな四角形を描画 */}
			<div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
				<div>
					<CanvasRenderer
						width={50}
						height={50}
						fill="white"
						style={{ border: "1px solid black" }}
					>
						<CanvasRect
							relX={0}
							relY={0}
							width={50}
							height={50}
							fillColor="white"
						/>
						<CanvasRect
							relX={10}
							relY={10}
							width={30}
							height={30}
							fillColor="black"
							strokeColor="red"
							strokeWidth={2}
						/>
					</CanvasRenderer>
					<p style={{ fontSize: "12px", marginTop: "5px" }}>
						CanvasRect テスト
					</p>
				</div>
			</div>
			<div style={{ marginTop: "10px", fontSize: "12px" }}>
				<p>確認項目：</p>
				<ul>
					<li>(20,10), (40,10), (30,40), (10,40) が赤でストローク</li>
					<li>
						各頂点の外側方向が白であること（例：(20,10)なら(19,9), (19,10),
						(20,9)が白）
					</li>
					<li>ストロークの内側が黒でフィル</li>
				</ul>
			</div>
		</div>
	);
});
