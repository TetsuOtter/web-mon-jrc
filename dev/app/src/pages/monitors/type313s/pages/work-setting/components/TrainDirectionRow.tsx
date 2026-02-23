import { memo, useCallback } from "react";

import { useAppSelector } from "../../../../../../store/hooks";
import { destinationSelector } from "../../../../../../store/monitors/type313s/type313sSelector";
import { toWide } from "../../../../../../utils/toWide";

import DirectionRowBase from "./DirectionRowBase";

type TrainDirectionRowProps = {
	readonly index: number;
	readonly relY: number;
	readonly onClick: (index: number) => void;
};
export default memo<TrainDirectionRowProps>(function TrainDirectionRow({
	index,
	relY,
	onClick,
}) {
	const handleClick = useCallback(() => onClick(index), [index, onClick]);
	const destination = useAppSelector(destinationSelector);

	return (
		<DirectionRowBase
			relY={relY}
			buttonText={toWide(`${index}編成`)}
			displayText={destination ?? ""}
			onButtonClick={handleClick}
		/>
	);
});
