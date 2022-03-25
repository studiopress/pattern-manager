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
				'html' => __( 'Welcome to the FSE Studio Tour. Let\'s make a theme!', 'fse-studio' ),
			],
			'navigation'  => [
				'backButton' => false,
				'nextButton' => true,
			],
		],
		[ // Create theme.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Create a new theme', 'fse-studio' ),
			],
			'beaconPosition'     => 'auto',
			'initialData'        => [
				'html' => __( 'Click the button to create a new theme.', 'fse-studio' ),
			],
			'completionData'     => [
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
		[ // Theme name.
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
		[ // Theme save.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Save Theme Settings', 'fse-studio' ),
			],
			'beaconPosition'     => 'top',
			'initialData'        => [
				'html' => __( 'When you\'re done editing your theme information above, click the "Save Theme Settings" button. The theme will be saved to your /themes/ folder and activated on your site.', 'fse-studio' ),
			],
			'completionData'     => [
				'html'    => __( 'Congratulations! Your new theme was saved to your /themes/ folder and activated on your site.', 'fse-studio' ),
				'type'    => 'elementExists',
				'element' => [
					'role' => 'dialog',
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
		[ // Add Patterns.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Add Patterns', 'fse-studio' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Click "Add Patterns" to add pre-made, ready to use block patterns to your theme.', 'fse-studio' ),
			],
			'completionData'     => [
				'type'    => 'elementExists',
				'element' => [
					'role' => 'heading',
					'name' => [
						__( 'Add patterns to your theme', 'fse-studio' ),
					],
				],
			],
			'navigation'         => [
				'backButton' => true,
				'nextButton' => true,
				'onComplete' => 'goToNextStep',
			],
		],
		[ // Add Patterns > Browse Patterns.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Browse Patterns', 'fse-studio' ),
			],
			'beaconPosition'     => 'bottom',
			'initialData'        => [
				'html' => __( 'To add patterns, click the "Browse Patterns" button. There, you can select multiple patterns, then close the modal to add them to the theme.', 'fse-studio' ),
			],
			'completionData'     => [
				'type'    => 'elementExists',
				'element' => [
					'role' => 'img',
					'name' => [
						__( 'Pattern Preview', 'fse-studio' ),
					],
				],
			],
			'navigation'         => [
				'backButton' => false,
				'nextButton' => true,
				'onComplete' => 'goToNextStep',
			],
		],
		[ // Add Patterns save.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Save Theme Settings', 'fse-studio' ),
			],
			'beaconPosition'     => 'top',
			'initialData'        => [
				'html' => __( 'Patterns Added! Click the "Save Theme Settings" button to save patterns to your theme.', 'fse-studio' ),
			],
			'completionData'     => [
				'html'    => __( 'Congratulations! Your theme was saved.', 'fse-studio' ),
				'type'    => 'elementExists',
				'element' => [
					'role' => 'dialog',
					'name' => [
						__( 'Theme Saved', 'fse-studio' ),
					],
				],
			],
			'navigation'         => [
				'backButton' => false,
				'nextButton' => true,
			],
		],
		[ // Theme Template Files.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Theme Template Files', 'fse-studio' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Click "Theme Template Files" to assign theme templates for the different types of content such as posts, pages, or attachments.', 'fse-studio' ),
			],
			'completionData'     => [
				'type'    => 'elementExists',
				'element' => [
					'role' => 'heading',
					'name' => [
						__( 'Template: 404.html', 'fse-studio' ),
					],
				],
			],
			'navigation'         => [
				'backButton' => false,
				'nextButton' => true,
				'onComplete' => 'goToNextStep',
			],
		],
		[ // Theme Template Files > Set Patterns.
			'highlightedElement' => [
				'role' => 'heading',
				'name' => __( 'Template: 404.html', 'fse-studio' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'To add a template, click the "Set Patterns" button to open the patterns modal. There, you can search for and select a pattern to use for each template.', 'fse-studio' ),
			],
			'completionData'     => [
				'type'    => 'elementExists',
				'element' => [
					'role' => 'button',
					'name' => [
						__( 'Change Pattern', 'fse-studio' ),
					],
				],
			],
			'navigation'         => [
				'backButton' => true,
				'nextButton' => true,
			],
		],
		[ // Theme Template Files save.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Save Theme Settings', 'fse-studio' ),
			],
			'beaconPosition'     => 'top',
			'initialData'        => [
				'html' => __( 'When you\'ve finished selecting your theme templates above, click the "Save Theme Settings" button to save templates to your theme.', 'fse-studio' ),
			],
			'completionData'     => [
				'html'    => __( 'Congratulations! Your theme was saved.', 'fse-studio' ),
				'type'    => 'elementExists',
				'element' => [
					'role' => 'dialog',
					'name' => [
						__( 'Theme Saved', 'fse-studio' ),
					],
				],
			],
			'navigation'         => [
				'backButton' => false,
				'nextButton' => true,
			],
		],
		[ // Pattern Editor.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Pattern Editor', 'fse-studio' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Create and Edit pre-defined patterns for use in any theme you design using the Pattern Editor.', 'fse-studio' ),
			],
			'navigation'         => [
				'backButton' => true,
				'nextButton' => true,
			],
		],
		[ // Theme.json Editor.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Theme.json Editor', 'fse-studio' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Create and edit theme.json files for use in any theme you design.', 'fse-studio' ),
			],
			'navigation'         => [
				'backButton' => true,
				'nextButton' => true,
			],
		],
	],
];
