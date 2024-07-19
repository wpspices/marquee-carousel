/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

import { mcEmpty } from "../helper";
/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({
	attributes,
	setAttributes,
	context
}) {
	
	const {
		style={}
	} = attributes;

	const slides = () => {
		let slide = [];
		let images = [ 'pinterest', 'twitter', 'wordpress', 'amazon', 'facebook', 'github', 'instagram', 'linkedin' ];
		
		images.forEach( img => {
			slide.push([
				'wpspices/marquee-carousel-slide',
				{
					imgName: img,
					style: {
						spacing: {
							blockGap: "0.5rem"
						}
					}
				}
			]);
		});

		return slide;
	}

	//Set blockgap
	useEffect( () => {
		let shouldSetGap = true;
		if ( shouldSetGap && ! mcEmpty( context['wpspices-marquee-carousel/slideGap'] ) ) {
			setAttributes({
				style:{
					...style,
					spacing: {
						blockGap: context['wpspices-marquee-carousel/slideGap'],
						padding:{
							right: context['wpspices-marquee-carousel/slideGap']
						}
					}
				}
			})
		}
		
		//cleanup
		return () => {
			shouldSetGap = false;
		};
		
	}, [
		context['wpspices-marquee-carousel/slideGap']
	] );

	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<InnerBlocks
				template={ slides() }
				allowedBlocks={ ['wpspices/marquee-carousel-slide'] }
				templateLock={ false }
			/>
		</div>
	);
}
