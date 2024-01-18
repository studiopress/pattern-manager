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

	private function get_mock_environment_type_local() {
		return 'local';
	}

	private function get_mock_environment_type_hosted() {
		return 'production';
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
		$this->assertFalse( (bool) check_environment_notice_should_show( $this->get_mock_dismissed_sites()[0] ) );
		$this->assertFalse( (bool) check_environment_notice_should_show( $this->get_mock_non_dismissed_site() ) );
		$this->assertTrue( (bool) check_environment_notice_should_show( $this->get_mock_non_dismissed_site(), $this->get_mock_environment_type_hosted() ) );
	}

	/**
	 * Tests `check_environment_is_local()` from the `get-environment` module.
	 */
	public function test_check_environment_is_local() {
		$this->assertTrue( check_environment( $this->get_mock_environment_type_local() ) );
		$this->assertFalse( check_environment( $this->get_mock_environment_type_hosted() ) );
	}

	/**
	 * Tests `check_site_dismissed()` from the `get-environment` module.
	 */
	public function test_check_site_dismissed() {
		$this->assertTrue( (bool) check_site_dismissed( $this->get_mock_dismissed_sites()[0] ) );
		$this->assertFalse( (bool) check_site_dismissed( $this->get_mock_non_dismissed_site() ) );
	}
}
