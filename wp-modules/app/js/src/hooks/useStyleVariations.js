// @ts-check

// WP Dependencies
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useStudioContext from './useStudioContext';
import convertToSlug from '../utils/convertToSlug';
import { v4 as uuidv4 } from 'uuid';

export default function useStyleVariations() {
	const { currentTheme, currentStyleVariationId } = useStudioContext();

	const [ newStyleId, setNewStyleId ] = useState( '' );
	const [ newStyleName, setNewStyleName ] = useState( '' );

	/**
	 * This key is referenced by `Object.keys( defaultStyle )[0]` in most places the hook is used.
	 * However, it is explicitly defined in the main FseStudioApp index file.
	 *
	 * @see FseStudioApp index.js
	 * @see useCurrentId currentStyleVariationId
	 */
	const defaultStyle = {
		'default-style': {
			title: __( 'Default Style', 'fse-studio' ),
			body: currentTheme?.data.theme_json_file ?? {},
		},
	};

	const defaultStyleName = Object.keys( defaultStyle )[ 0 ];

	/**
	 * Set the currentStyleVariationId, then trigger a save.
	 *
	 * Initially tried currentTheme?.data for dependency, but currentTheme?.data.styles
	 * seems tohave fewer side-effects.
	 */
	useEffect( () => {
		if (
			currentTheme?.data.styles.hasOwnProperty( newStyleId ) &&
			currentStyleVariationId?.value !== newStyleId
		) {
			// Set the current style id.
			// Updates dropdown selection.
			currentStyleVariationId?.set( newStyleId );

			// Save the theme.
			currentTheme?.save();
		}
	}, [ currentTheme?.data.styles ] );

	/**
	 * Handle setting up a new style object.
	 *
	 * A new style object is used to set internal state for styleVariations.
	 * The object is then used to set state for the currentTheme context.
	 *
	 * @see useThemeData
	 * @return {void}
	 */
	const handleNewStyle = () => {
		const id = `${ convertToSlug( newStyleName ) }-${ uuidv4() }`;
		const currentStyleValue = currentStyleVariationId?.value ?? '';

		const currentStyleBody =
			currentStyleVariationId?.value === defaultStyleName
				? defaultStyle[ defaultStyleName ].body
				: currentTheme?.data.styles[ currentStyleValue ]?.body ??
				  defaultStyle[ defaultStyleName ].body;

		const newStyle = {
			[ id ]: {
				id,
				title: newStyleName,
				body: currentStyleBody,
			},
		};

		// Udpate local style name state to clear input.
		setNewStyleName( '' );

		// Set the new style.
		addStyleToTheme( newStyle, id );

		// Update state for the style id context.
		setNewStyleId( id );
	};

	/**
	 * Update state for the theme context.
	 *
	 * Triggers useEffect via update of currentTheme.data.styles.
	 *
	 * @param {Object} style
	 * @param {string} styleId
	 * @return {void}
	 */
	const addStyleToTheme = ( style, styleId ) => {
		currentTheme?.set( {
			...currentTheme.data,
			styles: {
				...currentTheme.data.styles,
				[ styleId ]: style[ styleId ],
			},
		} );
	};

	return {
		defaultStyle,
		newStyleName,
		setNewStyleName,
		handleNewStyle,
	};
}
