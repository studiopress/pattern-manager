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
				'html' => __( 'Welcome to the Fse Studio Tour. Let\'s make a theme.', 'fse-studio' ),
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
				'html' => __( 'Give your theme a unique name', 'fse-studio' ),
			],
			'completionData'     => [
				'html'    => __( 'Give your theme a unique name', 'fse-studio' ) . __( 'Looks good! Feel free to keep working on your unique name. When ready, click "next".', 'fse-studio' ),
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
				'role' => 'textbox',
				'name' => __( 'Directory Name', 'fse-studio' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Give your theme a unique directory name.', 'fse-studio' ) . __( 'Ideally this matches your theme\'s name, but without any special characters or spaces. Replace spaces with dashes.', 'fse-studio' ),
			],
			'completionData'     => [
				'html'    => __( 'Give your theme a unique directory name.', 'fse-studio' ) . __( 'Ideally this matches your theme\'s name, but without any special characters or spaces. Replace spaces with dashes.', 'fse-studio' ),
				'type'    => 'elementDoesNotHaveValues',
				'element' => [
					'role'   => 'textbox',
					'name'   => __( 'Directory Name', 'fse-studio' ),
					'values' => [
						'',
						'my-new-theme',
					],
				],
			],
			'navigation'         => [
				'backButton' => true,
				'nextButton' => true,
			],
		],
		[
			'highlightedElement' => [
				'role' => 'textbox',
				'name' => __( 'Namespace', 'fse-studio' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Give your theme a unique namespace', 'fse-studio' ) . __( 'This is the PHP namespace that will be used to ensure your theme\'s code does not conflict with any other themes.', 'fse-studio' ),
			],
			'completionData'     => [
				'html'    => __( 'Great Job', 'fse-studio' ),
				'type'    => 'elementDoesNotHaveValues',
				'element' => [
					'role'   => 'textbox',
					'name'   => __( 'Namespace', 'fse-studio' ),
					'values' => [
						'',
						'MyNewTheme',
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
