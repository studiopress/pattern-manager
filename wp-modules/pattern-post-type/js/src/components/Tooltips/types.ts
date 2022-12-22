// This is a hack to get the dashicon string literals from @wordpress/components.
// Types from the package are not importing properly otherwise.
import type { IconKey } from '@wordpress/components/src/dashicon/types';

export type BaseTooltipTypes = {
	helperText: string;
	helperTitle: string;
	icon?: IconKey;
};
