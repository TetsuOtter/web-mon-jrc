import { memo, useCallback, useMemo, useState } from "react";

import {
	CanvasLine,
	CanvasRect,
	CanvasText,
} from "@web-mon-jrc/canvas-renderer";
import CanvasRoundedRect from "@web-mon-jrc/canvas-renderer/objects/CanvasRoundedRect";

import { useAppDispatch } from "../../../../../store/hooks";
import {
	setTrainNumber as setTrainNumberToStore,
	setTrainType as setTrainTypeToStore,
	setDestination as setDestinationToStore,
} from "../../../../../store/monitors/type313s/type313sSlice";
import { toWide } from "../../../../../utils/toWide";
import { SHADOW_WIDTH } from "../../components/Button";
import FooterPageFrame from "../../components/FooterPageFrame";
import TextButton from "../../components/TextButton";
import { COLORS, DISPLAY_WIDTH, FONT_SIZE_1X } from "../../constants";
import { useFooterAreaWithPagerProps } from "../../footer/FooterAreaWithPagerPropsHook";
import { useWorkSettingPageMode } from "../../hooks/usePageMode";
import { ICONS } from "../../icons";
import { PAGE_MODES, PAGE_TYPES } from "../pageTypes";
import {
	usePageBackNavigation,
	usePageNavigationTo,
} from "../usePageNavigation";

import TenKeyButton, {
	isTenKeyTypePrefix,
	isTenKeyTypeSuffix,
	TEN_KEY_TYPE,
} from "./components/TenKeyButton";
import { FOOTER_MENU_FOR_CONDUCTOR, PAGE_NAME_MAP } from "./constants";

import type {
	TenKeyType,
	TenKeyTypePrefix,
	TenKeyTypeSuffix,
} from "./components/TenKeyButton";
import type { FooterButtonInfo } from "../../footer/FooterArea";

const DISPLAY_RECT_X = 24;
const DISPLAY_RECT_Y = 16;
const DISPLAY_RECT_WIDTH = 752;
const DISPLAY_RECT_HEIGHT = 108;

const EACH_DISPLAY_WIDTH = 200;
const EACH_DISPLAY_HEIGHT = 60;
const EACH_DISPLAY_TOP = 32;
const EACH_DISPLAY_LABEL_TOP = 8;

const TYPE_DISPLAY_X = 40;
const DESTINATION_DISPLAY_X = 276;
const TRAIN_NUMBER_DISPLAY_X = 512;

const TOP_AREA_HR_Y = 139;

const TEN_KEY_AREA_X = 304;
const TEN_KEY_AREA_Y = 180;
const TEN_KEY_AREA_WIDTH = 484;
const TEN_KEY_AREA_HEIGHT = 272;
const TEN_KEY_CORNER_RADIUS = 12;

const SET_BUTTON_X = 368;
const SET_BUTTON_Y = 84;
const SET_BUTTON_WIDTH = 96;
const SET_BUTTON_HEIGHT = 32;

const CONFIRM_BUTTON_X = SET_BUTTON_X;
const CONFIRM_BUTTON_Y = SET_BUTTON_Y + 64;
const CONFIRM_BUTTON_WIDTH = SET_BUTTON_WIDTH;
const CONFIRM_BUTTON_HEIGHT = SET_BUTTON_HEIGHT;

const STOP_STA_TEXT_X = 8;
const STOP_STA_TEXT_Y = 180;
const STOP_STA_TEXT_CHAR_PER_LINE = 18;
const STOP_STA_TEXT_LINE_PER_PAGE = 15;
const STOP_STA_TEXT_CHAR_PER_PAGE =
	STOP_STA_TEXT_CHAR_PER_LINE * STOP_STA_TEXT_LINE_PER_PAGE;
const STOP_STA_TEXT_WIDTH = FONT_SIZE_1X * STOP_STA_TEXT_CHAR_PER_LINE;
const STOP_STA_TEXT_LINE_HEIGHT = (FONT_SIZE_1X + 2) / FONT_SIZE_1X;
const STOP_STA_TEXT_HEIGHT = (FONT_SIZE_1X + 2) * STOP_STA_TEXT_LINE_PER_PAGE;

const GUIDE_TEXT_1_X = 10;
const GUIDE_TEXT_1_Y = 482;
const GUIDE_TEXT_2_X = GUIDE_TEXT_1_X;
const GUIDE_TEXT_2_Y = GUIDE_TEXT_1_Y + FONT_SIZE_1X;

