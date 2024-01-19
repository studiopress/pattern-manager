<?php
/**
 * Class GetEnviromentTest
 *
 * @package pattern-manager
 */

namespace PatternManager\GetEnviroment;

use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/get-environment.php';

/**
 * Test the `get-environment` module.
 */
class GetEnvironmentTest extends WP_UnitTestCase {
	private $user_id;

	/**
	 * @inheritDoc
	 */
	public function setUp(): void {
		parent::setUp();

		$this->user_id = $this->factory->user->create();
		wp_set_current_user( $this->user_id );
		update_user_meta( $this->user_id, get_environment_meta_key(), $this->get_mock_dismissed_sites() );
	}

	/**
	 * @inheritDoc
	 */
	public function tearDown(): void {
		delete_user_meta( $this->user_id, get_environment_meta_key() );
		wp_delete_user( $this->user_id );

		parent::tearDown();
	}

	private function get_mock_dismissed_sites() {
		return [ 1, 2, 3 ];
	}

	private function get_mock_non_dismissed_site() {
		return 4;
	}

	/**
	 * Tests `get_dismissed_themes()` from the `get-environment` module.
	 */
	public function test_get_dismissed_sites() {
		$this->assertSame( $this->get_mock_dismissed_sites(), get_dismissed_sites() );
	}

	/**
	 * Tests `check_environment_notice_should_show()` from the `get-environment` module.
	 */
	public function test_check_environment_notice_should_show() {
		// Test that a local site should not show the notice if already dismissed.
		$dismissed_site_id = $this->get_mock_dismissed_sites()[0];
		$this->assertFalse( (bool) check_environment_notice_should_show( $dismissed_site_id, 'local' ) );

		// Test that a local site should not show the notice, even if not dismissed.
		$this->assertFalse( (bool) check_environment_notice_should_show( $this->get_mock_non_dismissed_site(), 'local' ) );

		// Test that a production site shows the notice if not dismissed yet.
		$this->assertTrue( (bool) check_environment_notice_should_show( $this->get_mock_non_dismissed_site(), 'production' ) );

		// Test that a production site does not show the notice if it has been dismissed.
		$this->assertFalse( (bool) check_environment_notice_should_show( $dismissed_site_id, 'production' ) );
	}

	/**
	 * Tests `check_site_dismissed()` from the `get-environment` module.
	 */
	public function test_check_site_dismissed() {
		$dismissed_site_id = $this->get_mock_dismissed_sites()[0];
		$this->assertTrue( (bool) check_site_dismissed( $dismissed_site_id ) );
		$this->assertFalse( (bool) check_site_dismissed( $this->get_mock_non_dismissed_site() ) );
	}
}
