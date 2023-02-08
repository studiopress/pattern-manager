import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { create, act } from 'react-test-renderer';
import usePatterns from '../usePatterns';
import { mockPattern, mockPatterns } from '../../fixtures/sampleData';
import type { Patterns } from '../../types';

it( 'usePatterns returns data for a single pattern correctly in a component', () => {
	const testRenderer = create( <SimpleComponent patterns={ mockPattern } /> );

	expect( testRenderer.toJSON() ).toMatchObject( {
		children: [
			{
				children: [ 'Test Pattern Single' ],
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

it( 'usePatterns returns patterns data correctly in a component', () => {
	const testRenderer = create(
		<SimpleComponent patterns={ mockPatterns } />
	);

	expect( testRenderer.toJSON() ).toMatchObject( {
		children: [
			{
				children: [ 'Test Pattern 1' ],
				props: {
					id: 'test-pattern-1',
				},
				type: 'div',
			},
			{
				children: [ 'Test Pattern 2' ],
				props: {
					id: 'test-pattern-2',
				},
				type: 'div',
			},
			{
				children: [ 'Test Pattern 3' ],
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

it( 'usePatterns returns patterns data correctly in a component with deeply nested markup', () => {
	const testRenderer = create(
		<NestedComponent patterns={ mockPatterns } />
	);

	const testInstance = testRenderer.root;
	const testChildren = testInstance.findByProps( {
		id: 'nested-test-pattern-container',
	} ).children;

	expect( testChildren ).toMatchObject( [
		{
			children: [ 'Test Pattern 1' ],
			props: {
				id: 'test-pattern-1',
			},
			type: 'div',
		},
		{
			children: [ 'Test Pattern 2' ],
			props: {
				id: 'test-pattern-2',
			},
			type: 'div',
		},
		{
			children: [ 'Test Pattern 3' ],
			props: {
				id: 'test-pattern-3',
			},
			type: 'div',
		},
	] );

	testRenderer.unmount();
} );

it( 'test a sample button press component by pressing the button', () => {
	const testRenderer = create( <ButtonComponent /> );
	const testInstance = testRenderer.root;

	expect( testRenderer.toJSON() ).toMatchObject( {
		children: [
			{
				children: [ 'false' ],
				props: {
					id: 'test-button',
				},
				type: 'button',
			},
		],
		props: {
			id: 'outer-button',
		},
		type: 'div',
	} );

	// Press the button to update child content.
	// Button could also be targeted with `findByType( Button )`.
	act( () =>
		testInstance.findByProps( { id: 'test-button' } ).props.onClick()
	);

	expect( testRenderer.toJSON() ).toMatchObject( {
		children: [
			{
				children: [ 'true' ],
				props: {
					id: 'test-button',
				},
				type: 'button',
			},
		],
		props: {
			id: 'outer-button',
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

function NestedComponent( { patterns }: { patterns: Patterns } ) {
	const { data } = usePatterns( patterns );

	return (
		<div id="outer-container">
			<div id="inner-container-1">
				<div id="inner-container-2">
					<div id="nested-test-pattern-container">
						{ Object.entries( data ).map(
							( [ patternId, { title } ] ) => (
								<div key={ patternId } id={ patternId }>
									{ title }
								</div>
							)
						) }
					</div>
				</div>
			</div>
		</div>
	);
}

function ButtonComponent() {
	const [ buttonBool, setButtonBool ] = useState( false );

	return (
		<div id="outer-button">
			<Button
				id="test-button"
				onClick={ () => {
					setButtonBool( ( currentBool ) => ! currentBool );
				} }
			>
				{ String( buttonBool ) }
			</Button>
		</div>
	);
}
