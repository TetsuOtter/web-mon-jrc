import { memo, useCallback } from "react";

import { CanvasLine, CanvasText } from "../../../../canvas-renderer";
import { useCanvasObjectContext } from "../../../../canvas-renderer/contexts/CanvasObjectContext";
import CanvasQuadrilateral from "../../../../canvas-renderer/objects/CanvasQuadrilateral";
import { COLORS } from "../constants";

import type { ClickEventHandler } from "../../../../canvas-renderer/contexts/CanvasObjectContext";

const WIDTH = 84;
const HEIGHT = 32;

const BOTTOM_SHRINK = 7;

const TEXT_TOP = 8;

type FooterSWProps = {
	readonly col: number;
	readonly align: "left" | "right";
	readonly text: string;
	readonly isSelected: boolean;
	readonly onClick?: () => void;
};

/**
 * 四角形描画オブジェクト
 * 縁取りあり・なし対応
 * アンチエイリアスなしで鮮明に描画
 */
export default memo<FooterSWProps>(function FooterSW({
	col,
	align,
	text,
	isSelected,
	onClick,
}) {
	const parentObjectContext = useCanvasObjectContext();
	const x =
		align === "left"
			? col * WIDTH
			: parentObjectContext.metadata.width - (col + 1) * WIDTH;
	const handleClick: ClickEventHandler = useCallback(() => {
		if (onClick) {
			onClick();
			return true;
		} else {
			return false;
		}
	}, [onClick]);
	return (
		<CanvasQuadrilateral
			xL1={x}
			yL1={0}
			xL2={x + BOTTOM_SHRINK}
			yL2={HEIGHT - 1}
			xR1={x + WIDTH}
			yR1={0}
			xR2={x + WIDTH - BOTTOM_SHRINK}
			yR2={HEIGHT - 1}
			fillColor={isSelected ? COLORS.BLACK : COLORS.BLUE}
			strokeColor={COLORS.WHITE}
			lineWidth={1}
			onClick={onClick ? handleClick : undefined}>
			<CanvasText
				relX={0}
				relY={TEXT_TOP}
				align="center"
				text={text}
				fillColor={COLORS.WHITE}
			/>
			{isSelected && (
				<CanvasLine
					relX1={0}
					relY1={0}
					relX2={WIDTH}
					relY2={0}
					color={COLORS.BLACK}
					width={1}
				/>
			)}
			{isSelected && (
				<CanvasLine
					relX1={BOTTOM_SHRINK}
					relY1={HEIGHT - 2}
					relX2={WIDTH - BOTTOM_SHRINK}
					relY2={HEIGHT - 2}
					color={COLORS.WHITE}
					width={1}
				/>
			)}
		</CanvasQuadrilateral>
	);
});
