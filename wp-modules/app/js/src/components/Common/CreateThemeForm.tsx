import { __ } from '@wordpress/i18n';
import { ReactNode } from 'react';
import usePmContext from '../../hooks/usePmContext';
import useNoticeContext from '../../hooks/useNoticeContext';
import ThemeDetails from './ThemeDetails';

type Props = {
	children: ReactNode;
};

export default function CreateThemeForm( { children }: Props ) {
	const { currentTheme, currentThemeId, themes, currentView } =
		usePmContext();
	const { setDisplayThemeCreatedNotice } = useNoticeContext();

	return (
		<div className="mx-auto p-8 lg:p-12">
			<form
				className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10 lg:gap-20"
				onSubmit={ ( event ) => {
					event.preventDefault();
					currentTheme.save().then( () => {
						currentView.set( 'theme_setup' );
						setDisplayThemeCreatedNotice( true );
					} );
				} }
			>
				<div className="flex-initial w-full md:w-2/3">
					<ThemeDetails />
					{ children }
				</div>
			</form>
		</div>
	);
}
