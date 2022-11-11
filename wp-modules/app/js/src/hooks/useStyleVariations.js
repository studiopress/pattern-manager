// @ts-check
/* eslint-disable jsdoc/valid-types */

// WP Dependencies
import { useRef, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useStudioContext from './useStudioContext';
import convertToSlug from '../utils/convertToSlug';
import { v4 as uuidv4 } from 'uuid';

export default function useStyleVariations() {
	const { currentTheme, currentStyleVariationId } = useStudioContext();

	const newStyleId = useRef( '' );

	const [ newStyleName, setNewStyleName ] = useState( '' );
	const [ updateCurrentStyle, setUpdateCurrentStyle ] = useState( false );

	const defaultStyleName = 'default-style';

	/**
	 * This key is referenced by `Object.keys( defaultStyle )[0]` in most places the hook is used.
	 * However, it is explicitly defined in the main FseStudioApp index file.
	 *
	 * @see FseStudioApp index.js
	 * @see useCurrentId currentStyleVariationId
	 */
	const defaultStyle = {
		[ defaultStyleName ]: {
			title: __( 'Default Style', 'fse-studio' ),
			body: currentTheme?.data?.theme_json_file ?? {},
		},
	};

	/**
	 * Set the currentStyleVariationId, then trigger a save.
	 *
	 * Able to use currentTheme?.data for wider coverage as long as updateCurrentStyle is present.
	 * Otherwise, upon save with 'default style' selected after creating a new style, the selecttion
	 * unintentionally switches from default to the new style.
	 */
	useEffect( () => {
		if (
			updateCurrentStyle &&
			currentTheme?.data.styles.hasOwnProperty( newStyleId.current ) &&
			currentStyleVariationId?.value !== newStyleId.current
		) {
			// Set the current style id.
			// Updates dropdown selection.
			currentStyleVariationId?.set( newStyleId.current );

			// Save the theme.
			currentTheme?.save();

			setUpdateCurrentStyle( false );
		}
	}, [ currentTheme?.data ] );

	/**
	 * Handle setting up a new style object.
	 *
	 * A new style object is used to set internal state for styleVariations.
	 * The object is then used to set state for the currentTheme context.
	 *
	 * @see useThemeData
	 */
	const handleNewStyle = () => {
		const id = `${ convertToSlug( newStyleName ) }-${ uuidv4() }`;
		const currentStyleValue = currentStyleVariationId?.value ?? '';

		/** @type {import('../types').Style['body']} */
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

		// Mutate the style id ref.
		newStyleId.current = id;

		// Udpate local style name state to clear input.
		setNewStyleName( '' );

		// Update the 'update style' state for the useEffect hook.
		setUpdateCurrentStyle( true );

		// Set the new style.
		addStyleToTheme( newStyle[ id ], id );
	};

	/**
	 * Update state for the theme context.
	 *
	 * Triggers useEffect via update of currentTheme.data.styles.
	 *
	 * @param {import('../types').Style} style
	 * @param {string}                   styleId
	 * @return {void}
	 */
	const addStyleToTheme = ( style, styleId ) => {
		currentTheme?.set( {
			...currentTheme.data,
			styles: {
				...currentTheme.data.styles,
				[ styleId ]: style,
			},
		} );
	};

	return {
		defaultStyleName,
		defaultStyle,
		newStyleName,
		setNewStyleName,
		handleNewStyle,
	};
}
