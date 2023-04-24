# Pattern Manager
Contributors: wpengine, ryankienstra, mikeday, dreamwhisper, mmcalister, johnstonphilip
Donate link: https://wpengine.com
Tags: pattern, patterns, pattern design, pattern builder, block patterns
Requires at least: 6.1
Tested up to: 6.2
Stable tag: 0.1.7
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Manage your theme's pattern PHP files the easy way, with Pattern Manager by WP Engine.

## Description

*Note: Pattern Manager is currently in beta.*

When you design beautiful block patterns for your theme, Pattern Manager by WP Engine will automatically push them into PHP files for you, every time you save. With a dedicated studio to design and build block patterns you can 10x your ability to work effectively with patterns.

### Key Features of Pattern Manager by WP Engine
 * A dedicated place to build and design Block Patterns.
 * Save (and generate) pattern files directly to disk in your theme (no exporting needed).
 * Patterns available come from your theme on the disk, allowing for easy collaboration with git.
 * Images used in patterns are auto-copied into your theme and referenced in the PHP pattern file.
 * No more copying and pasting code to files.
 * No more copying and pasting images to your theme.
 * Browse all your patterns by their preview thumbnails.
 * Create patterns and edit them later.
 * Easy discovery and use of hidden WordPress core pattern features.

### Things you can do with Pattern Manager:
 * Create a pattern with a click.
 * Duplicate a pattern.
 * Delete a pattern.
 * Rename a pattern.
 * Utilize hidden WordPress core pattern features.
 * Save a pattern to a php file in your theme.

### Hidden WP core pattern features you can unlock with Pattern Manager:
 * When a user makes a new page or post, auto-show a modal with your patterns, available to be used.
 * Make your pattern available in the block inserter, or choose to hide it from the inserter.
 * Allow users to transform any block into your pattern.

### Upon every "save" of a pattern, Pattern Manager will do the following:
 * Create/update the pattern PHP file on your disk, in your theme.
 * Find and replace all local image urls with the correct PHP tag.
 * Find and copy all image files used into your theme.


## Help & Docs

User and developer docs for Pattern Manager [can be found here](https://developer.wpengine.com/pattern-manager/).

## Installation

This plugin can be installed directly from your site.

1. Log in and navigate to Plugins &rarr; Add New.
2. Type "Pattern Manager" into the Search and hit Enter.
3. Locate the Pattern Manager plugin in the list of search results and click **Install Now**.
4. Once installed, click the Activate link.

It can also be installed manually.

1. Download the Pattern Manager plugin from WordPress.org.
2. Unzip the package and move to your plugins directory.
3. Log into WordPress and navigate to the Plugins screen.
4. Locate Pattern Manager in the list and click the *Activate * link.

## Frequently Asked Questions

### Can I choose where my pattern files get saved?

No. WordPress core naturally imports patterns located in any theme's "patterns" directory. In keeping with that WordPress standard, Pattern Manager only saves pattern files to that location at this time.

### Will I lose my patterns if I update my theme?

Yes. Pattern Manager is designed to be used by theme creators, ideally in a local environment like https://localwp.com. If you are not building a theme, it is recommended that you create a child theme and install it so that updates do not wipe out your pattern files.

### Can Pattern Manager be used with any theme?

While Pattern Manager will add patterns to any theme, it is recommended that you own and control the code of that theme. If you do not control the code of your theme, it is recommended that you create a child theme and install it so that updates do not wipe out your pattern files.

### Should I use Pattern Manager on a "live" website?
Ideally, no. It is recommended that you develop your patterns on a locally hosted website. You can easily set up a local development WordPress on your computer using https://localwp.com

### Do I need the new block editor to use Pattern Manager?

Yes, you will need to have WordPress 6.1 or later installed to take advantage of Pattern Manager.

## Screenshots

1. A dedicated inferface to browse, design, build, and save WordPress pattern files.
2. Easily assign pattern categories, keywords, descriptions, and more.

## Changelog

### 0.1.7
* Add a link to the GitHub repo.

### 0.1.6
 * Readme file changes.

### 0.1.5
 * Initial release.
