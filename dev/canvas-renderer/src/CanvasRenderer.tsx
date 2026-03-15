import type { CSSProperties, ReactNode } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";

import { Application, Color } from "pixi.js";

import CanvasObjectContext from "./contexts/CanvasObjectContext";

import type { CanvasObjectMetadata } from "./contexts/CanvasObjectContext";
import type { Container } from "pixi.js";

type CanvasRendererProps = {
	width: number;
	height: number;
	fill?: string;
	style?: CSSProperties;
	children: ReactNode;
	/** PIXIは自動レンダリングのため無視される（後方互換のために維持） */
	renderRequestCount?: number;
};

export default memo<CanvasRendererProps>(function CanvasRenderer({
	width,
	height,
	fill,
	style: styleProps,
	children,
	renderRequestCount: _renderRequestCount,
}) {
	// PIXIのcanvasを格納するホストdiv（canvasはJSXでなくPIXIが生成する）
	const canvasHostRef = useRef<HTMLDivElement>(null);
	const appRef = useRef<Application | null>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [stageContainer, setStageContainer] = useState<Container | null>(null);
	const [scale, setScale] = useState(1);
	const latestSizeRef = useRef({ width, height });
	const latestFillRef = useRef<string | undefined>(fill);
	const latestScaleRef = useRef(scale);

	latestSizeRef.current = { width, height };
	latestFillRef.current = fill;
	latestScaleRef.current = scale;

	const applyBackground = (
		app: Application,
		backgroundFill: string | undefined,
	): void => {
		if (backgroundFill) {
			const color = new Color(backgroundFill);
			app.renderer.background.color = color.toNumber();
			app.renderer.background.alpha = color.alpha;
		} else {
			app.renderer.background.alpha = 0;
		}
	};

	// PIXIアプリケーションを初期化（マウント時のみ）
	// canvasはJSXの<canvas>を使わず、PIXIに生成させてhostDivに追加する。
	// これによりStrictModeの二重マウントで同一canvasに対して複数のapp.init()が
	// 同時実行され、WebGLコンテキストが破壊されるフリーズを防ぐ。
	useEffect(() => {
		const host = canvasHostRef.current;
		if (!host) return;

		let cancelled = false;
		const app = new Application();
		appRef.current = app;

		const backgroundColor = fill ? new Color(fill).toNumber() : 0x000000;
		const backgroundAlpha = fill ? new Color(fill).alpha : 0;

		// E2Eテスト環境では、ウィンドウサイズに依存しないようオートスケールを無効化
		const isE2ETest =
			localStorage.getItem("__e2e_test_disable_autoscale") === "true";

		app
			.init({
				// canvasを指定しない → PIXIが独自にcanvas要素を生成する
				// これにより各マウントが独立したWebGLコンテキストを持つ
				width,
				height,
				backgroundColor,
				backgroundAlpha,
				antialias: false,
				autoDensity: isE2ETest ? false : true,
				resolution: isE2ETest ? 1 : window.devicePixelRatio || 1,
				preserveDrawingBuffer: true,
			})
			.then(() => {
				if (cancelled) {
					// StrictMode の二重マウントなどでアンマウントされた場合、
					// init() 完了後でも適切に破棄してWebGLコンテキストを解放する
					app.destroy(true, { children: true });
					return;
				}
				app.stage.sortableChildren = true;
				const latestSize = latestSizeRef.current;
				app.renderer.resize(latestSize.width, latestSize.height);
				applyBackground(app, latestFillRef.current);

				// canvasのスタイルを設定してhostDivに追加
				const canvas = app.canvas;
				canvas.style.transform = `scale(${latestScaleRef.current})`;
				canvas.style.transformOrigin = "center";
				host.appendChild(canvas);

				setStageContainer(app.stage);
				// テスト用: スクリーンショット撮影前にPIXIを制御できるよう公開
				const testApps = (
					window as Window & { __testPixiApps?: Application[] }
				).__testPixiApps;
				if (testApps) {
					testApps.push(app);
				} else {
					(
						window as Window & { __testPixiApps?: Application[] }
					).__testPixiApps = [app];
				}
			})
			.catch((error: unknown) => {
				if (!cancelled) {
					console.error("Failed to initialize PIXI Application:", error);
				}
			});

		return () => {
			cancelled = true;
			const appToDestroy = appRef.current;
			appRef.current = null;
			setStageContainer(null);
			// __testPixiAppsから削除
			if (appToDestroy) {
				const testApps = (window as Window & { __testPixiApps?: Application[] })
					.__testPixiApps;
				if (testApps) {
					const idx = testApps.indexOf(appToDestroy);
					if (idx !== -1) testApps.splice(idx, 1);
				}
			}
			// renderer は init() 完了後にのみ存在するため、未初期化の場合はスキップ
			// (未完了の場合は .then() 内で cancelled チェックにより destroy される)
			if (appToDestroy?.renderer) {
				if (appToDestroy.canvas.parentNode) {
					appToDestroy.canvas.parentNode.removeChild(appToDestroy.canvas);
				}
				appToDestroy.destroy(true, { children: true });
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// stageContainerが設定されてReact childrenがマウントされた後、
	// PIXIが最初のフレームを描画してからpixiReadyをセットする
	useEffect(() => {
		const app = appRef.current;
		if (!app?.renderer || stageContainer == null) return;

		const canvas = app.canvas;
		let id2: ReturnType<typeof requestAnimationFrame>;
		// 2フレーム待ってPIXIが子要素を描画してからフラグをセット
		const id1 = requestAnimationFrame(() => {
			id2 = requestAnimationFrame(() => {
				canvas.dataset.pixiReady = "true";
			});
		});
		return () => {
			cancelAnimationFrame(id1);
			cancelAnimationFrame(id2);
			delete canvas.dataset.pixiReady;
		};
	}, [stageContainer]);

	// サイズ変更に対応
	useEffect(() => {
		const app = appRef.current;
		if (!app || !app.renderer) return;
		app.renderer.resize(width, height);
	}, [width, height]);

	// 背景色変更に対応
	useEffect(() => {
		const app = appRef.current;
		if (!app || !app.renderer) return;
		applyBackground(app, fill);
	}, [fill]);

	// スケール変更に対応（PIXIのcanvasに直接適用）
	useEffect(() => {
		const app = appRef.current;
		if (!app?.renderer) return;
		app.canvas.style.transform = `scale(${scale})`;
	}, [scale]);

	// wrapper divのサイズを監視してcanvasのスケールを計算
	// E2Eテスト環境ではオートスケールを無効化してscale=1に固定
	useEffect(() => {
		const isE2ETest =
			localStorage.getItem("__e2e_test_disable_autoscale") === "true";

		if (isE2ETest) {
			setScale(1);
			return;
		}

		const wrapper = wrapperRef.current;
		if (!wrapper) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width: wrapperWidth, height: wrapperHeight } =
					entry.contentRect;
				const scaleX = wrapperWidth / width;
				const scaleY = wrapperHeight / height;
				const newScale = Math.min(scaleX, scaleY);
				setScale(newScale);
			}
		});

		observer.observe(wrapper);
		return () => observer.disconnect();
	}, [width, height]);

	const rootMetadata = useMemo(
		(): CanvasObjectMetadata => ({
			absX: 0,
			absY: 0,
			relX: 0,
			relY: 0,
			width,
			height,
		}),
		[width, height],
	);

	const wrapperStyle = useMemo(
		(): CSSProperties => ({
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			...styleProps,
		}),
		[styleProps],
	);

	return (
		<>
			<div
				ref={wrapperRef}
				style={wrapperStyle}
			>
				{/* PIXIのcanvasはapp.init()完了後にJSで追加される */}
				<div ref={canvasHostRef} />
			</div>
			{stageContainer != null && (
				<CanvasObjectContext
					pixiContainer={stageContainer}
					metadata={rootMetadata}
				>
					{children}
				</CanvasObjectContext>
			)}
		</>
	);
});
