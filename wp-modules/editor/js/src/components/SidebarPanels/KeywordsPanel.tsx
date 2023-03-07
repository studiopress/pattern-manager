import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import CreatableSelect from 'react-select/creatable';

import type { BaseSidebarProps } from './types';

/**
 * The panel section for assigning keywords to the pattern.
 * Keywords are searchable terms in the site editor inserter.
 */
export default function KeywordsPanel( {
	keywords,
	handleChange,
}: BaseSidebarProps< 'keywords' > ) {
	const [ keywordInputValue, setKeywordInputValue ] = useState( '' );

	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-keywords"
			title={ __( 'Pattern Keywords', 'pattern-manager' ) }
		>
			<CreatableSelect
				components={ {
					DropdownIndicator: null,
				} }
				inputValue={ keywordInputValue }
				aria-label={ __( 'Add Pattern Keywords', 'pattern-manager' ) }
				isClearable
				isMulti
				menuIsOpen={ false }
				onChange={ ( newValue ) => {
					// Handle the deletion of keywords.
					handleChange( 'keywords', [
						...newValue.map(
							( keywordObject ) => keywordObject.value
						),
					] );
				} }
				onInputChange={ ( newValue ) =>
					setKeywordInputValue( newValue )
				}
				onKeyDown={ ( event ) => {
					if ( ! keywordInputValue ) {
						return;
					}

					if ( [ 'Enter', 'Tab', ',' ].includes( event.key ) ) {
						handleChange( 'keywords', [
							...keywords,
							// Add the new term if not a case-insensitive duplicate.
							...( ! keywords.some(
								( term ) =>
									term.toLowerCase() ===
									keywordInputValue.toLowerCase()
							)
								? [ keywordInputValue ]
								: [] ),
						] );

						setKeywordInputValue( '' );
						event.preventDefault();
					}
				} }
				placeholder={ __( 'Add searchable terms…', 'pattern-manager' ) }
				value={ keywords.map( ( keyword ) => ( {
					label: keyword,
					value: keyword,
				} ) ) }
			/>
		</PluginDocumentSettingPanel>
	);
}
