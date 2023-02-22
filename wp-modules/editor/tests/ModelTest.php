<?php
/**
 * Class ModelTest
 *
 * @package pattern-manager
 */

namespace PatternManager\Editor;

use stdClass;
use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/model.php';

/**
 * Test the model.
 */
class ModelTest extends WP_UnitTestCase {

	/**
	 * Tests add_active_theme_to_heartbeat.
	 */
	public function test_add_active_theme_to_heartbeat_wrong_post() {
		$this->assertSame(
			[ 'refresh-nonces' => true ],
			add_active_theme_to_heartbeat(
				[ 'refresh-nonces' => true ],
				[],
				'post'
			)
		);
	}

	/**
	 * Tests add_active_theme_to_heartbeat.
	 */
	public function test_add_active_theme_to_heartbeat_correct_post() {
		$this->assertTrue(
			array_key_exists(
				'activeTheme',
				add_active_theme_to_heartbeat(
					[ 'refresh-nonces' => true ],
					[],
					'pm_pattern'
				)
			)
		);
	}

	/**
	 * Tests ignore_title_field_in_revisions.
	 */
	public function test_ignore_title_field_in_revisions_wrong_post() {
		$post              = new stdClass();
		$post->post_parent = $this->factory()->post->create( [ 'post_type' => 'page' ] );

		$this->assertSame(
			[
				'post_title'  => 'Example Title',
				'post_author' => 123,

			],
			ignore_title_field_in_revisions(
				[
					'post_title'  => 'Example Title',
					'post_author' => 123,
				],
				$post
			)
		);
	}

	/**
	 * Tests ignore_title_field_in_revisions.
	 */
	public function test_ignore_title_field_in_revisions_array_post() {
		$this->assertSame(
			[
				'post_title'  => 'my-new-pattern',
				'post_author' => 123,
			],
			ignore_title_field_in_revisions(
				[
					'post_title'  => 'my-new-pattern',
					'post_author' => 123,
				],
				[
					'post_parent' => $this->factory()->post->create( [ 'post_type' => 'pm_pattern' ] ),
				]
			)
		);
	}

	/**
	 * Tests ignore_title_field_in_revisions.
	 */
	public function test_ignore_title_field_in_revisions_correct_post() {
		$post              = new stdClass();
		$post->post_parent = $this->factory()->post->create( [ 'post_type' => 'pm_pattern' ] );

		$this->assertSame(
			[ 'post_author' => 123 ],
			ignore_title_field_in_revisions(
				[
					'post_title'  => 'my-new-pattern',
					'post_author' => 123,
				],
				$post
			)
		);
	}

	/**
	 * Tests delete_pattern_posts.
	 */
	public function test_delete_pattern_posts_wrong_post() {
		for ( $i = 0; $i < 5; $i++ ) {
			$this->factory()->post->create();
		}

		$this->assertCount( 5, get_posts() );

		delete_pattern_posts();

		$this->assertCount( 5, get_posts() );
	}

	/**
	 * Tests delete_pattern_posts.
	 */
	public function test_delete_pattern_posts_correct_post() {
		for ( $i = 0; $i < 5; $i++ ) {
			$this->factory()->post->create( [ 'post_type' => 'pm_pattern' ] );
		}

		$this->assertCount(
			5,
			get_posts( [ 'post_type' => 'pm_pattern ' ] )
		);

		delete_pattern_posts();

		$this->assertCount(
			0,
			get_posts( [ 'post_type' => 'pm_pattern ' ] )
		);
	}
}
