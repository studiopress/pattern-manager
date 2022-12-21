import sortAlphabetically from '../utils/sortAlphabetically';

export default function usePatternData( { postMeta } ) {
	/**
	 * Get, filter, and sort the custom post types, mapped for react-select.
	 * Wrapping call in useSelect to prevent async null return on initial load.
	 *
	 * 'core/post-content' in 'Block Types' header always displays for 'page' post type.
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/core-blocks/
	 */
	const postTypes = wp.data.useSelect( ( select ) => {
		const initialPostTypes = select( 'core' )
			.getPostTypes( {
				per_page: 100,
			} )
			?.map( ( postType ) => ( {
				label: postType.name,
				value: postType.slug,
			} ) );

		if ( initialPostTypes ) {
			/**
			 * Core post types that are inapplicable or not user accessible.
			 *
			 * Current core types for possible removal:
			  'attachment', // Media
			  'nav_menu_item',
			  'wp_block', // Reusable blocks are a user-accessible post type
			  'wp_template',
			  'wp_template_part',
			  'wp_navigation',
			  'fsestudio_pattern',
			 */
			const corePostTypesToRemove = [
				'attachment',
				'nav_menu_item',
				'wp_navigation',
				'fsestudio_pattern',
			];

			const filteredPostTypes = initialPostTypes.filter( ( postType ) => {
				// Filter out the unapplicable core post types.
				return ! corePostTypesToRemove.includes( postType.value );
			} );

			return sortAlphabetically( filteredPostTypes, 'label' );
		}
	}, [] );

	/**
	 * Alphabetized block pattern categories for the site editor, mapped for react-select.
	 */
	const categories = wp.data.useSelect( ( select ) => {
		return sortAlphabetically(
			select( 'core' )
				.getBlockPatternCategories()
				.map( ( category ) => ( {
					label: category.label,
					value: category.name,
				} ) ),
			'label'
		);
	}, [] );

	/**
	 * The alphabetized list of transformable block types, mapped for react-select.
	 * Template-part types are added to support template part replacement in site editor.
	 */
	const blockTypes = wp.data.useSelect( ( select ) => {
		const registeredBlockTypes = [
			...select( 'core/blocks' )
				.getBlockTypes()
				.map( ( blockType ) => ( {
					label: blockType.name, // blockType.title also available
					value: blockType.name,
					// Only add the transforms property if it exists.
					...( blockType.transforms && {
						transforms: blockType.transforms,
					} ),
				} ) ),
			{
				label: 'core/template-part/header',
				value: 'core/template-part/header',
				transforms: {},
			},
			{
				label: 'core/template-part/footer',
				value: 'core/template-part/footer',
				transforms: {},
			},
		];

		return sortAlphabetically(
			registeredBlockTypes.filter(
				( blockType ) => blockType.transforms
			),
			'label'
		);
	}, [] );

	function updatePostMeta( metaKey, newValue, additionalMeta = {} ) {
		wp.data.dispatch( 'core/editor' ).editPost( {
			meta: {
				...postMeta,
				[ metaKey ]: newValue,
				...( Object.keys( additionalMeta ).length && {
					...additionalMeta,
				} ),
			},
		} );
	}

	return {
		postTypes,
		categories,
		blockTypes,
		updatePostMeta,
	};
}