type TrainNumberObject = {
	prefix: TenKeyTypePrefix | undefined;
	trainNumber: string;
	suffix: TenKeyTypeSuffix | undefined;
};
const TRAIN_NUMBER_OBJECT_INITIAL = {
	prefix: undefined,
	trainNumber: "",
	suffix: undefined,
} as const satisfies TrainNumberObject;

export default memo(function WorkSettingTrainNumber() {
	const dispatch = useAppDispatch();
	const mode = useWorkSettingPageMode();
	const navigateToWorkSettingTop = usePageNavigationTo(
		PAGE_TYPES.WORK_SETTING_TOP
	);
	const backNavigate = usePageBackNavigation();

	const [trainType, setTrainType] = useState("");
	const [destination, setDestination] = useState("");
	const [trainNumber, setTrainNumber] = useState<TrainNumberObject>(
		TRAIN_NUMBER_OBJECT_INITIAL
	);
	const [stopSta, setStopSta] = useState("");
	const maxPageIndex = useMemo(
		() => Math.ceil(stopSta.length / STOP_STA_TEXT_CHAR_PER_PAGE) - 1,
		[stopSta.length]
	);
	const pagerProps = useFooterAreaWithPagerProps(maxPageIndex);
	const onClickTenKey = useCallback((type: TenKeyType) => {
		if (type === TEN_KEY_TYPE.CLEAR) {
			setTrainNumber(TRAIN_NUMBER_OBJECT_INITIAL);
		} else if (isTenKeyTypePrefix(type)) {
			setTrainNumber((prev) => ({ ...prev, prefix: type }));
		} else if (isTenKeyTypeSuffix(type)) {
			setTrainNumber((prev) => ({ ...prev, suffix: type }));
		} else {
			setTrainNumber((prev) => ({
				...prev,
				trainNumber:
					prev.trainNumber.length < 4
						? prev.trainNumber + type.toString()
						: prev.trainNumber,
			}));
		}
	}, []);

	const onClickSet = useCallback(() => {
		setTrainType("普通");
		setDestination("豊橋");
		setStopSta(IIDA_LINE_STA_LIST);
		dispatch(setTrainNumberToStore(getTrainNumberStr(trainNumber, false)));
		dispatch(setTrainTypeToStore("普通"));
		dispatch(setDestinationToStore("豊橋"));
		return true;
	}, [dispatch, trainNumber]);
	const trainNumberStr = useMemo(
		() => getTrainNumberStr(trainNumber, true),
		[trainNumber]
	);

	return (
		<FooterPageFrame
			mode={mode}
			pageIcon={ICONS.WORK_SETTING_1}
			pageName={PAGE_NAME_MAP[mode]}
			footerItems={
				mode === PAGE_MODES.CONDUCTOR ? FOOTER_MENU_FOR_CONDUCTOR : FOOTER_MENU
			}
			pagerProps={pagerProps}>
			<CanvasLine
				relX1={0}
				relY1={TOP_AREA_HR_Y}
				relX2={DISPLAY_WIDTH - 1}
				relY2={TOP_AREA_HR_Y}
				color={COLORS.WHITE}
			/>
			<CanvasRect
				relX={DISPLAY_RECT_X}
				relY={DISPLAY_RECT_Y}
				width={DISPLAY_RECT_WIDTH}
				height={DISPLAY_RECT_HEIGHT}
				fillColor={COLORS.BLACK}
				strokeColor={COLORS.WHITE}
				strokeWidth={1}>
				<CanvasText
					relX={TYPE_DISPLAY_X}
					relY={EACH_DISPLAY_LABEL_TOP}
					maxWidthPx={EACH_DISPLAY_WIDTH}
					align="center"
					text="種　別"
					scaleX={2}
					fillColor={COLORS.WHITE}
				/>
				<TextButton
					text={trainType}
					relX={TYPE_DISPLAY_X}
					relY={EACH_DISPLAY_TOP}
					width={EACH_DISPLAY_WIDTH}
					height={EACH_DISPLAY_HEIGHT}
					fillColor={COLORS.BLACK}
					scaleY={2}
				/>

				<CanvasText
					relX={DESTINATION_DISPLAY_X}
					relY={EACH_DISPLAY_LABEL_TOP}
					maxWidthPx={EACH_DISPLAY_WIDTH}
					align="center"
					text="行　先"
					scaleX={2}
					fillColor={COLORS.WHITE}
				/>
				<TextButton
					text={destination}
					relX={DESTINATION_DISPLAY_X}
					relY={EACH_DISPLAY_TOP}
					width={EACH_DISPLAY_WIDTH}
					height={EACH_DISPLAY_HEIGHT}
					fillColor={COLORS.BLACK}
					scaleY={2}
				/>

				<CanvasText
					relX={TRAIN_NUMBER_DISPLAY_X}
					relY={EACH_DISPLAY_LABEL_TOP}
					maxWidthPx={EACH_DISPLAY_WIDTH}
					align="center"
					text="列車番号"
					scaleX={2}
					fillColor={COLORS.WHITE}
				/>
				<TextButton
					text={trainNumberStr}
					relX={TRAIN_NUMBER_DISPLAY_X}
					relY={EACH_DISPLAY_TOP}
					width={EACH_DISPLAY_WIDTH}
					height={EACH_DISPLAY_HEIGHT}
					fillColor={COLORS.BLACK}
					scaleY={2}
				/>
			</CanvasRect>

			<CanvasRoundedRect
				relX={TEN_KEY_AREA_X}
				relY={TEN_KEY_AREA_Y}
				width={TEN_KEY_AREA_WIDTH}
				height={TEN_KEY_AREA_HEIGHT}
				radius={TEN_KEY_CORNER_RADIUS}
				fillColor={COLORS.GRAY}>
				{TEN_KEY_LAYOUT.map((row, rowIndex) =>
					row.map((type, colIndex) => (
						<TenKeyButton
							// eslint-disable-next-line react/no-array-index-key
							key={`tenkey-${rowIndex}-${colIndex}`}
							row={rowIndex}
							col={colIndex}
							type={type}
							onClick={onClickTenKey}
						/>
					))
				).flat()}
				<TextButton
					text="セット"
					relX={SET_BUTTON_X}
					relY={SET_BUTTON_Y}
					width={SET_BUTTON_WIDTH}
					height={SET_BUTTON_HEIGHT}
					shadowWidth={SHADOW_WIDTH.SMALL}
					onClick={onClickSet}
				/>
				<TextButton
					text="確　認"
					relX={CONFIRM_BUTTON_X}
					relY={CONFIRM_BUTTON_Y}
					width={CONFIRM_BUTTON_WIDTH}
					height={CONFIRM_BUTTON_HEIGHT}
					shadowWidth={SHADOW_WIDTH.SMALL}
					onClick={
						mode === PAGE_MODES.DRIVER ? backNavigate : navigateToWorkSettingTop
					}
				/>
			</CanvasRoundedRect>
			<CanvasText
				relX={STOP_STA_TEXT_X}
				relY={STOP_STA_TEXT_Y}
				lineHeight={STOP_STA_TEXT_LINE_HEIGHT}
				maxWidthPx={STOP_STA_TEXT_WIDTH}
				maxHeightPx={STOP_STA_TEXT_HEIGHT}
				text={stopSta}
				skipLineCount={
					pagerProps.currentPageIndex * STOP_STA_TEXT_LINE_PER_PAGE
				}
				fillColor={COLORS.WHITE}
			/>
			<CanvasText
				relX={GUIDE_TEXT_1_X}
				relY={GUIDE_TEXT_1_Y}
				text="列車番号を入力後、「セット」キーを押し、最後に「確認」キーを押して下さい。"
				fillColor={COLORS.WHITE}
			/>
			<CanvasText
				relX={GUIDE_TEXT_2_X}
				relY={GUIDE_TEXT_2_Y}
				text="（停車パターン選択画面へ切り替わったら、停車パターンを選択して下さい。）"
				fillColor={COLORS.WHITE}
			/>
		</FooterPageFrame>
	);
});

