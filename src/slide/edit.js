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
import { 
	InnerBlocks, 
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

import { mcEmpty, mcUcaseFirst } from "../helper";
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
	clientId,
	context
}) {

	const {
		imgName,
		style={}
	} = attributes;

	const {
		updateBlockAttributes //Use to to update block attributes using clientId
	} = useDispatch( blockEditorStore );

	const assets_url = marqueeBlockData.assets_url;
	
	const { 
		marqueeCarouselClientID,
		imageClientIds,
		imageHeight
	} = useSelect(
		( select ) => {
			//get parent marqueeCarousel clientId
			let marqueeCarouselClientID = select( blockEditorStore ).getBlockParentsByBlockName( clientId,'wpspices/marquee-carousel', true );
			marqueeCarouselClientID = mcEmpty( marqueeCarouselClientID ) ? marqueeCarouselClientID: marqueeCarouselClientID[0];

			let imageClientIds = [];
			let imageHeight = '';
			const blocks = select( blockEditorStore ).getBlock( clientId ); 
			if ( ! mcEmpty( blocks ) && ! mcEmpty( blocks.innerBlocks ) && 0 <  blocks.innerBlocks.length  ) {
				//get images client id
				blocks.innerBlocks.forEach( ( block ) => {
					if ( 'core/image' === block.name ) {
						imageClientIds.push( block.clientId );
						imageHeight =  block.attributes?.height;
					}
				});
			}
			
			return {
				marqueeCarouselClientID,
				imageClientIds,
				imageHeight
			};
		},
		[ clientId ]
	);

	const SLIDE = [
		[
			'core/image',
			{
				height: mcEmpty( context['wpspices-marquee-carousel/imgHeight'] ) ? '35px' : context['wpspices-marquee-carousel/imgHeight']+'px' ,
				sizeSlug: 'full',
				url: assets_url+''+imgName+'.svg',
				className: 'marquee-carousel-image',
			},
		],
		[
			'core/paragraph',
			{
				content: __(
					mcUcaseFirst( imgName ),
					'marquee-carousel'
				),
				placeholder: __(
					'Label',
					'marquee-carousel'
				),
				className: 'marquee-carousel-label',
			},
		],
	];

	//Set blockgap
	useEffect( () => {
		let shouldSetGap = true;
		if ( shouldSetGap ) {
			setAttributes({
				style:{
					...style,
					spacing: {
						"blockGap": context['wpspices-marquee-carousel/slideInnerGap']
					}
				}
			})
		}
		
		//cleanup
		return () => {
			shouldSetGap = false;
		};
		
	}, [
		context['wpspices-marquee-carousel/slideInnerGap']
	] );

	//Set Image height
	useEffect( () => {
		let shouldRunImageHeight = true;
		if ( shouldRunImageHeight && imageHeight != context['wpspices-marquee-carousel/imgHeight'] ) {
			if ( ! mcEmpty( imageClientIds ) && 0 < imageClientIds.length ) {
				let imgHeight = context['wpspices-marquee-carousel/imgHeight']+'px';
				imageClientIds.forEach( ( imageClientId ) => {
					updateBlockAttributes( imageClientId, { height: imgHeight } );
				});
			}
		}

		//cleanup
		return () => {
			shouldRunImageHeight = false;
		};
	}, [ context['wpspices-marquee-carousel/imgHeight'] ] );


	const blockProps = useBlockProps();
	const ALLOWED_BLOCKS = [
		'core/image',
		'core/heading',
	];

	return (
		<div { ...blockProps }>
			<InnerBlocks
				template={ SLIDE }
				allowedBlocks={ ALLOWED_BLOCKS }
			/>
		</div>
	);
}
