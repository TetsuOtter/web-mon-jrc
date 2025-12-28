import { createContext, useContext } from "react";

export type RenderArea = {
	absX: number;
	absY: number;
	width: number;
	height: number;
};
export type RenderRequestContextType = (area: RenderArea) => void;

export const RenderRequesterContext = createContext<RenderRequestContextType>(
	() => {}
);

export function useRequestRenderFunction() {
	return useContext(RenderRequesterContext);
}
