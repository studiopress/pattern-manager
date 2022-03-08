import React from '@wordpress/element';
/**
 * Highlights a given element.
 *
 * @param {Record<string, unknown>} props              The component props.
 * @param {string|undefined}        props.elementClass The selector class to highlight.
 * @return {React.ReactElement|null} Styling for the element.
 */
export default function HighlightElement( { elementClass } ) {
	return elementClass ? (
		<style type="text/css">
			{ `.${ elementClass } {
					border: 4px solid white!important;
					outline: 4px solid #0ecad4!important;
					outline-offset: -4px!important;
				}` }
		</style>
	) : null;
}
