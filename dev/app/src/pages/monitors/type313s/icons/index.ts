import BROKEN from "./broken";
import CAR_INFO_1 from "./car_info_1";
import CAR_INFO_2 from "./car_info_2";
import CONDUCTOR from "./conductor";
import CORRECTION from "./correction";
import DRIVER from "./driver";
import EMBEDDED_MANUAL from "./embedded_manual";
import MAINTENANCE from "./maintenance";
import MENU from "./menu";
import MENU_373 from "./menu_373";
import OCCUPANCY_RATE from "./occupancy_rate";
import OTHER_SERIES from "./other_series";
import TABLE_OF_CONTENTS_1 from "./table_of_contents_1";
import TABLE_OF_CONTENTS_2 from "./table_of_contents_2";
import WORK_SETTING_1 from "./work_setting_1";
import WORK_SETTING_2 from "./work_setting_2";
import WORK_SETTING_373 from "./work_setting_373";

export const ICONS = {
	BROKEN,
	CAR_INFO_1,
	CAR_INFO_2,
	CONDUCTOR,
	CORRECTION,
	DRIVER,
	EMBEDDED_MANUAL,
	MAINTENANCE,
	MENU,
	MENU_373,
	OCCUPANCY_RATE,
	OTHER_SERIES,
	TABLE_OF_CONTENTS_1,
	TABLE_OF_CONTENTS_2,
	WORK_SETTING_1,
	WORK_SETTING_2,
	WORK_SETTING_373,
} as const satisfies Record<string, readonly string[]>;
export type IconName = keyof typeof ICONS;
export type IconData = (typeof ICONS)[IconName];
