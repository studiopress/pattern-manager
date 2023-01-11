import { __ } from '@wordpress/i18n';
import usePmContext from '../../hooks/usePmContext';
import imgThemeTemplate from '../../../../img/theme-templates.svg';
import imgThemeTemplateParts from '../../../../img/theme-template-parts.svg';
import imgThemePatterns from '../../../../img/theme-patterns.svg';
import imgThemeJson from '../../../../img/theme-themejson.svg';
import imgThemeStyleVariations from '../../../../img/theme-style-variations.svg';
import imgThemeExport from '../../../../img/theme-export.svg';

export default function ThemeOverview() {
	const { currentTheme, currentView } = usePmContext();

	return (
		<div className="grid grid-cols-1 gap-y-10 gap-x-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
			<div className="group bg-pm-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue pb-0">
					<img
						alt={ __( 'Edit Theme Templates', 'pattern-manager' ) }
						className="w-full"
						src={ imgThemeTemplate }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h2 className="text-2xl font-semibold">
							{ __( 'Theme Templates', 'pattern-manager' ) }
						</h2>
						<p className="text-base">
							{ __(
								'Use theme template files to affect the layout and design of different parts of your website, like pages and posts.',
								'pattern-manager'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentView.set( 'theme_templates' );
							} }
						>
							{ __(
								'Edit Theme Templates →',
								'pattern-manager'
							) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md hidden">
					{ __( 'Your theme has no templates', 'pattern-manager' ) }
				</div>
			</div>

			<div className="group bg-pm-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue pb-0">
					<img
						alt={ __(
							'Edit Theme Template Parts',
							'pattern-manager'
						) }
						className="w-full"
						src={ imgThemeTemplateParts }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h2 className="text-2xl font-semibold">
							{ __( 'Template Parts', 'pattern-manager' ) }
						</h2>
						<p className="text-base">
							{ __(
								'Template parts, such as a site header and footer, can be used as common elements across templates.',
								'pattern-manager'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentView.set( 'template_parts' );
							} }
						>
							{ __( 'Edit Template Parts →', 'pattern-manager' ) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md hidden">
					{ __(
						'Your theme has no template parts',
						'pattern-manager'
					) }
				</div>
			</div>

			<div className="group bg-pm-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue">
					<img
						alt="Edit Theme Patterns"
						className="w-full"
						src={ imgThemePatterns }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h2 className="text-2xl font-semibold">
							{ __( 'Theme Patterns', 'pattern-manager' ) }
						</h2>
						<p className="text-base">
							{ __(
								'Create, edit, and manage patterns (pre-configured designs), to be used across your theme.',
								'pattern-manager'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentView.set( 'theme_patterns' );
							} }
						>
							{ __( 'Edit Theme Patterns →', 'pattern-manager' ) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md hidden">
					{ __( 'Your theme has no patterns', 'pattern-manager' ) }
				</div>
			</div>

			<div className="group bg-pm-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue pb-0">
					<img
						alt="Theme.json"
						className="w-full"
						src={ imgThemeJson }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h2 className="text-2xl font-semibold">
							{ __( 'Styles and Settings', 'pattern-manager' ) }
						</h2>
						<p className="text-base">
							{ __(
								'Use this tool to configure the theme.json file and set your theme styles and block settings.',
								'pattern-manager'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentView.set( 'themejson_editor' );
							} }
						>
							{ __( 'Edit Theme.json →', 'pattern-manager' ) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md hidden">
					{ __(
						'Your theme.json file is unedited',
						'pattern-manager'
					) }
				</div>
			</div>

			<div className="group bg-pm-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue">
					<img
						alt="Theme Style Variations"
						className="w-full max-w-[260px] mx-auto"
						src={ imgThemeStyleVariations }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h2 className="text-2xl font-semibold">
							{ __( 'Style Variations', 'pattern-manager' ) }
						</h2>
						<p className="text-base">
							{ __(
								'Create, edit, and save a variety of swappable theme settings and styles in your theme.json file.',
								'pattern-manager'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentView.set( 'themejson_editor' );
							} }
						>
							{ __(
								'Edit Style Variations →',
								'pattern-manager'
							) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md hidden">
					{ __(
						'Your theme has no style variations',
						'pattern-manager'
					) }
				</div>
			</div>

			<div className="group bg-pm-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue">
					<img
						alt="Export Theme"
						className="w-full max-w-[260px] mx-auto"
						src={ imgThemeExport }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h2 className="text-2xl font-semibold">
							{ __( 'Download Theme Zip', 'pattern-manager' ) }
						</h2>
						<p className="text-base">
							{ __(
								"Once you've finished editing your theme, you can export to a zip or use git to manage it.",
								'pattern-manager'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentTheme.export();
							} }
						>
							{ __( 'Download Theme', 'pattern-manager' ) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md hidden">
					{ __(
						'You can also view your theme files',
						'pattern-manager'
					) }
				</div>
			</div>
		</div>
	);
}
