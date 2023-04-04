import { useState } from '@wordpress/element';
import { Icon, copy, check } from '@wordpress/icons';
import {
	Card,
	CardBody,
	CardHeader,
	ClipboardButton,
} from '@wordpress/components';
import RegistrationTextPreview from './RegistrationTextPreview';
import getCategoryRegistrationText from '../../../utils/getCategoryRegistrationText';

import { AdditionalSidebarProps } from '../types';

export default function CategoryRegistration( {
	categoryOptions,
}: AdditionalSidebarProps< 'categoryOptions' > ) {
	const [ hasCopied, setHasCopied ] = useState( false );
	const textToCopy = getCategoryRegistrationText( categoryOptions );

	return (
		<>
			<Card
				status="warning"
				style={ { marginTop: '15px', borderRadius: '3px' } }
			>
				<CardBody style={ { background: '#ffffdf' } }>
					Heads up, you need to register these categories in your
					theme. Add them to your theme with the following code.
				</CardBody>
			</Card>
			<Card style={ { marginTop: '15px', borderRadius: '3px' } }>
				<CardHeader style={ { background: '#e6e5e5' } }>
					<span>Add to functions.php</span>
					<ClipboardButton
						isTertiary
						text={ textToCopy }
						onCopy={ () => setHasCopied( true ) }
						onFinishCopy={ () => setHasCopied( false ) }
					>
						{ hasCopied ? (
							<Icon icon={ check } size={ 24 } />
						) : (
							<Icon icon={ copy } size={ 24 } />
						) }
					</ClipboardButton>
				</CardHeader>
				<CardBody style={ { background: '#f3f3f3' } }>
					<div
						style={ {
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							paddingTop: '15px',
							paddingBottom: '15px',
						} }
					>
						{
							<RegistrationTextPreview
								categoryOptions={ categoryOptions }
							/>
						}
					</div>
				</CardBody>
			</Card>
		</>
	);
}
