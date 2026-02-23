import { memo } from "react";

import { useAppSelector } from "../../../../../../store/hooks";
import { destinationSelector } from "../../../../../../store/monitors/type313s/type313sSelector";

import DirectionRowBase from "./DirectionRowBase";

type BulkDirectionRowProps = {
	readonly relY: number;
	readonly onClick: () => void;
};
export default memo<BulkDirectionRowProps>(function BulkDirectionRow({
	relY,
	onClick,
}) {
	const destination = useAppSelector(destinationSelector);
	return (
		<DirectionRowBase
			relY={relY}
			buttonText="一　括"
			displayText={destination ?? ""}
			onButtonClick={onClick}
		/>
	);
});
