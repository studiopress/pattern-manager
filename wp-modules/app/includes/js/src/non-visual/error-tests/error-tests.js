/**
 * Genesis Studio App, non visual logic.
 */

import { backgroundColorRequired } from './background-color-required.js';
import { themeColorPalleteBackgroundColorForbidden } from './theme-color-pallete-background-color-forbidden.js';
import { themeColorPalleteTextColorForbidden } from './theme-color-pallete-text-color-forbidden.js';
import { invalidFontSize } from './invalid-font-size.js';
import { localUrlsForbidden } from './local-urls-forbidden.js';
import { headingColorRequired } from './heading-color-required.js';
import { textColorRequired } from './text-color-required.js';

export function testBlockForErrors( block ) {
	const errors = {};

	// Run the local url test
	const testLocalUrlsForbidden = localUrlsForbidden( block );
	if ( ! testLocalUrlsForbidden.success ) {
		// If it failed the test, add the error to the list of errors.
		errors.localUrlForbidden = testLocalUrlsForbidden;
	}

	// Run the invalid font size test
	const testInvalidFontSize = invalidFontSize( block );
	if ( ! testInvalidFontSize.success ) {
		// If it failed the test, add the error to the list of errors.
		errors.invalidFontSize = testInvalidFontSize;
	}

	// Run the theme color pallete text forbidden test
	const testThemeColorPalleteTextColorForbidden = themeColorPalleteTextColorForbidden(
		block
	);
	if ( ! testThemeColorPalleteTextColorForbidden.success ) {
		// If it failed the test, add the error to the list of errors.
		errors.themeColorPalleteTextColorForbidden = testThemeColorPalleteTextColorForbidden;
	}

	// Run the theme color pallete background forbidden test
	const testThemeColorPalleteBackgroundColorForbidden = themeColorPalleteBackgroundColorForbidden(
		block
	);
	if ( ! testThemeColorPalleteBackgroundColorForbidden.success ) {
		// If it failed the test, add the error to the list of errors.
		errors.themeColorPalleteBackgroundColorForbidden = testThemeColorPalleteBackgroundColorForbidden;
	}

	// Run the background color required test
	const testBackgroundColorRequired = backgroundColorRequired( block );

	if ( ! testBackgroundColorRequired.success ) {
		// If it failed the test, add the error to the list of errors.
		errors.backgroundColorRequired = testBackgroundColorRequired;
	}

	// Run the heading color required test.
	const testHeadingColorRequired = headingColorRequired( block );
	if ( ! testHeadingColorRequired.success ) {
		// If it failed the test, add the error to the list of errors.
		errors.headingColorRequired = testHeadingColorRequired;
	}

	// Run the text color required test.
	const testTextColorRequired = textColorRequired( block );
	if ( ! testTextColorRequired.success ) {
		// If it failed the test, add the error to the list of errors.
		errors.textColorRequired = testTextColorRequired;
	}

	if ( Object.keys( errors ).length > 0 ) {
		return {
			success: false,
			errors,
		};
	}

	// If there were no errors, return success.
	return {
		success: true,
	};
}

export function testPatternForErrors( patternBlocks ) {
	for ( const patternBlock in patternBlocks ) {
		const testResult = testBlockForErrors( patternBlocks[ patternBlock ] );

		// If a block has failed a test, return that error.
		if ( ! testResult.success ) {
			// Add the name of the pattern to the result
			testResult.pattern = patternBlocks[ patternBlock ].name;
			return testResult;
		}
	}

	// If no errors were found in this pattern, return success.
	return {
		success: true,
	};
}
