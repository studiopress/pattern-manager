// WP dependencies
import { __ } from '@wordpress/i18n';
import { lazy, Suspense } from '@wordpress/element';

// Components
const PatternGridItem = lazy( () => import( './PatternGridItem' ) );

// Types
import type { Patterns } from '../../types';

type Props = {
	themePatterns: Patterns;
};

/** Render the patterns in a grid, or a message if no patterns are found. */
export default function PatternGrid( { themePatterns }: Props ) {
	return (
		<>
			{ ! Object.entries( themePatterns ?? {} ).length ? (
				<div className="grid-no-patterns-found">
					{ __( 'No patterns found.', 'pattern-manager' ) }
				</div>
			) : (
				Object.entries( themePatterns ?? {} ).map(
					( [ patternName, patternData ] ) => {
						return (
							<Suspense key={ patternName } fallback={ null }>
								<PatternGridItem
									themePatterns={ themePatterns }
									patternName={ patternName }
									patternData={ patternData }
								/>
							</Suspense>
						);
					}
				)
			) }
		</>
	);
}
