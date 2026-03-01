import { setFullState } from "./type313sSlice";

import type { Type313sState } from "./type313sTypes";
import type { AppDispatch } from "../../store";

export const TYPE313S_STORAGE_KEY = "type313s_state";

/**
 * LocalStorage から Type313sState を読み込む。
 * データが存在しない場合・パース失敗時は undefined を返す。
 */
export function loadType313sState(): Type313sState | undefined {
	try {
		const serialized = localStorage.getItem(TYPE313S_STORAGE_KEY);
		if (serialized == null) return undefined;
		return JSON.parse(serialized) as Type313sState;
	} catch {
		return undefined;
	}
}

/**
 * Type313sState を LocalStorage に保存する。
 */
export function saveType313sState(state: Type313sState): void {
	try {
		localStorage.setItem(TYPE313S_STORAGE_KEY, JSON.stringify(state));
	} catch {
		// ストレージ容量超過などの場合は無視する
	}
}

/**
 * 他タブで LocalStorage が更新された場合に自タブの Redux state を同期する。
 * `storage` イベントは同一タブからの書き込みでは発火しないため、
 * 自タブの dispatch ループは発生しない。
 */
export function setupStorageSyncListener(dispatch: AppDispatch): void {
	if (typeof window === "undefined") return;

	window.addEventListener("storage", (event: StorageEvent) => {
		if (event.key !== TYPE313S_STORAGE_KEY || event.newValue == null) return;

		const newState = JSON.parse(event.newValue);
		if (newState != null) {
			dispatch(setFullState(newState));
		}
	});
}
