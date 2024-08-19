<?php
/**
 * Plugin Name:       Marquee Carousel
 * Description:       Create simple eye-catching, customizable carousels with lightweight block plugin
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.1
 * Author:            wpspices
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       marquee-carousel
 *
 * @package           marquee-carousel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */


// If this file is called directly, abort.
defined( 'ABSPATH' ) || exit;

// Check if class exists
if ( ! class_exists( 'Marquee_Carousel' ) ) {

	class Marquee_Carousel {

		public $version = '0.1.1';

		// The instance of this class
		private static $instance = null;

		// Returns the instance of this class.
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		public function __construct() {
			// Register block
			add_action( 'init', array( $this, 'register_blocks_and_scripts' ) );
			add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_script' ) );
			add_filter( 'render_block', array( $this, 'render_slide_group' ), 99, 3 );
		}

		public function register_blocks_and_scripts() {
			if ( ! function_exists( 'register_block_type' ) ) {
				return;
			}
			// Marquee carousel block
			register_block_type( 
				__DIR__ . '/build',
				array(
					'render_callback' => array( $this, 'render_marquee_carousel' ),
				) 
			);

			// Child Marquee slide group block
			register_block_type( 
				__DIR__ . '/build/slide-group'
			);

			// Child Marquee slide block
			register_block_type( __DIR__ . '/build/slide' );
		}

		public function enqueue_editor_script() {
			//Provide data for block
			wp_localize_script(
				'wpspices-marquee-carousel-editor-script',
				'marqueeBlockData',
				array(
					'assets_url' => esc_url( plugins_url( 'assets/img/', __FILE__ ) ),
				)
			);
		}

		//render marquee carousel
		public function render_marquee_carousel( $attributes, $content, $block ) {

			// add style
			if ( function_exists( 'wp_add_inline_style' ) && ! empty( $attributes['extraStyle'] ) ) {
				wp_add_inline_style( 
					'wp-block-library',  
					esc_html( $attributes['extraStyle'] )
				);
			}
			
			return $content;
		}

		//render slide group
		public function render_slide_group(  $content, $block, $block_instance ) {
			if ( is_null( $content ) || ! isset( $block['blockName'] ) || 'wpspices/marquee-carousel-slide-group' != $block['blockName'] ) {
				return $content;
			}
		
			return $content . ' ' . $content . ' ' . $content;
		}
	}

	Marquee_Carousel::get_instance();
}