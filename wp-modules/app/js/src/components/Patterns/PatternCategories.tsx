// WP dependencies
import { TabbableContainer } from '@wordpress/components';

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
						? [ 'category-selected' ]
						: [] ),
				].join( ' ' );

				return (
					<TabbableContainer
						key={ category.name }
						className={ classes }
						onClick={ () =>
							setCurrentCategory( () => category.name )
						}
					>
						<span className="category-name">
							{ category.label }
						</span>
					</TabbableContainer>
				);
			} ) }
		</>
	);
}
