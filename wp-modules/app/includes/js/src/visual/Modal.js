/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

export function Modal( props ) {
	if ( props.open ) {
		return (
			<div className="genesisstudio-info-modal">
				<div className="genesisstudio-info-modal-content">
					{ props.children }
					<button
						className="genesisstudio-info-modal-close-button"
						onClick={ () => {
							props.close();
						} }
					>
						Close
					</button>
				</div>
			</div>
		);
	}
	return '';
}
