import { useState } from '@wordpress/element';
import { Icon, copy, check } from '@wordpress/icons';
import {
	Card,
	CardBody,
	CardHeader,
	ClipboardButton,
} from '@wordpress/components';

import { AdditionalSidebarProps } from '../types';

export default function CategoryRegistration( {
	categoryOptions,
}: AdditionalSidebarProps< 'categoryOptions' > ) {
	const [ hasCopied, setHasCopied ] = useState( false );

	/** This text formatting madness is all super ugly. Don't judge it too much for this proof-of-concept! */
	const formattedCategoriesToCopy = categoryOptions.reduce(
		( acc, category ) =>
			`register_block_pattern_category( '${
				category.value
			}', array( 'label' => '${ category.label }' ) );${
				acc.length ? '\n\t' + acc : ''
			}`,
		''
	);

	const textToCopy = `add_action( 'init', function () {
	${ formattedCategoriesToCopy }
} );`;

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
							<FormattedTextPreview
								categoryOptions={ categoryOptions }
							/>
						}
					</div>
				</CardBody>
			</Card>
		</>
	);
}

function FormattedTextPreview( {
	categoryOptions,
}: AdditionalSidebarProps< 'categoryOptions' > ) {
	return (
		<>
			{ `add_action( 'init', function () {` } <br />
			{ categoryOptions.map( ( category ) => (
				<>
					{ `register_block_pattern_category( '${ category.value }', array( 'label' => '${ category.label }' ) );` }
					<br />
				</>
			) ) }
			{ `} );` }
		</>
	);
}
