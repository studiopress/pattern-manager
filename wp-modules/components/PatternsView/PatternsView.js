// @ts-check

import * as React from 'react';
import { Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import PatternPicker from '@fse-studio/pattern-picker';

/**
 * @typedef {{
 *   categories: string[],
 *   content: string,
 *   name: string,
 *   title: string,
 * 	 viewportWidth: number
 * }} Pattern
 */

/**
 * The pattern view component.
 *
 * @param {{
 *  currentView: string,
 *  setSidebarView: Function,
 *  patterns: {
 *    patterns: Record<string, Pattern>,
 *    setPatterns: Function
 *  },
 *  theme: {
 *    data: {
 *      included_patterns: string[]
 *    },
 *    set: Function
 *  },
 *  layoutPreview: Function
 * }} props The component props.
 * @return {React.ReactElement} The rendered component.
 */
export default function PatternsView( {
	currentView,
	setSidebarView,
	patterns,
	theme,
	layoutPreview: LayoutPreview,
} ) {
	const [ isModalOpen, setModalOpen ] = useState( false );

	if ( currentView !== 'add_patterns' ) {
		return null;
	}

	return (
		<>
			<div className="flex flex-col">
				<div className="w-full text-center bg-gray-100 p-5 self-start">
					<h3 className="block text-sm font-medium text-gray-700 sm:col-span-1">
						{ __( 'Add patterns to your theme', 'fse-studio' ) }
					</h3>
					<p className="mt-2">
						<span>
							{ __(
								'You can also create patterns in the',
								'fse-studio'
							) }
						</span>
						&nbsp;
						<button
							className="mt-2 text-blue-400"
							onClick={ () => {
								setSidebarView( 'pattern_manager' );
							} }
						>
							{ __( 'Pattern Manager', 'fse-studio' ) }
						</button>
					</p>
					<p className="mt-2">
						<button
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-wp-gray hover:bg-[#586b70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
							onClick={ () => setModalOpen( true ) }
						>
							{ __( 'Browse Patterns', 'fse-studio' ) }
						</button>
					</p>
				</div>
				{ theme.data.included_patterns.length ? (
					<>
						<h3 className="mt-2 block text-sm font-medium text-gray-700 sm:col-span-1">
							{ __(
								'Patterns included in this theme:',
								'fse-studio'
							) }
						</h3>
						<div className="grid w-full grid-cols-3 gap-5 p-8">
							{ theme.data.included_patterns.map(
								( patternName, index ) => {
									return (
										<div
											key={ index }
											className="min-h-[300px] bg-gray-200"
										>
											<h3 className="border-b border-gray-200 p-5 px-4 text-lg sm:px-6 md:px-8">
												{
													patterns.patterns[
														patternName
													]?.title
												}
											</h3>
											<LayoutPreview
												bodyHTML={
													patterns.patterns[
														patternName
													]?.content
												}
											/>
										</div>
									);
								}
							) }
						</div>
					</>
				) : null }
			</div>
			{ isModalOpen ? (
				<Modal
					title={ __(
						'Pick the patterns to include in this theme',
						'fse-studio'
					) }
					onRequestClose={ () => {
						setModalOpen( false );
					} }
				>
					<PatternPicker
						patterns={ patterns.patterns }
						selectedPatterns={ theme.data.included_patterns }
						setSelectedPatterns={ ( selectedPatterns ) => {
							theme.set( {
								...theme.data,
								included_patterns: selectedPatterns,
							} );
						} }
						layoutPreview={ LayoutPreview }
						selectMultiple={ true }
					/>
				</Modal>
			) : null }
		</>
	);
}
