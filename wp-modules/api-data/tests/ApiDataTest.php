<?php
/**
 * Class ApiDataTest
 *
 * @package pattern-manager
 */

namespace PatternManager\ApiData;

use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/api-data.php';

/**
 * Test the api functions.
 */
class ApiDataTest extends WP_UnitTestCase {

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();
		add_filter( 'request_filesystem_credentials', '__return_true' );
		add_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );
	}

	/**
	 * @inheritDoc
	 */
	public function tearDown() {
		remove_filter( 'request_filesystem_credentials', '__return_true' );
		remove_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );
		parent::tearDown();
	}

	/**
	 * Gets the fixtures directory.
	 */
	public function get_fixtures_directory() {
		return dirname( dirname( __DIR__ ) ) . '/pattern-data-handlers/tests/fixtures';
	}
	/**
	 * Tests register_routes.
	 */
	public function test_register_routes() {
		$this->assertCount(
			2,
			rest_get_server()->get_routes( 'pattern-manager/v1' )
		);
	}

	/**
	 * Tests register_routes.
	 */
	public function test_register_routes_get_pattern_names() {
		$this->assertEquals(
			[
				'my-new-pattern',
				'with-image',
			],
			rest_get_server()->response_to_data(
				rest_do_request( new WP_REST_Request( 'GET', 'pattern-manager/v1/get-pattern-names' ) )
			)
		);
	}
}