function getTrainNumberStr(
	trainNumber: TrainNumberObject,
	showSuffixPlaceholder: boolean
): string {
	const prefixStr = (() => {
		switch (trainNumber.prefix) {
			case TEN_KEY_TYPE["回"]:
				return "回";
			case TEN_KEY_TYPE["救"]:
				return "救";
			case TEN_KEY_TYPE["試"]:
				return "試";
			default:
				return "";
		}
	})();
	const suffixStr = (() => {
		switch (trainNumber.suffix) {
			case TEN_KEY_TYPE["M"]:
				return "M";
			case TEN_KEY_TYPE["G"]:
				return "G";
			case TEN_KEY_TYPE["D"]:
				return "D";
			case TEN_KEY_TYPE["F"]:
				return "F";
			case TEN_KEY_TYPE["A"]:
				return "A";
			case TEN_KEY_TYPE["C"]:
				return "C";
			default:
				return showSuffixPlaceholder ? "■" : "";
		}
	})();
	return toWide(`${prefixStr}${trainNumber.trainNumber}${suffixStr}`);
}

const FOOTER_MENU = [
	{
		label: "列番設定",
		navigateTo: PAGE_TYPES.WORK_SETTING_TRAIN_NUMBER,
	},
	{
		label: "メニュー",
		navigateTo: PAGE_TYPES.MENU,
		queryParams: { mode: PAGE_MODES.MENU },
	},
] as const satisfies FooterButtonInfo[];

