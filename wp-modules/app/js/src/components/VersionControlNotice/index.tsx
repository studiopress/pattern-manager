// WP dependencies
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { Notice } from '@wordpress/components';

type Props = {
	isVisible: boolean;
	handleDismiss: () => void;
};

/** Display a notice if no version control is detected in the theme. */
export default function VersionControlNotice( {
	isVisible,
	handleDismiss,
}: Props ) {
	return isVisible ? (
		<Notice
			className="patternmanager-version-control-notice"
			isDismissible
			status="warning"
			onRemove={ handleDismiss }
		>
			{ createInterpolateElement(
				__(
					'No version control detected for this theme. We recommend adding version control so you do not lose your patterns during theme updates. <div></div>Learn how to set up git for your theme in <a></a>.',
					'pattern-manager'
				),
				{
					div: <div style={ { marginTop: '1rem' } }></div>,
					a: (
						<a
							href={
								'https://developer.wpengine.com/knowledge-base/using-git-with-a-wordpress-theme/'
							}
						>
							{ __( 'our Git Guide', 'pattern-manager' ) }
						</a>
					),
				}
			) }
		</Notice>
	) : null;
}
