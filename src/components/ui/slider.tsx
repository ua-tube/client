import { cn } from '@/utils'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

interface ISliderProps {
	thumbClassName?: string
	trackClassName?: string
	rangeClassName?: string
}

const Slider = forwardRef<
	ElementRef<typeof SliderPrimitive.Root>,
	ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & ISliderProps
>(
	(
		{ className, thumbClassName, trackClassName, rangeClassName, ...props },
		ref
	) => (
		<SliderPrimitive.Root
			ref={ref}
			className={cn(
				'relative flex w-full touch-none select-none items-center',
				className
			)}
			{...props}
		>
			<SliderPrimitive.Track
				className={cn(
					'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
					trackClassName
				)}
			>
				<SliderPrimitive.Range
					className={cn('absolute h-full bg-primary', rangeClassName)}
				/>
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb
				className={cn(
					'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
					thumbClassName
				)}
			/>
		</SliderPrimitive.Root>
	)
)

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
