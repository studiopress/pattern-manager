import { __ } from '@wordpress/i18n';
import useStudioContext from '../../hooks/useStudioContext';
import imgThemeTemplate from '../../../../img/theme-templates.svg';
import imgThemeTemplateParts from '../../../../img/theme-template-parts.svg';
import imgThemePatterns from '../../../../img/theme-patterns.svg';
import imgThemeJson from '../../../../img/theme-themejson.svg';
import imgThemeStyleVariations from '../../../../img/theme-style-variations.svg';
import imgThemeExport from '../../../../img/theme-export.svg';

export default function ThemeOverview() {
	const { currentTheme, currentView } = useStudioContext();

	return (
		<div className="grid grid-cols-1 gap-y-10 gap-x-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
			<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue pb-0">
					<img
						alt={ __( 'Theme Templates', 'fse-studio' ) }
						className="w-full"
						src={ imgThemeTemplate }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h3 className="text-2xl font-semibold">
							{ __( 'Theme Templates', 'fse-studio' ) }
						</h3>
						<p className="text-base">
							{ __(
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
								'fse-studio'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentView.set( 'theme_templates' );
							} }
						>
							{ __( 'Edit Theme Templates →', 'fse-studio' ) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
					{ __( 'Your theme has no templates', 'fse-studio' ) }
				</div>
			</div>

			<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue pb-0">
					<img
						alt={ __( 'Theme Template Parts', 'fse-studio' ) }
						className="w-full"
						src={ imgThemeTemplateParts }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h3 className="text-2xl font-semibold">
							{ __( 'Template Parts', 'fse-studio' ) }
						</h3>
						<p className="text-base">
							{ __(
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
								'fse-studio'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentView.set( 'template_parts' );
							} }
						>
							{ __( 'Edit Template Parts →', 'fse-studio' ) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
					{ __( 'Your theme has no template parts', 'fse-studio' ) }
				</div>
			</div>

			<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue">
					<img
						alt="Theme Patterns"
						className="w-full"
						src={ imgThemePatterns }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h3 className="text-2xl font-semibold">
							{ __( 'Theme Patterns', 'fse-studio' ) }
						</h3>
						<p className="text-base">
							{ __(
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
								'fse-studio'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentView.set( 'theme_patterns' );
							} }
						>
							{ __( 'Edit Theme Patterns →', 'fse-studio' ) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
					{ __( 'Your theme has no patterns', 'fse-studio' ) }
				</div>
			</div>

			<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue pb-0">
					<img
						alt="Theme.json"
						className="w-full"
						src={ imgThemeJson }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h3 className="text-2xl font-semibold">
							{ __( 'Theme.json', 'fse-studio' ) }
						</h3>
						<p className="text-base">
							{ __(
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
								'fse-studio'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentView.set( 'themejson_editor' );
							} }
						>
							{ __( 'Edit Theme.json →', 'fse-studio' ) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
					{ __( 'Your theme.json file is unedited', 'fse-studio' ) }
				</div>
			</div>

			<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue">
					<img
						alt="Theme Style Variations"
						className="w-full max-w-[260px] mx-auto"
						src={ imgThemeStyleVariations }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h3 className="text-2xl font-semibold">
							{ __( 'Style Variations', 'fse-studio' ) }
						</h3>
						<p className="text-base">
							{ __(
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
								'fse-studio'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentView.set( 'themejson_editor' );
							} }
						>
							{ __( 'Edit Style Variations →', 'fse-studio' ) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
					{ __( 'Your theme has no style variations', 'fse-studio' ) }
				</div>
			</div>

			<div className="group bg-fses-gray rounded-md flex justify-between flex-col">
				<div className="w-full p-10 rounded-t-md overflow-hidden bg-wp-blue">
					<img
						alt="Export Theme"
						className="w-full max-w-[260px] mx-auto"
						src={ imgThemeExport }
					/>
				</div>
				<div className="flex justify-between p-10 text-center">
					<div className="flex flex-col gap-5">
						<h3 className="text-2xl font-semibold">
							{ __( 'Download Theme Zip', 'fse-studio' ) }
						</h3>
						<p className="text-base">
							{ __(
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
								'fse-studio'
							) }
						</p>
						<button
							type="button"
							className="text-wp-blue hover:underline font-medium"
							onClick={ () => {
								currentTheme.export();
							} }
						>
							{ __( 'Download Theme', 'fse-studio' ) }
						</button>
					</div>
				</div>
				<div className="bg-[#E9E8E8] text-center p-4 text-gray-500 rounded-b-md">
					{ __( 'You can also view your theme files', 'fse-studio' ) }
				</div>
			</div>
		</div>
	);
}
