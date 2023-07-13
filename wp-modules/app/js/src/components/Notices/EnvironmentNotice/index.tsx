// WP dependencies
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { Notice, Dashicon } from '@wordpress/components';

type Props = {
	isVisible: boolean;
	handleDismiss: () => void;
};

/** Display a notice if no version control is detected in the theme. */
export default function EnvironmentNotice( {
	isVisible,
	handleDismiss,
}: Props ) {
	return isVisible ? (
		<Notice
			className="patternmanager-notice"
			isDismissible
			status="info"
			onRemove={ handleDismiss }
		>
			{ createInterpolateElement(
				__(
					'A local development environment was not detected. Pattern Manager is not intended for use on a live site. <div></div>Download <a></a>.',
					'pattern-manager'
				),
				{
					div: <div style={ { marginTop: '1rem' } }></div>,
					a: (
						<a
							href="https://localwp.com/?modal=download"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Download Local by WP Engine (opens in new tab)"
						>
							{ __( 'Local by WP Engine', 'pattern-manager' ) }
							<span className="screen-reader-text">
								{ __(
									'(opens in a new tab)',
									'pattern-manager'
								) }
							</span>
							<Dashicon icon={ 'external' } />
						</a>
					),
				}
			) }
		</Notice>
	) : null;
}
