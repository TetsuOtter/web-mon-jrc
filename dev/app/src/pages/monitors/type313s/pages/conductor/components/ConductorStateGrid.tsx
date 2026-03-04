import type { ReactNode } from "react";
import { memo, useMemo } from "react";

import CanvasObjectGroup from "@web-mon-jrc/canvas-renderer/objects/CanvasObjectGroup";
import { useAppSelector } from "../../../../../../store/hooks";
import { carCountSelector } from "../../../../../../store/monitors/type313s/type313sSelector";
import { LEFT as TRAIN_FORMATION_LEFT } from "../../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";

export const BASE_Y = 140;

export type GridRowDefinition = {
	renderLabel: (relX: number, relY: number) => ReactNode;
	renderCell: (relX: number, relY: number, carIndex: number) => ReactNode;
	rowHeight: number;
	marginTop?: number;
};
type ConductorStateGridProps = {
	offsetY?: number;
	rowDefinitionList: GridRowDefinition[];
};
export default memo<ConductorStateGridProps>(function ConductorStateGrid({
	offsetY = 0,
	rowDefinitionList,
}) {
	const carCount = useAppSelector(carCountSelector);
	const height = useMemo(
		() => rowDefinitionList.reduce((sum, def) => sum + def.rowHeight, 0),
		[rowDefinitionList]
	);
	const width = TRAIN_FORMATION_LEFT + CAR_IMAGE_WIDTH * carCount;

	const nodeList = useMemo(() => {
		const nodeList: ReactNode[] = [];
		let currentY = 0;
		for (const rowDef of rowDefinitionList) {
			nodeList.push(rowDef.renderLabel(0, currentY + (rowDef.marginTop ?? 0)));

			for (let carIndex = 0; carIndex < carCount; carIndex++) {
				const cellX = TRAIN_FORMATION_LEFT + CAR_IMAGE_WIDTH * carIndex;
				nodeList.push(
					rowDef.renderCell(cellX, currentY + (rowDef.marginTop ?? 0), carIndex)
				);
			}

			currentY += rowDef.rowHeight;
		}
		return nodeList;
	}, [rowDefinitionList, carCount]);

	return (
		<CanvasObjectGroup
			relX={0}
			relY={BASE_Y + offsetY}
			width={width}
			height={height}>
			{nodeList}
		</CanvasObjectGroup>
	);
});
