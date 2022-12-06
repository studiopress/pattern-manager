/* eslint-disable no-undef, camelcase */

/**
 * Mapping of pattern types and their corresponding properties in type `Theme`.
 *
 * KEY (pattern type identifier) -> VALUE (property in `Theme`):
 *  - pattern -> included_patterns
 *  - template -> template_files
 *  - template_part -> template_parts
 *
 * The mapped values (ie, 'included_patterns') are properties of `themeData`.
 *
 * @see `useThemeData`
 */
export enum ThemePatternType {
	pattern = 'included_patterns',
	template = 'template_files',
	template_part = 'template_parts',
}

export type PatternType = keyof typeof ThemePatternType;
