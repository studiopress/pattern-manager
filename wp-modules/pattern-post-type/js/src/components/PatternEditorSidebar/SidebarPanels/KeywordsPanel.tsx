import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import CreatableSelect from 'react-select/creatable';

import type { BaseSidebarProps } from '../types';

/**
 * The panel section for assigning keywords to the pattern.
 * Keywords are searchable terms in the site editor inserter.
 */
export default function KeywordsPanel( {
	postMeta,
	handleChange,
}: BaseSidebarProps ) {
	const [ keywordInputValue, setKeywordInputValue ] = useState( '' );

	return (
		<PluginDocumentSettingPanel
			name="fsestudio-pattern-editor-pattern-keywords"
			title={ __( 'Pattern Keywords', 'fse-studio' ) }
		>
			<CreatableSelect
				components={ {
					DropdownIndicator: null,
				} }
				inputValue={ keywordInputValue }
				isClearable
				isMulti
				menuIsOpen={ false }
				onChange={ ( newValue ) => {
					// Handle the deletion of keywords.
					handleChange( 'keywords', [
						...newValue.map( ( keywordObject ) =>
							keywordObject.value.toLowerCase()
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
						// Split the keywords, then filter that array.
						// This disallows duplicate terms.
						const filteredKeywords = keywordInputValue
							.toLowerCase()
							.split( ' ' )
							.filter(
								( word ) => ! postMeta.keywords.includes( word )
							);

						handleChange( 'keywords', [
							...postMeta.keywords,
							...filteredKeywords,
						] );

						setKeywordInputValue( '' );
						event.preventDefault();
					}
				} }
				placeholder={ __( 'Add searchable terms…', 'fse-studio' ) }
				value={ postMeta.keywords.map( ( keyword ) => ( {
					label: keyword,
					value: keyword,
				} ) ) }
			/>
		</PluginDocumentSettingPanel>
	);
}
