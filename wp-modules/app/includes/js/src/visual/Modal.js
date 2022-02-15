const { __ } = wp.i18n;

export function Modal( { open, children, close } ) {
	if ( open ) {
		return (
			<div className="genesisstudio-info-modal">
				<div className="genesisstudio-info-modal-content">
					{ children }
					<button
						className="genesisstudio-info-modal-close-button"
						onClick={ () => {
							close();
						} }
					>
						{ __( 'Close', 'fse-studio' ) }
					</button>
				</div>
			</div>
		);
	}
	return '';
}
