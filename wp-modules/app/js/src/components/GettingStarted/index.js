// @ts-check
import { __ } from '@wordpress/i18n';
import image from '../../../../img/video-placeholder.jpg';
import FseStudioContext from '../../contexts/FseStudioContext';
import useStudioContext from '../../hooks/useStudioContext';

export default function GettingStarted() {

	const { themes, currentThemeId } = useStudioContext();

	return (
		<>
			<div className="bg-fses-gray mx-auto p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl mb-3">{ __( 'Welcome to FSE Studio', 'fse-studio' ) }</h1>
					<p className="text-lg max-w-2xl">Build your full site editing themes faster and easier with FSE Studio! Check out the video below to learn how to get started.</p>
				</div>
			</div>

			<div className="mx-auto p-14 pb-20">
				<div className="mx-auto max-w-7xl flex flex-col justify-between gap-20">
					<div className="w-full">
						<img className="rounded-md" src={ image } />
					</div>
					
					<div className="grid grid-cols-2 gap-10">
						<div>
							<h2 className="text-4xl mb-3">Create your first theme</h2>
							<p className="text-lg mb-3">Donec ac leo condimentum, feugiat lacus in, euismod magna. Curabitur in gravida justo. Vestibulum cursus, elit in rutrum hendrerit, dui nunc.</p>
							<p className="text-lg mb-3">Donec ac leo condimentum, feugiat lacus in, euismod magna. Curabitur in gravida justo. Vestibulum cursus, elit in rutrum hendrerit.</p>
						</div>
						<div className="bg-fses-gray p-20 items-center justify-center flex flex-col rounded">
							<button
								type="button"
								className="inline-flex items-center px-4 py-2 border-4 border-transparent text-lg font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
								onClick={ () => {
									/** @type {import('../../hooks/useThemeData').Theme} */
									const newThemeData = {
										name: 'My New Theme',
										dirname: 'my-new-theme',
										namespace: 'MyNewTheme',
										uri: 'mysite.com',
										author: 'Me',
										author_uri: 'mysite.com',
										description: 'My new FSE Theme',
										tags: '',
										tested_up_to: '5.9',
										requires_wp: '5.9',
										requires_php: '7.3',
										version: '1.0.0',
										text_domain: 'my-new-theme',
										theme_json_file: fsestudio.themeJsonFiles.default,
										included_patterns: [],
										template_files: {
											index: 'homepage',
											404: null,
											archive: null,
											single: null,
											page: null,
											search: null,
										},
									};

									themes.setThemes( {
										...themes.themes,
										'my-new-theme': newThemeData,
									} );

									// Switch to the newly created theme.
									currentThemeId.set( 'my-new-theme' );
								} }
							>
								{ __( 'Start Creating Your Theme', 'fse-studio' ) } &rarr;
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
