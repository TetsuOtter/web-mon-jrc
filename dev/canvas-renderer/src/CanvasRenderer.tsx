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
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const appRef = useRef<Application | null>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [stageContainer, setStageContainer] = useState<Container | null>(null);
	const [scale, setScale] = useState(1);
	const latestSizeRef = useRef({ width, height });
	const latestFillRef = useRef<string | undefined>(fill);

	latestSizeRef.current = { width, height };
	latestFillRef.current = fill;

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
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		let cancelled = false;
		const app = new Application();
		appRef.current = app;

		const backgroundColor = fill ? new Color(fill).toNumber() : 0x000000;
		const backgroundAlpha = fill ? new Color(fill).alpha : 0;

		app
			.init({
				canvas,
				width,
				height,
				backgroundColor,
				backgroundAlpha,
				antialias: false,
				autoDensity: true,
				resolution: window.devicePixelRatio || 1,
				preserveDrawingBuffer: true,
			})
			.then(() => {
				if (!cancelled) {
					app.stage.sortableChildren = true;
					const latestSize = latestSizeRef.current;
					app.renderer.resize(latestSize.width, latestSize.height);
					applyBackground(app, latestFillRef.current);
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
				}
			})
			.catch((error: unknown) => {
				console.error("Failed to initialize PIXI Application:", error);
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
			if (appToDestroy?.renderer) {
				appToDestroy.destroy(false, { children: true });
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// stageContainerが設定されてReact childrenがマウントされた後、
	// PIXIが最初のフレームを描画してからpixiReadyをセットする
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || stageContainer == null) return;

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

	// wrapper divのサイズを監視してcanvasのスケールを計算
	useEffect(() => {
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

	const canvasStyle = useMemo(
		(): CSSProperties => ({
			transform: `scale(${scale})`,
			transformOrigin: "center",
		}),
		[scale],
	);

	return (
		<>
			<div
				ref={wrapperRef}
				style={wrapperStyle}
			>
				<canvas
					ref={canvasRef}
					style={canvasStyle}
				/>
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
