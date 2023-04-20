<?php
/**
 * Class BlockTest
 *
 * @package pattern-manager
 */

namespace PatternManager\Editor;

use stdClass;
use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/block.php';

/**
 * Test the block.
 */
class BlockTest extends WP_UnitTestCase {

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();
		add_filter( 'stylesheet_directory', [ $this, 'get_fixtures_directory' ] );
	}

	/**
	 * @inheritDoc
	 */
	public function tearDown() {
		unset( $_REQUEST['is_pm_pattern'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
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
	 * Tests render_pm_pattern_block.
	 */
	public function test_render_pm_pattern_block_empty_arguments() {
		$this->assertSame(
			'Initial content',
			render_pm_pattern_block(
				'Initial content',
				[],
				new stdClass()
			)
		);
	}

	/**
	 * Tests render_pm_pattern_block.
	 */
	public function test_render_pm_pattern_block_no_query_arg() {
		$this->assertSame(
			'Initial content',
			render_pm_pattern_block(
				'Initial content',
				[
					'blockName' => 'core/pattern',
					'attrs'     => [ 'slug' => 'my-new-pattern' ],
				],
				new stdClass()
			)
		);
	}

	/**
	 * Tests render_pm_pattern_block.
	 */
	public function test_render_pm_pattern_block_with_query_arg() {
		$_REQUEST['is_pm_pattern'] = true;

		$this->assertSame(
			'<p>Here is some content</p>',
			trim(
				render_pm_pattern_block(
					'Initial content',
					[
						'blockName' => 'core/pattern',
						'attrs'     => [ 'slug' => 'my-new-pattern' ],
					],
					new stdClass()
				)
			)
		);
	}
}
