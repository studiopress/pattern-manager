import { AdditionalSidebarProps } from '../types';

export default function RegistrationTextPreview( {
	categoryOptions,
}: AdditionalSidebarProps< 'categoryOptions' > ) {
	return (
		<>
			{ `add_action( 'init', function () {` } <br />
			{ categoryOptions.map( ( category ) => (
				<span
					key={ category.value }
					style={ { display: 'relative', marginLeft: '20px' } }
				>
					{ `register_block_pattern_category( '${ category.value }', array( 'label' => '${ category.label }' ) );` }
					<br />
				</span>
			) ) }
			{ `} );` }
		</>
	);
}
