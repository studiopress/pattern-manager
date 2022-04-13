// @ts-check

import { __ } from '@wordpress/i18n';

/** @param {{visible: boolean}} props */
export default function FseStudioHelp( { visible } ) {
	return (
		<div hidden={ ! visible } className="p-12">
			<div className="max-w-7xl mx-auto bg-white shadow">
				<h1 className="p-5 text-xl border-b border-gray-200 px-4 sm:px-6 md:px-8">
					{ __( `Learn about FSE Studio`, 'fse-studio' ) }
				</h1>
				<div className="px-4 sm:px-6 md:px-8 py-8">
					<h1 className="p-5 text-5xl px-4 sm:px-6 md:px-8">
						{ __( `Welcome to FSE Studio! Let's Get Started.`, 'fse-studio' ) }
					</h1>
					<p className="text-base p-5 px-4 sm:px-6 md:px-8">
						{ __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'fse-studio' ) }
					</p>
					<p className="text-base p-5 px-4 sm:px-6 md:px-8">
						{ __( 'Purus ut faucibus pulvinar elementum integer enim neque volutpat. Sit amet purus gravida quis blandit turpis cursus in hac. Sed blandit libero volutpat sed. Sit amet dictum sit amet justo donec. Pretium fusce id velit ut tortor pretium viverra suspendisse potenti. Nulla facilisi morbi tempus iaculis urna id. Sed id semper risus in hendrerit gravida rutrum quisque. Penatibus et magnis dis parturient montes nascetur ridiculus. Lacus vestibulum sed arcu non odio euismod lacinia. Diam in arcu cursus euismod. Urna et pharetra pharetra massa massa ultricies mi. Blandit cursus risus at ultrices mi. Nascetur ridiculus mus mauris vitae. Egestas erat imperdiet sed euismod. Morbi tristique senectus et netus et malesuada fames ac. Dui accumsan sit amet nulla facilisi morbi tempus iaculis urna. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam. Eu nisl nunc mi ipsum faucibus vitae aliquet.', 'fse-studio' ) }
					</p>
				</div>
			</div>
		</div>
	);
}
