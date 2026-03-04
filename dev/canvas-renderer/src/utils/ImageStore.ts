import { useCallback, useSyncExternalStore } from "react";

type ImageAndCanvas = {
	image: HTMLImageElement;
	canvas: OffscreenCanvas;
};

const imageCache = new Map<string, ImageAndCanvas>();

type SubscriberManager = (callback: () => void) => () => void;
const subscriberManagerMap = new Map<string, SubscriberManager>();

export function useStoredImage(imagePath: string): ImageAndCanvas | null {
	const subscribe = useCallback(
		(callback: () => void) => {
			if (!imagePath) {
				return () => {
					// no-op
				};
			}
			const cachedImage = imageCache.get(imagePath);
			if (cachedImage) {
				callback();
				return () => {
					// no-op
				};
			}
			const subscriberManager =
				subscriberManagerMap.get(imagePath) ??
				createSubscriberManager(imagePath);
			return subscriberManager(callback);
		},
		[imagePath]
	);
	const getSnapshot = useCallback(() => {
		if (!imagePath) {
			return null;
		}
		return imageCache.get(imagePath) ?? null;
	}, [imagePath]);

	return useSyncExternalStore(subscribe, getSnapshot);
}

function createSubscriberManager(imagePath: string): SubscriberManager {
	const subscribers = new Set<() => void>();

	const image = new Image();
	image.crossOrigin = "anonymous";
	image.onload = () => {
		const canvas = new OffscreenCanvas(image.width, image.height);
		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.drawImage(image, 0, 0);
			const imageData: ImageAndCanvas = {
				image,
				canvas,
			};
			imageCache.set(imagePath, imageData);
			subscribers.forEach((callback) => callback());
		}
	};
	image.onerror = () => {
		console.error(`Failed to load image: ${imagePath}`);
	};
	image.src = imagePath;

	return (callback: () => void) => {
		subscribers.add(callback);
		return () => subscribers.delete(callback);
	};
}
