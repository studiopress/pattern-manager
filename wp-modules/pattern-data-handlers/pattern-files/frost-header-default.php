<?php
/**
 * Frost: Header with site title, navigation.
 *
 * @package fse-studio
 */

return array(
	'title'         => __( 'Header with site title, navigation.', 'fse-studio' ),
	'name'          => 'frost-header-default',
	'categories'    => array( 'frost-header' ),
	'viewportWidth' => 1280,
	'content'       => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"30px","bottom":"30px"}}},"layout":{"inherit":true}} -->
<div class="wp-block-group alignfull" style="padding-top:30px;padding-bottom:30px"><!-- wp:group {"align":"wide","layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:site-title /-->

<!-- wp:navigation {"layout":{"type":"flex","orientation":"horizontal"}} -->
<!-- wp:page-list /-->
<!-- /wp:navigation --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->',
);
