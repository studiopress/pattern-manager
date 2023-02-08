/* eslint-disable react-hooks/rules-of-hooks */

import { create, act } from 'react-test-renderer';
import usePatterns from '../usePatterns';
import { mockPattern, mockPatterns } from '../../fixtures/sampleData';
import type { Patterns } from '../../types';

it( 'usePatterns returns data for a single pattern correctly in a component', () => {
	const testRenderer = create( <SimpleComponent patterns={ mockPattern } /> );

	expect( testRenderer.toJSON() ).toMatchObject( {
		children: [
			{
				props: {
					id: 'test-pattern-single',
				},
				type: 'div',
			},
		],
		props: {
			id: 'test-pattern-outer',
		},
		type: 'div',
	} );

	testRenderer.unmount();
} );

it( 'usePatterns returns data for multiple patterns correctly in a component', () => {
	const testRenderer = create( <SimpleComponent patterns={ mockPatterns } /> );

	expect( testRenderer.toJSON() ).toMatchObject( {
		children: [
			{
				props: {
					id: 'test-pattern-1',
				},
				type: 'div',
			},
			{
				props: {
					id: 'test-pattern-2',
				},
				type: 'div',
			},
			{
				props: {
					id: 'test-pattern-3',
				},
				type: 'div',
			},
		],
		props: {
			id: 'test-pattern-outer',
		},
		type: 'div',
	} );

	testRenderer.unmount();
} );

function SimpleComponent( { patterns }: { patterns: Patterns } ) {
	const { data } = usePatterns( patterns );

	return (
		<div id="test-pattern-outer">
			{ Object.entries( data ).map( ( [ patternId, { title } ] ) => (
				<div key={ patternId } id={ patternId }>
					{ title }
				</div>
			) ) }
		</div>
	);
}
