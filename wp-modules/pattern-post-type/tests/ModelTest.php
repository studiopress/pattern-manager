<?php
/**
 * Class ModelTest
 *
 * @package pattern-manager
 */

namespace PatternManager\PatternPostType;

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
		$this->assertSame(
			[ 'post_title' => 'Example Title' ],
			ignore_title_field_in_revisions(
				[ 'post_title' => 'Example Title' ],
				$this->factory()->post->create(
					[
						'post_parent' => $this->factory()->post->create( [ 'post_type' => 'page' ] )->ID,
					]
				)
			)
		);
	}

	/**
	 * Tests ignore_title_field_in_revisions.
	 */
	public function test_ignore_title_field_in_revisions_correct_post() {
		$this->assertSame(
			[ 'post_title' => 'my-new-pattern' ],
			ignore_title_field_in_revisions(
				[ 'post_title' => 'my-new-pattern' ],
				$this->factory()->post->create(
					[
						'post_parent' => $this->factory()->post->create( [ 'post_type' => 'pm_pattern' ] )->ID,
					]
				)
			)
		);
	}
}