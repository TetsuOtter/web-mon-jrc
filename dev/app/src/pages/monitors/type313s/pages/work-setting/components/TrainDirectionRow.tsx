import { memo, useCallback } from "react";

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

	return (
		<DirectionRowBase
			relY={relY}
			buttonText={toWide(`${index}編成`)}
			displayText={`編成${index}行先`}
			onButtonClick={handleClick}
		/>
	);
});
