import { v4 as uuidv4 } from 'uuid';

// WP Dependencies.
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, close, edit, plus } from '@wordpress/icons';

import useStudioContext from '../../hooks/useStudioContext';

// Components
import PatternPreview from '../PatternPreview';

// Globals
import { fsestudio } from '../../globals';

/** @param {{isVisible: boolean}} props */
export default function ThemePatterns( { isVisible } ) {
	const { currentTheme, currentView, currentPatternId } = useStudioContext();

	if ( ! currentTheme.data ) {
		return '';
	}

	return (
		<div hidden={ ! isVisible } className="w-full">
			<div className="bg-fses-gray mx-auto p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl mb-3">
						{ __( 'Theme Patterns', 'fse-studio' ) }
					</h1>
					<p className="text-lg max-w-2xl">
						Add patterns to your theme. You can create patterns from
						scratch using the Create New Pattern button, and you can
						also duplicate Studio patterns as a start.
					</p>
				</div>
			</div>

			<div className="mx-auto p-12">
				<div className="mx-auto max-w-7xl flex justify-between gap-20">
					<div className="w-[65%]">
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
												// onClick={ }
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
												<h3 className="text-sm bg-white p-4 rounded-b">
													{ patternData.title }
												</h3>
											</div>
										</div>
									);
								} ) }
							</div>
						</>
					</div>

					<div className="flex-1 text-base">
						<div className="bg-fses-gray p-8 gap-6 flex flex-col rounded mb-5">
							<div>
								<h4 className="mb-2 font-medium">
									Create new patterns
								</h4>
								<p className="text-base mb-5">
									Create new patterns for your theme using the
									button below. Patterns will appear on this
									page as you create them.
								</p>
								<button
									className="w-full items-center px-4 py-2 border-4 border-transparent font-medium text-center rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
									onClick={ () => {
										const newPatternId = uuidv4();

										const newPatternData = {
											type: 'pattern',
											title: 'My New Pattern',
											name: newPatternId,
											categories: [],
											viewportWidth: '',
											content: '',
										};

										currentTheme
											.createPattern( newPatternData )
											.then( () => {
												// Switch to the newly created theme.
												currentPatternId.set(
													newPatternId
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
								<h4 className="mb-2 font-medium">
									Setting up patterns
								</h4>
								<p className="text-base">
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit, sed do eiusmod tempor
									incididunt ut labore et dolore magna aliqua.
									Ut enim ad minim veniam, quis nostrud
									exercitation ullamco laboris nisi ut aliquip
									ex ea commodo consequat.{ ' ' }
								</p>
							</div>
							<div>
								<h4 className="mb-2 font-medium">
									Helpful Documentation
								</h4>
								<ul>
									<li>
										<a className="text-wp-blue" href="/">
											Full Site Editing Documentation
										</a>
									</li>
									<li>
										<a className="text-wp-blue" href="/">
											About Full Site Editing Themes
										</a>
									</li>
									<li>
										<a className="text-wp-blue" href="/">
											Something Else
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
