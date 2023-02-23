// WP dependencies
import { Button } from '@wordpress/components';

// Types
import type { Dispatch, SetStateAction } from 'react';

type Props = {
	categories: { label: string; name: string }[];
	currentCategory: string;
	setCurrentCategory: Dispatch< SetStateAction< string > >;
};

/** Render the list of pattern categories with a conditional 'category-selected' class. */
export default function PatternCategories( {
	categories,
	currentCategory,
	setCurrentCategory,
}: Props ) {
	return (
		<>
			{ categories.map( ( category ) => {
				const classes = [
					'category',
					...( currentCategory === category.name
						? [ 'category-selected is-pressed' ]
						: [] ),
				].join( ' ' );

				return (
					<Button
						type="button"
						key={ category.name }
						aria-label={ category.label }
						aria-pressed={ classes.includes( 'category-selected' ) }
						className={ classes }
						onClick={ () =>
							setCurrentCategory( () => category.name )
						}
					>
						{ category.label }
					</Button>
				);
			} ) }
		</>
	);
}
