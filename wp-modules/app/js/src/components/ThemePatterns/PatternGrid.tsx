// WP dependencies
import { __ } from '@wordpress/i18n';
import { Icon, close, copy, edit } from '@wordpress/icons';

// Context
import usePmContext from '../../hooks/usePmContext';

// Globals
import { patternmanager } from '../../globals';

// Components
import PatternPreview from '../PatternPreview';

// Utils
import getDuplicatePattern from '../../utils/getDuplicatePattern';
import { Patterns, Pattern } from '../../types';

type props = {
	themePatterns: Patterns;
	currentCategory: string;
	categoryToAlwaysInclude: string;
};

export default function PatternGrid( {
	themePatterns,
	currentCategory,
	categoryToAlwaysInclude,
}: props ) {
	const { currentTheme, currentView, currentPatternId } = usePmContext();

	return (
		<div className="inner-grid">
			{ Object.entries( themePatterns ?? {} ).map(
				( [ patternName, patternData ]: [ string, Pattern ] ) => {
					if (
						! patternData?.categories?.includes(
							currentCategory
						) &&
						currentCategory !== categoryToAlwaysInclude
					) {
						return null;
					}

					return (
						<div key={ patternName } className="grid-item">
							<div className="item-inner">
								<button
									type="button"
									className="item-delete-button"
									aria-label={ __(
										'Delete pattern',
										'pattern-manager'
									) }
									onClick={ () => {
										currentTheme.deletePattern(
											patternName
										);
									} }
								>
									<Icon
										className="item-icon"
										icon={ close }
										size={ 30 }
									/>
								</button>
								<button
									type="button"
									className="item-edit-button"
									aria-label={ __(
										'Edit Pattern',
										'pattern-manager'
									) }
									onClick={ () => {
										currentPatternId.set( patternName );
										currentView.set( 'pattern_editor' );
									} }
								>
									<Icon
										className="item-icon"
										icon={ edit }
										size={ 30 }
									/>
								</button>

								<button
									type="button"
									className="item-duplicate-button"
									aria-label={ __(
										'Duplicate Pattern',
										'pattern-manager'
									) }
									onClick={ () => {
										const newPattern = getDuplicatePattern(
											patternData,
											Object.values( themePatterns ?? {} )
										);
										currentTheme
											.createPattern( newPattern )
											.then( () => {
												currentPatternId.set(
													newPattern.slug
												);
												currentView.set(
													'pattern_editor'
												);
											} );
									} }
								>
									<Icon
										className="item-icon"
										icon={ copy }
										size={ 30 }
									/>
								</button>

								<div className="item-pattern-preview">
									<PatternPreview
										key={ patternName }
										url={
											patternmanager.siteUrl +
											'?pm_pattern_preview=' +
											patternData.name
										}
										scale={ 0.2 }
									/>
								</div>
							</div>
							<div className="item-pattern-preview-heading">
								<span>{ patternData.title }</span>
							</div>
						</div>
					);
				}
			) }
		</div>
	);
}
