export type BoundingClientRect = {
	width: number;
	height: number;
};

export type PatternPreviewProps = {
	url: string;
	viewportWidth: number;
};

export type PreviewIframeProps = {
	url: string;
	scale: number;
	viewportWidth: number;
	previewContainerSize?: BoundingClientRect;
};
