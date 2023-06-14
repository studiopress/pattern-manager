// WP dependencies
import { __ } from '@wordpress/i18n';

// External dependencies
import loadable from '@loadable/component';

// Globals
import { patternManager } from '../../globals';

// Hooks
import useForceRerender from '../../hooks/useForceRerender';

// Components
const PatternPreview: PatternPreviewType = loadable(
	async () => import( '../PatternPreview' )
);

// Types
import type { Patterns, Site, PatternsProps } from '../../types';
import type { PatternPreviewType } from '../PatternPreview';

type Props = Pick< PatternsProps, 'onSelectPattern' | 'PatternActions' > & {
	patterns: Patterns;
	site: Site;
	appUrl:string;
};

/** Render the patterns in a grid, or a message if no patterns are found. */
export default function PatternGrid( {
	onSelectPattern,
	PatternActions,
	patterns,
	site,
	appUrl,
}: Props ) {
	useForceRerender( [ patterns ] );

	return (
		<>
			{ ! Object.entries( patterns ?? {} ).length ? (
				<div className="grid-no-patterns-found">
					{ __( 'No patterns found.', 'pattern-manager' ) }
				</div>
			) : (
				Object.entries( patterns ?? {} ).map(
					( [ patternName, patternData ] ) => {
						return (
							<div
								role={ onSelectPattern ? 'button' : undefined }
								key={ patternName }
								onClick={ () =>
									onSelectPattern?.( patternData )
								}
								onKeyDown={ () =>
									onSelectPattern?.( patternData )
								}
								className="grid-item"
								aria-label={ patternData.title }
							>
								<div className="item-inner">
									<div className="item-pattern-preview">
										<PatternPreview
											key={ patternName }
											url={
												appUrl +
												'?pattern_name=' +
												patternData.name + 
												'&site_key=' + site.localWpData.id
											}
											viewportWidth={
												patternData.viewportWidth ||
												1280
											}
										/>
									</div>
								</div>
								{ PatternActions ? (
									<PatternActions
										patternData={ patternData }
									/>
								) : null }
								<div className="item-pattern-preview-heading">
									<span>{ patternData.title }</span>
								</div>
							</div>
						);
					}
				)
			) }
		</>
	);
}
