<?php
/**
 * Frost: Footer with text, links.
 *
 * @package fse-studio
 */

return array(
	'title'         => __( 'Footer with text, links.', 'fse-studio' ),
	'name'          => 'frost-footer-default',
	'categories'    => array( 'frost-footer' ),
	'viewportWidth' => 1280,
	'content'       => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"40px","bottom":"40px"}}},"className":"has-small-font-size","layout":{"inherit":true}} -->
<div class="wp-block-group alignfull has-small-font-size" style="padding-top:40px;padding-bottom:40px"><!-- wp:group {"align":"wide","layout":{"type":"flex","allowOrientation":false,"justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:paragraph -->
<p>© 2022 Your Company LLC · <a href="#">Contact Us</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a href="#">Facebook</a>&nbsp;·&nbsp;<a href="#">Twitter</a>&nbsp;·&nbsp;<a href="#">Instagram</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->',
);
