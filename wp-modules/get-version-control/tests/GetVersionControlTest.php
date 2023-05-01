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
	private $user_id;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->user_id = $this->factory->user->create();
		wp_set_current_user( $this->user_id );
		update_user_meta( $this->user_id, get_version_control_meta_key(), $this->get_mock_dismissed_themes() );

		add_filter( 'template_directory', [ $this, 'get_template_directory' ] );
	}

	/**
	 * @inheritDoc
	 */
	public function tearDown() {
		remove_filter( 'template_directory', [ $this, 'get_template_directory' ] );

		delete_user_meta( $this->user_id, get_version_control_meta_key() );
		wp_delete_user( $this->user_id );

		parent::tearDown();
	}

	private function get_mock_theme_directory() {
		return __DIR__ . '/fixtures/themes/mock-theme';
	}

	private function get_mock_dismissed_themes() {
		return [ 'Some Theme', 'Another Theme' ];
	}

	private function get_mock_non_dismissed_theme() {
		return 'A Theme Not Saved in User Meta';
	}

	private function get_mock_version_control_folder() {
		return '/version-control-dir';
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
	public function test_test_theme_contains_version_control_folder() {
		$this->assertDirectoryExists( $this->get_mock_theme_directory() . '/version-control-dir', 'Version control directory is missing from test-theme fixture.' );
	}

	/**
	 * Tests `get_dismissed_themes()` from the `get-version-control` module.
	 */
	public function test_get_dismissed_themes() {
		$this->assertSame(
			$this->get_mock_dismissed_themes(),
			get_dismissed_themes(),
		);
	}

	/**
	 * Tests `check_version_control_notice_should_show()` from the `get-version-control` module.
	 */
	public function test_check_version_control_notice_should_show() {
		$this->assertFalse(
			(bool) check_version_control_notice_should_show( $this->get_mock_dismissed_themes()[0] )
		);

		$this->assertTrue(
			(bool) check_version_control_notice_should_show( $this->get_mock_non_dismissed_theme() )
		);

		// Theme name not found in user meta, but user has a version control folder in the path.
		$this->assertFalse(
			(bool) check_version_control_notice_should_show( $this->get_mock_non_dismissed_theme(), $this->get_mock_version_control_folder() )
		);
	}

	/**
	 * Tests `check_for_version_control_in_theme()` from the `get-version-control` module.
	 */
	public function test_check_for_version_control_in_theme() {
		$this->assertTrue( (bool) check_for_version_control_in_theme( $this->get_mock_version_control_folder() ) );

		// Git not used in fixture.
		$this->assertFalse( (bool) check_for_version_control_in_theme( '/.git' ) );
	}

	/**
	 * Tests `check_theme_name_dismissed()` from the `get-version-control` module.
	 */
	public function test_check_theme_name_dismissed() {
		$this->assertTrue( (bool) check_theme_name_dismissed( $this->get_mock_dismissed_themes()[0] ) );

		// Git not used in fixture.
		$this->assertFalse( (bool) check_theme_name_dismissed( $this->get_mock_non_dismissed_theme() ) );
	}
}
