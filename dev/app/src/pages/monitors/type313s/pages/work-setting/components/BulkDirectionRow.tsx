import { memo } from "react";

import DirectionRowBase from "./DirectionRowBase";

type BulkDirectionRowProps = {
	readonly relY: number;
	readonly onClick: () => void;
};
export default memo<BulkDirectionRowProps>(function BulkDirectionRow({
	relY,
	onClick,
}) {
	return (
		<DirectionRowBase
			relY={relY}
			buttonText="一　括"
			displayText="一括設定"
			onButtonClick={onClick}
		/>
	);
});
