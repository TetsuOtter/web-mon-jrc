import MENU from "./menu";

export const ICONS = {
	CAR_INFO: [],
	CONDUCTOR: [],
	CORRECTION: [],
	DRIVER: [],
	EMBEDDED_MANUAL: [],
	MAINTENANCE: [],
	MENU,
	OCCUPANCY_RATE: [],
	OTHER_SERIES: [],
	TABLE_OF_CONTENTS: [],
	WORK_SETTING: [],
} as const satisfies Record<string, readonly string[]>;
export type IconName = keyof typeof ICONS;
export type IconData = (typeof ICONS)[IconName];
