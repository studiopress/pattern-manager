<?php
/**
 * Class GetVersionControlTest
 *
 * @package pattern-manager
 */

namespace PatternManager\GetVersionControl;

use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/get-version-control.php';

/**
 * Test the `get-version-control` module.
 */
class GetVersionControlTest extends WP_UnitTestCase {
	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();
		add_filter( 'template_directory', [ $this, 'get_template_directory' ] );
	}

	/**
	 * @inheritDoc
	 */
	public function tearDown() {
		remove_filter( 'template_directory', [ $this, 'get_template_directory' ] );
		parent::tearDown();
	}

	/**
	 * Get the mock theme directory.
	 */
	public function get_mock_theme_directory() {
		return __DIR__ . '/fixtures/themes/mock-theme';
	}

	/**
	 * Override `get_template_directory()` while running tests in this class.
	 */
	public function get_template_directory() {
		return $this->get_mock_theme_directory();
	}

	/**
	 * Tests that the `test-theme` fixture was properly setup.
	 */
	public function test_test_theme_contains_git_folder() {
		$this->assertDirectoryExists( $this->get_mock_theme_directory() . '/.git', 'Git directory is missing from test-theme fixture.' );
	}

	/**
	 * Tests `check_for_git_in_theme()` from the `get-version-control` module.
	 */
	public function test_check_for_git_in_theme() {
		$this->assertTrue( (bool) check_for_git_in_theme() );
	}
}
