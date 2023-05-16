<?php
/**
 * Class ApiDataTest
 *
 * @package pattern-manager
 */

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound

namespace PatternManager\ApiData;

use WP_UnitTestCase;
use WP_REST_Request;

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
		unset( $GLOBALS['wp_rest_server'] );
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
	public function test_register_routes_get_pattern_names_unauthorized() {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'author' ] ) );
		do_action( 'rest_api_init' );

		$this->assertSame(
			'rest_forbidden',
			rest_do_request( new WP_REST_Request( 'GET', '/pattern-manager/v1/get-pattern-names' ) )->get_data()['code']
		);
	}

	/**
	 * Tests register_routes.
	 */
	public function test_register_routes_authorized() {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );
		do_action( 'rest_api_init' );

		$this->assertSame(
			[
				'/pattern-manager/v1',
				'/pattern-manager/v1/get-pattern-names',
				'/pattern-manager/v1/delete-pattern',
				'/pattern-manager/v1/update-dismissed-themes',
			],
			array_keys( rest_get_server()->get_routes( 'pattern-manager/v1' ) )
		);
	}

	/**
	 * Tests register_routes.
	 */
	public function test_register_routes_get_pattern_names_authorized() {
		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );
		do_action( 'rest_api_init' );

		$this->assertSame(
			[
				'patternFileNames' =>
					[
						'my-new-pattern',
						'with-image',
					],
			],
			rest_do_request( new WP_REST_Request( 'GET', '/pattern-manager/v1/get-pattern-names' ) )->get_data()
		);
	}
}
