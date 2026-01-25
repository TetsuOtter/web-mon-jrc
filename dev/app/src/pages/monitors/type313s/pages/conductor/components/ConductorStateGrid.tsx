import type { ReactNode } from "react";
import { memo, useMemo } from "react";

import CanvasObjectGroup from "../../../../../../canvas-renderer/objects/CanvasObjectGroup";
import {
	SAMPLE_TRAIN_FORMATION,
	LEFT as TRAIN_FORMATION_LEFT,
} from "../../../components/car-image/TrainFormationImage";
import { WIDTH as CAR_IMAGE_WIDTH } from "../../../components/car-image/constants";

const BASE_Y = 140;

export type GridRowDefinition = {
	renderLabel: (relX: number, relY: number) => ReactNode;
	renderCell: (relX: number, relY: number, carIndex: number) => ReactNode;
	rowHeight: number;
};
type ConductorStateGridProps = {
	offsetY?: number;
	rowDefinitionList: GridRowDefinition[];
};
export default memo<ConductorStateGridProps>(function ConductorStateGrid({
	offsetY = 0,
	rowDefinitionList,
}) {
	const height = useMemo(
		() => rowDefinitionList.reduce((sum, def) => sum + def.rowHeight, 0),
		[rowDefinitionList]
	);
	const width =
		TRAIN_FORMATION_LEFT + CAR_IMAGE_WIDTH * SAMPLE_TRAIN_FORMATION.length;

	const nodeList = useMemo(() => {
		const nodeList: ReactNode[] = [];
		let currentY = 0;
		for (const rowDef of rowDefinitionList) {
			nodeList.push(rowDef.renderLabel(0, currentY));

			SAMPLE_TRAIN_FORMATION.forEach((_, carIndex) => {
				const cellX = TRAIN_FORMATION_LEFT + CAR_IMAGE_WIDTH * carIndex;
				nodeList.push(rowDef.renderCell(cellX, currentY, carIndex));
			});

			currentY += rowDef.rowHeight;
		}
		return nodeList;
	}, [rowDefinitionList]);

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
