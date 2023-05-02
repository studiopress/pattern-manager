<?php
/**
 * Class HelperFunctionsTests
 *
 * @package pattern-manager
 */

namespace PatternManager\HelperFunctions;

use stdClass;
use WP_UnitTestCase;

/**
 * Test the block.
 */
class HelperFunctionsTests extends WP_UnitTestCase {

	/**
	 * Tests do_the_content_things.
	 */
	public function test_do_the_content_things() {
		$the_raw_content_to_test = '<!-- wp:paragraph -->
<p>Test do_shortcode:</p>
<!-- /wp:paragraph -->

<!-- wp:shortcode -->
[audio src="https://test.mp3"]
<!-- /wp:shortcode -->

<!-- wp:paragraph -->
<p>Test wptexturize:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&lt;? \'cause today\'s effort makes it worth tomorrow\'s "holiday" …</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Test convert_smilies:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>:) &lt;3</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Test shortcode_unautop:</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
[audio src="https://test.mp3"]
<!-- /wp:html -->

<!-- wp:paragraph -->
<p>Test wp_filter_content_tags:</p>
<!-- /wp:paragraph -->

<!-- wp:embed {"url":"https://www.youtube.com/watch?v=jNQXAC9IVRw","type":"video","providerNameSlug":"youtube","responsive":true,"className":"wp-embed-aspect-4-3 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube wp-embed-aspect-4-3 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://www.youtube.com/watch?v=jNQXAC9IVRw
</div></figure>
<!-- /wp:embed -->';

		$the_expected_returned_content = '
<p>Test do_shortcode:</p>


<!--[if lt IE 9]><script>document.createElement(\'audio\');</script><![endif]-->
<audio class="wp-audio-shortcode" id="audio-0-1" preload="none" style="width: 100%;" controls="controls"><source type="audio/mpeg" src="https://test.mp3?_=1" /><a href="https://test.mp3">https://test.mp3</a></audio>



<p>Test wptexturize:</p>



<p>&lt;? &#8217;cause today&#8217;s effort makes it worth tomorrow&#8217;s &#8220;holiday&#8221; …</p>



<p>Test convert_smilies:</p>



<p>🙂 &lt;3</p>



<p>Test shortcode_unautop:</p>



<audio class="wp-audio-shortcode" id="audio-0-2" preload="none" style="width: 100%;" controls="controls"><source type="audio/mpeg" src="https://test.mp3?_=2" /><a href="https://test.mp3">https://test.mp3</a></audio>



<p>Test wp_filter_content_tags:</p>



<figure class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube wp-embed-aspect-4-3 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
<iframe title="Me at the zoo" width="500" height="375" src="https://www.youtube.com/embed/jNQXAC9IVRw?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div></figure>
';

		$this->assertSame(
			$the_expected_returned_content,
			do_the_content_things( $the_raw_content_to_test )
		);
	}
}
