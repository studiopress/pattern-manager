<?php
/**
 * The data for the tour.
 *
 * @package pattern-manager
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return [
	'tourTitle'   => __( 'Pattern Manager Tour', 'pattern-manager' ),
	'tourSlug'    => 'PatternManagerTour',
	'stepsInTour' => [
		[
			'initialData' => [
				'html' => __( 'Welcome to the Pattern Manager Tour. Let\'s make a theme!', 'pattern-manager' ),
			],
			'navigation'  => [
				'backButton' => false,
				'nextButton' => true,
			],
		],
		[ // Create theme.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Create a new theme', 'pattern-manager' ),
			],
			'beaconPosition'     => 'auto',
			'initialData'        => [
				'html' => __( 'Click the button to create a new theme.', 'pattern-manager' ),
			],
			'completionData'     => [
				'type'    => 'elementHasValue',
				'element' => [
					'role'  => 'textbox',
					'name'  => __( 'Theme Name', 'pattern-manager' ),
					'value' => __( 'My New Theme', 'pattern-manager' ),
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
				'name' => __( 'Theme Name', 'pattern-manager' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Give your theme a unique name.', 'pattern-manager' ),
			],
			'completionData'     => [
				'html'    => __( 'Your theme name looks good! When you\'re finished naming your theme, click "Next".', 'pattern-manager' ),
				'type'    => 'elementDoesNotHaveValues',
				'element' => [
					'role'   => 'textbox',
					'name'   => __( 'Theme Name', 'pattern-manager' ),
					'values' => [
						'',
						__( 'My New Theme', 'pattern-manager' ),
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
				'name' => __( 'Save Theme Settings', 'pattern-manager' ),
			],
			'beaconPosition'     => 'top',
			'initialData'        => [
				'html' => __( 'When you\'re done editing your theme information above, click the "Save Theme Settings" button. The theme will be saved to your /themes/ folder and activated on your site.', 'pattern-manager' ),
			],
			'completionData'     => [
				'html'    => __( 'Congratulations! Your new theme was saved to your /themes/ folder and activated on your site.', 'pattern-manager' ),
				'type'    => 'elementExists',
				'element' => [
					'role' => 'dialog',
					'name' => [
						__( 'Theme Saved', 'pattern-manager' ),
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
				'name' => __( 'Add Patterns', 'pattern-manager' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Click "Add Patterns" to add pre-made, ready to use block patterns to your theme.', 'pattern-manager' ),
			],
			'completionData'     => [
				'type'    => 'elementExists',
				'element' => [
					'role' => 'heading',
					'name' => [
						__( 'Add patterns to your theme', 'pattern-manager' ),
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
				'name' => __( 'Browse Patterns', 'pattern-manager' ),
			],
			'beaconPosition'     => 'bottom',
			'initialData'        => [
				'html' => __( 'To add patterns, click the "Browse Patterns" button. There, you can select multiple patterns, then close the modal to add them to the theme.', 'pattern-manager' ),
			],
			'completionData'     => [
				'type'    => 'elementExists',
				'element' => [
					'role' => 'img',
					'name' => [
						__( 'Pattern Preview', 'pattern-manager' ),
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
				'name' => __( 'Save Theme Settings', 'pattern-manager' ),
			],
			'beaconPosition'     => 'top',
			'initialData'        => [
				'html' => __( 'Patterns Added! Click the "Save Theme Settings" button to save patterns to your theme.', 'pattern-manager' ),
			],
			'completionData'     => [
				'html'    => __( 'Congratulations! Your theme was saved.', 'pattern-manager' ),
				'type'    => 'elementExists',
				'element' => [
					'role' => 'dialog',
					'name' => [
						__( 'Theme Saved', 'pattern-manager' ),
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
				'name' => __( 'Theme Template Files', 'pattern-manager' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Click "Theme Template Files" to assign theme templates for the different types of content such as posts, pages, or attachments.', 'pattern-manager' ),
			],
			'completionData'     => [
				'type'    => 'elementExists',
				'element' => [
					'role' => 'heading',
					'name' => [
						__( 'Template: 404.html', 'pattern-manager' ),
					],
				],
			],
			'navigation'         => [
				'backButton' => false,
				'nextButton' => true,
				'onComplete' => 'goToNextStep',
			],
		],
		[ // Theme Template Files > Set Pattern.
			'highlightedElement' => [
				'role' => 'heading',
				'name' => __( 'Template: 404.html', 'pattern-manager' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'To add a template, click the "Set Pattern" button to open the patterns modal. There, you can search for and select a pattern to use for each template.', 'pattern-manager' ),
			],
			'completionData'     => [
				'type'    => 'elementExists',
				'element' => [
					'role' => 'button',
					'name' => [
						__( 'Change Pattern', 'pattern-manager' ),
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
				'name' => __( 'Save Theme Settings', 'pattern-manager' ),
			],
			'beaconPosition'     => 'top',
			'initialData'        => [
				'html' => __( 'When you\'ve finished selecting your theme templates above, click the "Save Theme Settings" button to save templates to your theme.', 'pattern-manager' ),
			],
			'completionData'     => [
				'html'    => __( 'Congratulations! Your theme was saved.', 'pattern-manager' ),
				'type'    => 'elementExists',
				'element' => [
					'role' => 'dialog',
					'name' => [
						__( 'Theme Saved', 'pattern-manager' ),
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
				'name' => __( 'Pattern Editor', 'pattern-manager' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Create and Edit pre-defined patterns for use in any theme you design using the Pattern Editor.', 'pattern-manager' ),
			],
			'navigation'         => [
				'backButton' => true,
				'nextButton' => true,
			],
		],
		[ // Theme.json Editor.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Theme.json Editor', 'pattern-manager' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Create and edit theme.json files for use in any theme you design.', 'pattern-manager' ),
			],
			'navigation'         => [
				'backButton' => true,
				'nextButton' => true,
			],
		],
		[ // Finish.
			'highlightedElement' => [
				'role' => 'button',
				'name' => __( 'Theme.json Editor', 'pattern-manager' ),
			],
			'beaconPosition'     => 'right',
			'initialData'        => [
				'html' => __( 'Congratulations! You\'ve completed the Pattern Manager Tour.', 'pattern-manager' ),
			],
			'navigation'         => [
				'backButton' => true,
				'nextButton' => false,
			],
		],
	],
];
