import { createContext } from "react";

export type ClickEventHandler = (x: number, y: number) => void;

export type ClickEventContextType = {
	registerClickHandler: (handler: ClickEventHandler) => void;
	unregisterClickHandler: (handler: ClickEventHandler) => void;
};

export const ClickEventContext = createContext<ClickEventContextType | null>(
	null
);
