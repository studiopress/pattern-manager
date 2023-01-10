import { __ } from '@wordpress/i18n';
import useStudioContext from '../../hooks/useStudioContext';
import createNewTheme from '../../utils/createNewTheme';

export default function GettingStarted() {
	const { themes, currentThemeId, currentView } = useStudioContext();

	return (
		<>
			<div className="bg-fses-gray mx-auto p-8 lg:p-12 w-full">
				<div className="max-w-7xl mx-auto">
					<div className="flex">
						<div className="grow">
							<h1 className="text-4xl mb-3">
								{__('Welcome to Pattern Manager', 'pattern-manager')}
							</h1>
							<p className="text-lg max-w-2xl">
								Build your full site editing themes faster and
								easier with Pattern Manager! Check out the video
								below to learn how to get started.
							</p>
						</div>
						<div className="flex">
							<button
								type="button"
								className="inline-flex self-center items-center px-4 py-2 border-4 border-transparent text-lg font-medium rounded-sm shadow-sm text-white bg-wp-blue hover:bg-wp-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
								onClick={() => {
									createNewTheme(themes, currentThemeId);
									currentView?.set('create_theme');
								}}
							>
								{__(
									'Start Creating Your Theme',
									'pattern-manager'
								)}{' '}
								&rarr;
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto p-14 pb-20">
				<div className="mx-auto max-w-7xl flex flex-col justify-between gap-20">
					<div className="w-full">
						<iframe
							width="1280"
							height="720"
							src="https://www.youtube.com/embed/LmvPkQkjq9I?cc_load_policy=1&cc_lang_pref=en"
							title={__(
								'Pattern Manager Demo Video',
								'pattern-manager'
							)}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</div>
				</div>
			</div>
		</>
	);
}
