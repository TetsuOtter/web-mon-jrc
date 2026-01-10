import { memo } from "react";

import { CanvasText } from "../../../../../canvas-renderer";
import Button, { SHADOW_WIDTH } from "../../components/Button";
import WithoutFooterPageFrame from "../../components/WithoutFooterPageFrame";
import { RGB_COLORS } from "../../constants";
import { ICONS } from "../../icons";
import { PAGE_TYPES } from "../pageTypes";
import { usePageNavigationTo } from "../usePageNavigation";

import MenuButton from "./components/MenuButton";

const SLEEP_BUTTON_X = 648;
const SLEEP_BUTTON_Y = 464;
const SLEEP_BUTTON_WIDTH = 104;
const SLEEP_BUTTON_HEIGHT = 36;

export default memo(function Menu() {
	return (
		<WithoutFooterPageFrame>
			<MenuButton
				col={3}
				row={0}
				icon={ICONS.TABLE_OF_CONTENTS_1}
				text="目次画面"
				onClick={usePageNavigationTo(PAGE_TYPES.TABLE_OF_CONTENTS)}
			/>

			<MenuButton
				col={0}
				row={1}
				icon={ICONS.DRIVER}
				text="運転士"
				onClick={usePageNavigationTo(PAGE_TYPES["DRIVER-INFO"])}
			/>
			<MenuButton
				col={1}
				row={1}
				icon={ICONS.CONDUCTOR}
				text="車　掌"
				onClick={usePageNavigationTo(PAGE_TYPES["CONDUCTOR-INFO"])}
			/>
			<MenuButton
				col={2}
				row={1}
				icon={ICONS.MAINTENANCE}
				text="検　修"
				onClick={usePageNavigationTo(PAGE_TYPES["MAINTENANCE-MENU"])}
			/>
			<MenuButton
				col={3}
				row={1}
				icon={ICONS.EMBEDDED_MANUAL}
				text="応急ﾏﾆｭｱﾙ"
				// TODO: Implement Embedded Manual page
				onClick={usePageNavigationTo(PAGE_TYPES["MAINTENANCE-MENU"])}
			/>

			<MenuButton
				col={0}
				row={2}
				icon={ICONS.WORK_SETTING_1}
				text="運行設定"
				onClick={usePageNavigationTo(PAGE_TYPES["WORK_SETTING-TOP"])}
			/>
			<MenuButton
				col={1}
				row={2}
				icon={ICONS.CAR_INFO_1}
				text="車両状態"
				onClick={usePageNavigationTo(PAGE_TYPES["CAR_STATE-SWITCHES"])}
			/>
			<MenuButton
				col={2}
				row={2}
				icon={ICONS.OCCUPANCY_RATE}
				text="乗車率"
				onClick={usePageNavigationTo(PAGE_TYPES["OCCUPANCY_RATE"])}
			/>
			<MenuButton
				col={3}
				row={2}
				icon={ICONS.CORRECTION}
				text="補　正"
				onClick={usePageNavigationTo(PAGE_TYPES["CORRECTION-MENU"])}
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
