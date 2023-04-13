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
			<Card status="warning" className="custom-category-warning-card">
				<CardBody className="custom-category-warning-card-body">
					Heads up, you need to register these categories in your
					theme. Add them to your theme with the following code.
				</CardBody>
			</Card>
			<Card className="custom-category-registration-card">
				<CardHeader className="custom-category-registration-card-header">
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
				<CardBody className="custom-category-registration-card-body">
					<div className="custom-category-registration-card-body-inner">
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
