/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import { useContext } from '@wordpress/element';
import { GenesisStudioContext } from './../non-visual/non-visual-logic.js';
import { ColorPicker } from '@wordpress/components';

export function GenesisStudioToolbar() {
	const { breakpoints, toolbar } = useContext( GenesisStudioContext );

	function renderBreakpointsPicker() {
		if ( 'breakpointspicker' === toolbar.toolbarControlState ) {
			const controls = [];
			for ( const breakpoint in breakpoints ) {
				const thisBreakpoint = breakpoint;
				controls.push(
					<button
						className="components-button"
						onClick={ () => {
							toolbar.setCurrentBreakpoint( thisBreakpoint );
							toolbar.setToolbarControlState( false );
						} }
					>
						<span className="breakpointicon">
							{ breakpoints[ breakpoint ].icon }
						</span>
						<span>{ breakpoints[ breakpoint ].name }</span>
					</button>
				);
			}

			return (
				<div className="toolbarmodal">
					<div className="breakpointoptions">{ controls }</div>
				</div>
			);
		}

		return (
			<div className="components-toolbar-group">
				<button
					type="button"
					className="components-button"
					onClick={ () =>
						toolbar.setToolbarControlState( 'breakpointspicker' )
					}
				>
					<span className="breakpointicon">
						{ breakpoints[ toolbar.currentBreakpoint ].icon }
					</span>
					{ ( () => {
						if ( ! toolbar.topLevel ) {
							return (
								<span>
									{
										breakpoints[ toolbar.currentBreakpoint ]
											.name
									}
								</span>
							);
						}
					} )() }
				</button>
			</div>
		);
	}

	function renderLevel1() {
		if ( ! toolbar.topLevel ) {
			return (
				<div className="level-one ">
					<Level1Control
						component={ 'ColorControls' }
						name={ __( 'Colors', 'genesisstudio' ) }
						colorFind={ toolbar.color1Find }
						colorReplace={ toolbar.color1Replace }
					/>
				</div>
			);
		}
		return (
			<button
				className="components-button"
				onClick={ () => {
					toolbar.setTopLevel( false );
					toolbar.setToolbarControlState( false );
				} }
			>
				<span className="dashicons dashicons-arrow-left"></span>
				{ __( 'Main Controls', 'genesisstudio' ) }
			</button>
		);
	}

	function renderLevel2() {
		if ( toolbar.topLevel ) {
			return (
				<div className="level-two">
					<Level2Control component={ toolbar.topLevel } />
				</div>
			);
		}
		return '';
	}

	return (
		<div className="one-block-controls components-toolbar">
			<div className="toolbarcontrol breakpoints">
				{ renderBreakpointsPicker() }
			</div>
			{ renderLevel1() }
			{ renderLevel2() }
		</div>
	);
}

function Level1Control( props ) {
	const { toolbar } = useContext( GenesisStudioContext );
	const TheComponent = eval( props.component );
	return (
		<button
			className="components-button"
			onClick={ () => {
				toolbar.setTopLevel( props.component );
			} }
		>
			{ props.name }
		</button>
	);
}

function Level2Control( props ) {
	const TheComponent = eval( props.component );
	return <TheComponent { ...props } />;
}

function ColorControls( props ) {
	const { toolbar } = useContext( GenesisStudioContext );

	if ( 'color1' === toolbar.toolbarControlState ) {
		return (
			<div className="toolbarcontrol">
				<div className="toolbarmodal">
					Find Color:
					<ColorPicker { ...toolbar.color1Find } />
					Replace With:
					<ColorPicker { ...toolbar.color1Replace } />
					<button
						className="button"
						onClick={ () =>
							toolbar.setToolbarControlState( false )
						}
					>
						{ __( 'Close', 'oneblock' ) }
					</button>
				</div>
			</div>
		);
	}

	const color = toolbar.color1Replace.color
		? toolbar.color1Replace.color.hex
		: '';

	return (
		<button
			className="button"
			onClick={ () => toolbar.setToolbarControlState( 'color1' ) }
			style={ { backgroundColor: color } }
		>
			Color 1
		</button>
	);
}
