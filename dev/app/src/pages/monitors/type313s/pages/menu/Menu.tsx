import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import Button, { SHADOW_WIDTH } from "../../components/Button";
import WithoutFooterPageFrame from "../../components/WithoutFooterPageFrame";
import { RGB_COLORS } from "../../constants";
import { ICONS } from "../../icons";
import { PAGE_MODES, PAGE_TYPES } from "../pageTypes";

import MenuButton from "./components/MenuButton";

const SLEEP_BUTTON_X = 648;
const SLEEP_BUTTON_Y = 464;
const SLEEP_BUTTON_WIDTH = 104;
const SLEEP_BUTTON_HEIGHT = 36;

export default memo(function Menu() {
	return (
		<WithoutFooterPageFrame mode={PAGE_MODES.MENU}>
			<MenuButton
				col={3}
				row={0}
				icon={ICONS.TABLE_OF_CONTENTS_1}
				text="目次画面"
				page={PAGE_TYPES.TABLE_OF_CONTENTS}
				mode={PAGE_MODES.TABLE_OF_CONTENTS}
			/>

			<MenuButton
				col={0}
				row={1}
				icon={ICONS.DRIVER}
				text="運転士"
				page={PAGE_TYPES.DRIVER_INFO}
				mode={PAGE_MODES.DRIVER}
			/>
			<MenuButton
				col={1}
				row={1}
				icon={ICONS.CONDUCTOR}
				text="車　掌"
				page={PAGE_TYPES.CONDUCTOR_INFO}
				mode={PAGE_MODES.CONDUCTOR}
			/>
			<MenuButton
				col={2}
				row={1}
				icon={ICONS.MAINTENANCE}
				text="検　修"
				page={PAGE_TYPES.MAINTENANCE_MENU}
				mode={PAGE_MODES.MAINTENANCE}
			/>
			<MenuButton
				col={3}
				row={1}
				icon={ICONS.EMBEDDED_MANUAL}
				text="応急ﾏﾆｭｱﾙ"
				// TODO: Implement Embedded Manual page
				page={PAGE_TYPES.MAINTENANCE_MENU}
				mode={PAGE_MODES.EMBEDDED_MANUAL}
			/>

			<MenuButton
				col={0}
				row={2}
				icon={ICONS.WORK_SETTING_1}
				text="運行設定"
				page={PAGE_TYPES.WORK_SETTING_TOP}
				mode={PAGE_MODES.WORK_SETTING}
			/>
			<MenuButton
				col={1}
				row={2}
				icon={ICONS.CAR_INFO_1}
				text="車両状態"
				page={PAGE_TYPES.SWITCHES}
				mode={PAGE_MODES.CAR_STATE}
			/>
			<MenuButton
				col={2}
				row={2}
				icon={ICONS.OCCUPANCY_RATE}
				text="乗車率"
				page={PAGE_TYPES.OCCUPANCY_RATE}
				mode={PAGE_MODES.OCCUPANCY_RATE}
			/>
			<MenuButton
				col={3}
				row={2}
				icon={ICONS.CORRECTION}
				text="補　正"
				page={PAGE_TYPES.CORRECTION_MENU}
				mode={PAGE_MODES.CORRECTION}
			/>

			<Button
				relX={SLEEP_BUTTON_X}
				relY={SLEEP_BUTTON_Y}
				width={SLEEP_BUTTON_WIDTH}
				height={SLEEP_BUTTON_HEIGHT}
				fillColor={RGB_COLORS.YELLOW}
				shadowWidth={SHADOW_WIDTH.SMALL}
				isShadowColored>
				<CanvasText
					relX={0}
					relY={0}
					align="center"
					verticalAlign="center"
					text="画面消去"
				/>
			</Button>
		</WithoutFooterPageFrame>
	);
});
