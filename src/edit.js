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
	InspectorControls,
	InnerBlocks, 
	useBlockProps, 
	useInnerBlocksProps,
	store as blockEditorStore, 
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

import {
	PanelBody,
	RangeControl,
} from '@wordpress/components';


import { useSelect } from '@wordpress/data';
import UnitRangeControl from './components/UnitRangeControl';

import { mcEmpty, mcGenerateUniqueId } from './helper';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

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
	clientId
}) {
	
	const {
		animID,
		animDuration = '15s',
		imgHeight = '32',
		slideGap = '2rem',
		slideInnerGap = '0.8rem',
		mcClass,
		extraStyle
	} = attributes;

	/** Initialize block */
	useEffect( () => {
		let shouldIntialize = true;
		if ( shouldIntialize && mcEmpty( animID ) ) {
			const mcID = mcGenerateUniqueId();
			setAttributes({
				animID: mcID,
				mcClass: mcID
			});
		}
		
		//cleanup
		return () => {
			shouldIntialize = false;
		};
		
	}, [] );

	const { hasChildBlocks } = useSelect(
		( select ) => {
			const { getBlockOrder } =
				select( blockEditorStore );
			return {
				hasChildBlocks: getBlockOrder( clientId ).length > 0
			};
		},
		[ clientId ]
	);

	const isChildBlockSelected = useSelect( ( select ) => select( 'core/block-editor' ).hasSelectedInnerBlock( clientId, true ) );

	const playMarquee = ! mcEmpty( isChildBlockSelected ) && ! isChildBlockSelected && hasChildBlocks;

	const SLIDE = [
		[
			'wpspices/marquee-carousel-slide-group',
			{
				style: {
					spacing: {
						blockGap: slideGap,
						padding: {
							right: slideGap
						}
					}
				}
			}
		]
	];

	const setAnimStyle = ( duration ) => {
		duration = duration+'s';
		setAttributes( { 
			animDuration: duration,
			extraStyle: ` .${animID}{--wpspices--marquee-carousel-anim-duration: ${duration};} `
		} )
		
	}

	const blockProps = useBlockProps({
		className: mcClass,
	});

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps );

	return (
		<div { ...blockProps }>
			{
				playMarquee ?
				<>
					<style>
					{ extraStyle }
					</style>
					{ children }
					{ children }
					{ children }
				</>:
				<InnerBlocks
				template={ SLIDE }
				templateLock='insert'
				allowedBlocks={ ['wpspices/marquee-carousel-slide-group'] }
			/>
			}
			<InspectorControls>
				<PanelBody title={ __('Settings', 'marquee-carousel') } initialOpen={ true }>
					<RangeControl
						label={ __('Animation Duration', 'marquee-carousel') }
						value={ parseInt( animDuration ) }
						onChange={ ( duration ) => setAnimStyle( duration ) }
						min={ 1 }
						max={ 100 }
					/>
					<RangeControl
						label={ __('Image height', 'marquee-carousel') }
						value={ parseInt( imgHeight ) }
						onChange={ ( imgHeight ) => setAttributes( { imgHeight } ) }
						min={ 24 }
						max={ 500 }
					/>
				</PanelBody>
				<PanelBody title={ __('Spacing', 'marquee-carousel') } initialOpen={ true }>
					<UnitRangeControl
                        rangeLabel={ __('Slider gap', 'marquee-carousel')  }
                        attrValue={ slideGap }
                        onChangeFunc={ ( slideGap ) => setAttributes( { slideGap } ) }
                        rangeMin={ 0 }
                        rangeMax={ {
                            px: 200,
                            em: 10,
                            rem: 10,
                        } }
                        rangeStep={ 1 }
                    />
					<UnitRangeControl
                        rangeLabel={ __('Slider inner gap', 'marquee-carousel')  }
                        attrValue={ slideInnerGap }
                        onChangeFunc={ ( slideInnerGap ) => setAttributes( { slideInnerGap } ) }
                        rangeMin={ 0 }
                        rangeMax={ {
                            px: 200,
                            em: 10,
                            rem: 10,
                        } }
                        rangeStep={ 1 }
                    />
				</PanelBody>
			
			</InspectorControls>
		</div>
	);
}
