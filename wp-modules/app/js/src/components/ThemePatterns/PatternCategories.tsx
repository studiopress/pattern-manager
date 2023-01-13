// Types
import type { Dispatch, SetStateAction } from 'react';

type props = {
	categories: { label: string; name: string }[];
	currentCategory: string;
	setCurrentCategory: Dispatch< SetStateAction< string > >;
};

export default function PatternCategories( {
	categories,
	currentCategory,
	setCurrentCategory,
}: props ) {
	return (
		<div className="inner-categories">
			{ categories.map( ( category ) => {
				const classes = [
					'category',
					...( currentCategory === category.name
						? [ 'category-selected' ]
						: [] ),
				].join( ' ' );

				return (
					<div
						key={ category.name }
						className={ classes }
						onClick={ () =>
							setCurrentCategory( () => category.name )
						}
					>
						<span className="category-name">
							{ category.label }
						</span>
					</div>
				);
			} ) }
		</div>
	);
}