type TenKeyRow = readonly (TenKeyType | undefined)[] & { length: 6 };
type TenKeyLayout = readonly TenKeyRow[] & { length: 4 };
const TEN_KEY_LAYOUT = [
	[
		TEN_KEY_TYPE["EMPTY"],
		TEN_KEY_TYPE[7],
		TEN_KEY_TYPE[8],
		TEN_KEY_TYPE[9],
		TEN_KEY_TYPE["M"],
		TEN_KEY_TYPE["EMPTY"],
	],
	[
		TEN_KEY_TYPE["回"],
		TEN_KEY_TYPE[4],
		TEN_KEY_TYPE[5],
		TEN_KEY_TYPE[6],
		TEN_KEY_TYPE["G"],
		TEN_KEY_TYPE["EMPTY"],
	],
	[
		TEN_KEY_TYPE["救"],
		TEN_KEY_TYPE[1],
		TEN_KEY_TYPE[2],
		TEN_KEY_TYPE[3],
		TEN_KEY_TYPE["D"],
		TEN_KEY_TYPE["F"],
	],
	[
		TEN_KEY_TYPE["試"],
		TEN_KEY_TYPE[0],
		TEN_KEY_TYPE["CLEAR"],
		undefined,
		TEN_KEY_TYPE["A"],
		TEN_KEY_TYPE["C"],
	],
] as const satisfies TenKeyLayout;

const IIDA_LINE_STA_LIST = [
	"上諏訪",
	"下諏訪",
	"岡谷",
	"川岸",
	"辰野",
	"宮木",
	"伊那新町",
	"羽場",
	"沢",
	"伊那松島",
	"木ノ下",
	"北殿",
	"田畑",
	"伊那北",
	"伊那市",
	"下島",
	"沢渡",
	"赤木",
	"宮田",
	"太田切",
	"駒ヶ根小町屋",
	"伊那福岡",
	"田切",
	"飯島",
	"伊那本郷",
	"七久保",
	"高遠原",
	"伊那田島",
	"上片桐",
	"伊那大島",
	"山吹",
	"下平",
	"市田",
	"下市田",
	"元善光寺",
	"伊那上郷",
	"桜町",
	"飯田",
	"切石",
	"鼎",
	"下山村",
	"伊那八幡",
	"毛賀",
	"駄科",
	"時又",
	"川路",
	"天竜峡",
	"千代",
	"金野",
	"唐笠",
	"門島",
	"田本",
	"温田",
	"為栗",
	"平岡",
	"鶯巣",
	"伊那小沢",
	"中井侍",
	"小和田",
	"大嵐",
	"水窪",
	"向市場",
	"城西",
	"相月",
	"佐久間",
	"中部天竜",
	"下川合",
	"早瀬",
	"浦川",
	"上市場",
	"出馬",
	"東栄",
	"池場",
	"三河川合",
	"柿平",
	"三河槙原",
	"湯谷温泉",
	"三河大野",
	"本長篠",
	"長篠城",
	"鳥居",
	"大海",
	"三河東郷",
	"茶臼山",
	"東新町",
	"新城",
	"野田城",
	"東上",
	"江島",
	"長山",
	"三河一宮",
	"豊川",
	"牛久保",
	"小坂井",
	"下地",
	"船町",
	"豊橋",
].join("→");
