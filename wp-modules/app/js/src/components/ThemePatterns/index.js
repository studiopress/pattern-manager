// WP Dependencies.
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, close, edit, plus } from '@wordpress/icons';

import useStudioContext from '../../hooks/useStudioContext';

// Components
import PatternPreview from '../PatternPreview';

// Globals
import { fsestudio } from '../../globals';

// Utils
import getNextHighNumber from '../../utils/getNextHighNumber';
import convertToSlug from '../../utils/convertToSlug';

/** @param {{isVisible: boolean}} props */
export default function ThemePatterns( { isVisible } ) {
	const { currentTheme, currentView, currentPatternId } = useStudioContext();

	if ( ! isVisible || ! currentTheme.data ) {
		return '';
	}

	return (
		<div hidden={ ! isVisible } className="w-full">
			<div className="bg-fses-gray p-8 lg:p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl mb-3">
						{ __( 'Patterns', 'fse-studio' ) }
					</h1>
					<p className="text-lg max-w-2xl">
						Add patterns to your theme. You can create patterns from
						scratch using the Create New Pattern button, and you can
						also duplicate Studio patterns as a start.
					</p>
				</div>
			</div>

			<div className="mx-auto p-8 lg:p-12">
				<div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10 lg:gap-20">
					<div className="flex-initial w-full md:w-2/3">
						<>
							<div className="grid w-full grid-cols-2 gap-5">
								{ Object.entries(
									currentTheme?.data?.included_patterns ?? {}
								).length === 0 ? (
									<div className="bg-fses-gray p-10 text-center w-full col-span-2 rounded">
										{ createInterpolateElement(
											__(
												'No patterns added yet. Click the <span></span> button to start creating and adding patterns.',
												'fse-studio'
											),
											{
												span: (
													<strong>
														{ __(
															'Create A New Pattern',
															'fse-studio'
														) }
													</strong>
												),
											}
										) }
									</div>
								) : null }
								{ Object.entries(
									currentTheme?.data?.included_patterns ?? {}
								).map( ( [ patternName, patternData ] ) => {
									return (
										<div
											key={ patternName }
											className="min-h-[300px] bg-gray-100 flex flex-col justify-between border border-gray-200 rounded relative group"
										>
											<button
												type="button"
												className="absolute top-2 right-2 z-50"
												aria-label={ __(
													'Delete pattern',
													'fse-studio'
												) }
												onClick={ () => {
													currentTheme.deletePattern(
														patternName
													);
												} }
											>
												<Icon
													className="text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300 opacity-0 group-hover:opacity-100"
													icon={ close }
													size={ 30 }
												/>
											</button>
											<button
												type="button"
												className="absolute top-2 left-2 z-50"
												aria-label={ __(
													'Edit Pattern',
													'fse-studio'
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
													className="text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300 opacity-0 group-hover:opacity-100"
													icon={ edit }
													size={ 30 }
												/>
											</button>

											<button
												type="button"
												className="absolute bottom-16 left-2 z-50"
												aria-label={ __(
													'Duplicate Pattern',
													'fse-studio'
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
													className="text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300 opacity-0 group-hover:opacity-100"
													icon={ plus }
													size={ 30 }
												/>
											</button>

											<div className="p-3 flex flex-grow items-center z-0">
												<PatternPreview
													key={ patternName }
													url={
														fsestudio.siteUrl +
														'?fsestudio_pattern_preview=' +
														patternData.post_id
													}
													scale={ 0.2 }
												/>
											</div>
											<div>
												<h2 className="text-sm bg-white p-4 rounded-b">
													{ patternData.title }
												</h2>
											</div>
										</div>
									);
								} ) }
							</div>
						</>
					</div>

					<div className="flex-1 w-full md:w-1/3 text-base">
						<div className="bg-fses-gray p-8 gap-6 flex flex-col rounded mb-5">
							<div>
								<h2 className="sr-only">
									{ __( 'Pattern Creation', 'fse-studio' ) }
								</h2>
								<h3 className="mb-2 font-medium">
									Create new patterns
								</h3>
								<p className="text-base mb-5">
									Create new patterns for your theme using the
									button below. Patterns will appear on this
									page as you create them.
								</p>
								<button
									className="w-full items-center px-4 py-2 border-4 border-transparent font-medium text-center rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
									onClick={ () => {
										// Get the number for the next pattern title/slug.
										const newPatternNumber =
											getNextHighNumber(
												currentTheme?.data
													?.included_patterns,
												'slug'
											);

										const newPatternTitle = newPatternNumber
											? `My New Pattern ${ newPatternNumber }`
											: 'My New Pattern';

										const newPatternName =
											convertToSlug( newPatternTitle );

										const newPatternData = {
											type: 'pattern',
											title: newPatternTitle,
											name: newPatternName,
											categories: [],
											viewportWidth: '',
											content: '',
										};

										currentTheme
											.createPattern( newPatternData )
											.then( () => {
												// Switch to the newly created theme.
												currentPatternId.set(
													newPatternName
												);
												currentView.set(
													'pattern_editor'
												);
											} );
									} }
								>
									{ __(
										'Create A New Pattern',
										'fse-studio'
									) }
								</button>
							</div>
						</div>

						<div className="bg-fses-gray p-8 gap-6 flex flex-col rounded">
							<div>
								<h2 className="sr-only">
									{ __( 'Documentation', 'fse-studio' ) }
								</h2>
								<h3 className="mb-2 font-medium">
									Working with patterns
								</h3>
								<p className="text-base">
									Block patterns are predefined block layouts
									that make up your website. A pattern can be
									something as small as a feature box, or it
									can be the header of your site. Patterns
									help you quickly build out your website.
								</p>
							</div>
							<div>
								<h3 className="mb-2 font-medium">
									Helpful Documentation
								</h3>
								<ul>
									<li>
										<a
											className="text-wp-blue"
											href="https://wordpress.tv/2022/06/13/nick-diego-builder-basics-everything-you-need-to-know-about-patterns/"
										>
											Exploring Block Patterns Video
										</a>
									</li>
									<li>
										<a
											className="text-wp-blue"
											href="https://developer.wordpress.org/block-editor/how-to-guides/themes/block-theme-overview/"
										>
											Block Theme Overview
										</a>
									</li>
									<li>
										<a
											className="text-wp-blue"
											href="https://developer.wordpress.org/block-editor/"
										>
											Block Editor Handbook
										</a>
									</li>
									<li>
										<a
											className="text-wp-blue"
											href="https://wordpress.tv/2022/03/28/nick-diego-builder-basics-exploring-block-layout-alignment-dimensions-and-spac/"
										>
											Block Builder Basics Video
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
