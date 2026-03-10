import { memo } from "react";

import styles from "./CarCompositionDiagram.module.css";

import type { Type313sCarInfoState } from "../../../store/monitors/type313s/type313sTypes";

type Props = {
	readonly carState: Type313sCarInfoState;
};

export default memo<Props>(function CarCompositionDiagram({ carState }) {
	return (
		<svg
			className={styles.diagram}
			viewBox="0 0 100 120"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* 車体 */}
			<rect
				x="15"
				y="35"
				width="70"
				height="45"
				fill="#e8e8e8"
				stroke="#333"
				strokeWidth="2"
			/>

			{/* carTypeを車体内に表示 */}
			<text
				x="50"
				y="62"
				textAnchor="middle"
				dominantBaseline="middle"
				className={styles.carTypeText}
				fontSize="10"
				fontWeight="bold"
				fill="#333"
			>
				{carState.carType}
			</text>

			{/* 運転台位置（三角形：左上角を潰す） */}
			{carState.cabState && (
				<polygon
					points={
						carState.cabState.side === "left"
							? "15,35 28,35 15,50"
							: "85,35 72,35 85,50"
					}
					fill="black"
				/>
			)}

			{/* パンタグラフ（菱形：屋根上に接する） */}
			{(carState.hasLeftPantograph || carState.hasRightPantograph) && (
				<>
					{carState.hasLeftPantograph && (
						<polygon
							points="32,25 37,30 32,35 27,30"
							fill="black"
						/>
					)}
					{carState.hasRightPantograph && (
						<polygon
							points="68,25 73,30 68,35 63,30"
							fill="black"
						/>
					)}
				</>
			)}

			{/* モーター台車（丸：車体下辺外側に接する） */}
			{carState.bogieState && (
				<>
					{carState.bogieState.left && (
						<>
							<circle
								cx="26"
								cy="85"
								r="3"
								fill="black"
							/>
							<circle
								cx="34"
								cy="85"
								r="3"
								fill="black"
							/>
						</>
					)}
					{carState.bogieState.right && (
						<>
							<circle
								cx="66"
								cy="85"
								r="3"
								fill="black"
							/>
							<circle
								cx="74"
								cy="85"
								r="3"
								fill="black"
							/>
						</>
					)}
				</>
			)}
		</svg>
	);
});
