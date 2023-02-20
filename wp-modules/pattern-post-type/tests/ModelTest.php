<?php
/**
 * Class ModelTest
 *
 * @package pattern-manager
 */

namespace PatternManager\PatternPostType;

use stdClass;
use WP_UnitTestCase;

require_once dirname( __DIR__ ) . '/model.php';

/**
 * Test the model.
 */
class ModelTest extends WP_UnitTestCase {

	/**
	 * Tests ignore_title_field_in_revisions.
	 */
	public function test_ignore_title_field_in_revisions_wrong_post() {
		$post              = new stdClass();
		$post->post_parent = $this->factory()->post->create( [ 'post_type' => 'page' ] )->ID;

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
					'post_parent' => $this->factory()->post->create( [ 'post_type' => 'pm_pattern' ] )->ID,
				]
			)
		);
	}

	/**
	 * Tests ignore_title_field_in_revisions.
	 */
	public function test_ignore_title_field_in_revisions_correct_post() {
		$post              = new stdClass();
		$post->post_parent = $this->factory()->post->create( [ 'post_type' => 'pm_pattern' ] )->ID;
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
}
