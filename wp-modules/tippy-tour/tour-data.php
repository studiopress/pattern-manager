<?php
/**
 * The data for the tour.
 *
 * @package fse-studio
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return [
	'tourTitle'   => __( 'FSE Studio Tour', 'fse-studio' ),
	'tourSlug'    => 'FseStudioTour',
	'stepsInTour' => [
		[
			'initialData' => [
				'html' => __( 'Welcome to the FSE Studio Tour. Let\'s make a theme.', 'fse-studio' ),
			],
			'navigation'  => [
				'backButton' => false,
				'nextButton' => true,
			],
		],
		[
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Create a new theme', 'fse-studio' ),
			],
			'beaconPosition'     => 'auto',
			'initialData'        => [
				'html' => __( 'Click to create a new theme', 'fse-studio' ),
			],
			'completionData'     => [
				'html'    => __( 'Great Job', 'fse-studio' ),
				'type'    => 'elementHasValue',
				'element' => [
					'role'  => 'textbox',
					'name'  => __( 'Theme Name', 'fse-studio' ),
					'value' => __( 'My New Theme', 'fse-studio' ),
				],
			],
			'navigation'         => [
				'backButton' => false,
				'nextButton' => false,
				'onComplete' => 'goToNextStep',
			],
		],
		[
			'highlightedElement' => [
				'role' => 'textbox',
				'name' => __( 'Theme Name', 'fse-studio' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Give your theme a unique name.', 'fse-studio' ),
			],
			'completionData'     => [
				'html'    => __( 'Your theme name looks good! When you\'re finished naming your theme, click "Next".', 'fse-studio' ),
				'type'    => 'elementDoesNotHaveValues',
				'element' => [
					'role'   => 'textbox',
					'name'   => __( 'Theme Name', 'fse-studio' ),
					'values' => [
						'',
						__( 'My New Theme', 'fse-studio' ),
					],
				],
			],
			'navigation'         => [
				'backButton' => false,
				'nextButton' => true,
			],
		],
		[
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Save Theme Settings', 'fse-studio' ),
			],
			'beaconPosition'     => 'top',
			'initialData'        => [
				'html' => __( 'Save your theme.', 'fse-studio' ) . ' ' . __( 'When you\'re done adding your theme information above, click "Save Theme Settings".', 'fse-studio' ),
			],
			'completionData'     => [
				'html' => __( 'Theme Saved!', 'fse-studio' ),
				'type'    => 'elementExists',
				'element' => [
					'role'   => 'dialog',
					'name' => [
						__( 'Theme Saved', 'fse-studio' ),
					],
				],
			],
			'navigation'         => [
				'backButton' => true,
				'nextButton' => true,
			],
		],
	],
];
