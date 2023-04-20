<?php
/**
 * Class GetVersionControlTest
 *
 * @package pattern-manager
 */

namespace PatternManager\GetVersionControl;

use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/get-version-control.php';
require_once GetVersionControlTest::get_mock_theme_directory() . '/functions.php';

/**
 * Test the app.
 */
class GetVersionControlTest extends WP_UnitTestCase {
	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();
		add_filter( 'request_filesystem_credentials', '__return_true' );
		add_filter( 'muplugins_loaded', [ $this, 'switch_to_test_theme' ] );
	}

	/**
	 * @inheritDoc
	 */
	public function tearDown() {
		remove_filter( 'request_filesystem_credentials', '__return_true' );
		remove_filter( 'muplugins_loaded', [ $this, 'switch_to_test_theme' ] );
		parent::tearDown();
	}

	/**
	 * Static method to get the mock theme directory.
	 */
	public static function get_mock_theme_directory() {
		return __DIR__ . '/fixtures/themes/test-theme';
	}

	/**
	 * Switches to test-theme while running tests in this class.
	 */
	public function switch_to_test_theme() {
		register_theme_directory( __DIR__ . '/fixtures/themes' );
		switch_theme( 'test-theme' );
	}

	/**
	 * Check that the test theme is active.
	 */
	public function test_test_theme_is_active() {
		$this->assertTrue( 'test-theme' == wp_get_theme(), 'Test setup failed to switch theme to test-theme.' );
	}

	/**
	 * Gets the mock theme directory.
	 */
	public function test_test_theme_contains_git_folder() {
		$this->assertDirectoryExists( self::get_mock_theme_directory() . '/.git', 'Git directory is missing from test-theme fixture.' );
	}

	/**
	 * Tests check_for_git_in_theme.
	 */
	public function test_check_for_git_in_theme() {
		$this->assertTrue( (boolean) check_for_git_in_theme(), 'Failed to find git directory in test-theme.' );
	}
}
