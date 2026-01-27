import type { PropsWithChildren } from "react";
import { memo } from "react";

import { CanvasLine } from "../../../../canvas-renderer";
import { useCanvasObjectContext } from "../../../../canvas-renderer/contexts/CanvasObjectContext";
import CanvasObjectGroup from "../../../../canvas-renderer/objects/CanvasObjectGroup";
import { COLORS, FOOTER_HEIGHT } from "../constants";

import FooterSW from "./FooterSW";

import type { PageType } from "../pages/pageTypes";
import type { NavigationQueryParams } from "../pages/usePageNavigation";

export type FooterButtonInfo = {
	readonly label: string;
} & (
	| {
			readonly isSelected: boolean;
			readonly handleClick: () => void;
			readonly navigateTo?: undefined;
			readonly queryParams?: undefined;
			readonly useBackNavigation?: undefined;
	  }
	| {
			readonly isSelected?: undefined;
			readonly handleClick?: undefined;
			readonly navigateTo: PageType;
			readonly queryParams?: NavigationQueryParams;
			readonly useBackNavigation?: undefined;
	  }
	| {
			readonly isSelected?: undefined;
			readonly handleClick?: undefined;
			readonly navigateTo?: undefined;
			readonly queryParams?: undefined;
			readonly useBackNavigation: true;
	  }
);

export type FooterAreaProps = {
	readonly buttons: readonly FooterButtonInfo[];
	readonly leftButtons?: readonly FooterButtonInfo[];
};
export default memo<PropsWithChildren<FooterAreaProps>>(function FooterArea({
	buttons,
	leftButtons,
	children,
}) {
	const parentObjectContext = useCanvasObjectContext();
	return (
		<CanvasObjectGroup
			relX={0}
			relY={parentObjectContext.metadata.height - FOOTER_HEIGHT}
			width={parentObjectContext.metadata.width}
			height={FOOTER_HEIGHT}>
			<CanvasLine
				relX1={0}
				relY1={0}
				relX2={parentObjectContext.metadata.width}
				relY2={0}
				color={COLORS.WHITE}
				width={1}
			/>
			{leftButtons?.map((button, index) => (
				<FooterSW
					key={button.label}
					align="left"
					col={index}
					text={button.label}
					isSelected={button.isSelected}
					onClick={button.handleClick}
					navigateTo={button.navigateTo}
					queryParams={button.queryParams}
					useBackNavigation={button.useBackNavigation}
				/>
			))}
			{buttons.map((button, index) => (
				<FooterSW
					key={button.label}
					align="right"
					col={buttons.length - 1 - index}
					text={button.label}
					isSelected={button.isSelected}
					onClick={button.handleClick}
					navigateTo={button.navigateTo}
					queryParams={button.queryParams}
					useBackNavigation={button.useBackNavigation}
				/>
			))}
			{children}
		</CanvasObjectGroup>
	);
});
