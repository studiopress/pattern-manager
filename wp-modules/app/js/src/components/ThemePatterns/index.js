import { v4 as uuidv4 } from 'uuid';

// WP Dependencies.
import {
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Icon,
	layout,
	file,
	globe,
	check,
	download,
	close,
	edit,
	plus,
} from '@wordpress/icons';

import useStudioContext from '../../hooks/useStudioContext';

// Components
import PatternPreview from '../PatternPreview';

/** @param {{isVisible: boolean}} props */
export default function ThemePatterns( { isVisible } ) {
	const {
		themes,
		currentTheme,
		currentView,
		currentPatternId,
	} = useStudioContext();

	const [ isModalOpen, setModalOpen ] = useState( false );
	
	if ( ! currentTheme.data ) {
		return '';
	}

	return (
		<div hidden={ ! isVisible } className="w-full">
			<div className="w-full flex flex-col">
				<div className="flex">
					<h3 className="my-6 block text-base font-medium text-gray-700 sm:col-span-1">
						{ __(
							'Patterns included in this theme:',
							'fse-studio'
						) }
					</h3>
					<button
						className="inline-flex items-center px-4 py-2 border border-4 border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#4c5a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
						onClick={() => {
							const newPatternId = uuidv4();

							const newPatternData = {
								type: 'custom',
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
									currentPatternId.set( newPatternId );
									currentView.set('pattern_editor');
								} );
							}}
					>{ __( 'Create New Pattern', 'fse-studio' ) }</button>
				</div>
				
					<>
						<div className="grid w-full grid-cols-3 gap-5">
							{ Object.entries( currentTheme?.data?.included_patterns ).map(
								( [patternName, patternData] ) => {
									return (
										<div
											key={ patternName }
											className="min-h-[300px] bg-gray-100 flex flex-col justify-between border border-gray-200 rounded relative group"
										>
											<button
												type="button"
												className="absolute top-2 right-2"
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
												className="absolute top-2 left-2"
												 onClick={() => {
													currentPatternId.set( patternName );
													currentView.set( 'pattern_editor' );
												 }}
											>
												<Icon
													className="text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300 opacity-0 group-hover:opacity-100"
													icon={ edit }
													size={ 30 }
												/>
											</button>
											<button
												type="button"
												className="absolute bottom-16 left-2"
												 onClick={() => {
													currentPatternId.set( patternName );
													currentView.set( 'pattern_editor' );
												 }}
											>
												<Icon
													className="text-black fill-current p-1 bg-white shadow-sm rounded hover:text-red-500 ease-in-out duration-300 opacity-0 group-hover:opacity-100"
													icon={ plus }
													size={ 30 }
												/>
											</button>

											<div className="p-3 flex flex-grow items-center">
												<PatternPreview
													key={ patternName }
													blockPatternData={patternData}
													scale={ 0.2 }
												/>
											</div>
											<div>
												<h3 className="text-sm bg-white p-4 rounded-b">
													{
														patternData.title
													}
												</h3>
											</div>
										</div>
									);
								}
							) }
						</div>
					</>
				
			</div>
		</div>
	);
}