<?php
/**
 * Class PatternDataHandlersTest
 *
 * @package pattern-manager
 */

// phpcs:disable WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

namespace PatternManager\PatternDataHandlers;

require_once dirname( __DIR__ ) . '/pattern-data-handlers.php';

use WP_UnitTestCase;
use function WP_Filesystem;

/**
 * Test the pattern functions.
 */
class PatternDataHandlersTest extends WP_UnitTestCase {

	/**
	 * @inheritDoc
	 */
	public function set_up() {
		parent::set_up();
		add_filter( 'request_filesystem_credentials', '__return_true' );
		add_filter( 'filesystem_method_file', array( $this, 'filter_abstraction_file' ) );
		add_filter( 'filesystem_method', array( $this, 'filter_fs_method' ) );
		add_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );
		WP_Filesystem();
	}

	/**
	 * @inheritDoc
	 */
	public function tear_down() {
		global $wp_filesystem;
		remove_filter( 'request_filesystem_credentials', '__return_true' );
		remove_filter( 'filesystem_method_file', array( $this, 'filter_abstraction_file' ) );
		remove_filter( 'filesystem_method', array( $this, 'filter_fs_method' ) );
		remove_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );
		unset( $wp_filesystem );

		parent::tear_down();
	}

	/**
	 * Filters the FS method.
	 */
	public function filter_fs_method( $method ) {
		return 'MockFS';
	}

	/**
	 * Filters the abstraction file.
	 */
	public function filter_abstraction_file( $file ) {
		return WP_TESTS_DIR . '/includes/mock-fs.php';
	}

	/**
	 * Gets the fixtures directory.
	 */
	public function get_fixtures_directory() {
		return __DIR__ . '/fixtures';
	}

	/**
	 * Normalizes in order to compare in tests.
	 */
	public function normalize( string $to_normalize ): string {
		return preg_replace( '/[\t\n]/', '', $to_normalize );
	}

	/**
	 * Test tree_shake_theme_images.
	 */
	public function test_tree_shake_theme_images() {
		global $wp_filesystem;
		$wp_filesystem->init( ABSPATH );

		move_block_images_to_theme(
			get_pattern_by_name( 'with-image' )['content']
		);
		tree_shake_theme_images();

		// Tree shaking shouldn't remove this, as it's in a pattern.
		$this->assertTrue(
			$wp_filesystem->exists(
				$this->get_fixtures_directory() . '/patterns/images/WPE-ShareImage-A-1200x630-1.png'
			)
		);

		// Tree shaking should remove this, as it's not in a pattern.
		$this->assertFalse(
			$wp_filesystem->exists(
				$this->get_fixtures_directory() . '/patterns/images/not-used.png'
			)
		);
	}
}
