import React from 'react';

// WP Dependencies.
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, close, copy, edit, external } from '@wordpress/icons';

import usePmContext from '../../hooks/usePmContext';

// Components
import PatternPreview from '../PatternPreview';

// Globals
import { patternmanager } from '../../globals';

// Utils
import getDuplicatePattern from '../../utils/getDuplicatePattern';
import { Pattern } from '../../types';

type Props = {
	isVisible: boolean;
};

export default function ThemePatterns( { isVisible }: Props ) {
	const { patterns, currentView, currentPatternId } = usePmContext();

	if ( ! isVisible || ! patterns.data ) {
		return null;
	}

	return (
		<div hidden={ ! isVisible } className="patternmanager-theme-patterns">
			<div className="patterns-container">
				<div className="container-outer-flex">
					<div className="container-inner">
						<>
							<div className="inner-grid">
								{ Object.entries( patterns.data ).length ===
								0 ? (
									<div className="grid-empty">
										{ createInterpolateElement(
											__(
												'No patterns added yet. Click the <span></span> button to start creating and adding patterns.',
												'pattern-manager'
											),
											{
												span: (
													<strong>
														{ __(
															'Create New Pattern',
															'pattern-manager'
														) }
													</strong>
												),
											}
										) }
									</div>
								) : null }
								{ Object.entries( patterns.data ).map(
									( [ patternName, patternData ]: [
										string,
										Pattern
									] ) => {
										return (
											<div
												key={ patternName }
												className="grid-item"
											>
												<div className="item-inner">
													<button
														type="button"
														className="item-delete-button"
														aria-label={ __(
															'Delete pattern',
															'pattern-manager'
														) }
														onClick={ () => {
															patterns.deletePattern(
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
															currentPatternId.set(
																patternName
															);
															currentView.set(
																'pattern_editor'
															);
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
															const newPattern =
																getDuplicatePattern(
																	patternData,
																	Object.values(
																		patterns.data
																	)
																);
															patterns
																.createPattern(
																	newPattern
																)
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
													<h2>
														{ patternData.title }
													</h2>
												</div>
											</div>
										);
									}
								) }
							</div>
						</>
					</div>
				</div>
			</div>
		</div>
	);
}
