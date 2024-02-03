import { ChevronRight } from 'lucide-react'
import { FC, useEffect, useRef, useState } from 'react'

const TRANSLATE_AMOUNT = 200


interface ICategoryPillsProps {
	categories: string[]
}

const CategoryPills: FC<ICategoryPillsProps> = ({categories}) => {
	const [translate, setTranslate] = useState(0)
	const [isLeftVisible, setIsLeftVisible] = useState(false)
	const [isRightVisible, setIsRightVisible] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<string>(categories.at(0)!)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (containerRef.current == null) return

		const observer = new ResizeObserver(entries => {
			const container = entries[0]?.target

			if (container == null) return

			setIsLeftVisible(translate > 0)
			setIsRightVisible(
				translate + container.clientWidth < container.scrollWidth
			)
		})

		observer.observe(containerRef.current)

		return () => {
			observer.disconnect()
		}
	}, [categories, translate])

	const onLeftScroll = () =>
		setTranslate(translate => {
			const newTranslate = translate - TRANSLATE_AMOUNT
			if (newTranslate <= 0) return 0
			return newTranslate
		})

	const onRightScroll = () =>
		setTranslate(translate => {
			if (containerRef.current == null) return translate
			const newTranslate = translate + TRANSLATE_AMOUNT
			const edge = containerRef.current.scrollWidth
			const width = containerRef.current.clientWidth
			if (newTranslate + width >= edge) return edge - width
			return newTranslate
		})

	return (
		<div className="sticky top-0 bg-background z-10 pb-5">
			<div ref={containerRef} className="relative overflow-hidden bg-card">
				<div
					className="flex whitespace-nowrap gap-3 transition-transform duration-300 w-[max-content] overflow-x-hidden"
					style={{ transform: `translateX(-${translate}px)` }}
				>
					{categories.map((category, index) => (
						<button
							key={index}
							onClick={() => setSelectedCategory(category)}
							className={`${
								selectedCategory === category
									? 'bg-secondary-foreground text-muted'
									: 'bg-secondary text-muted-foreground'
							} py-1 px-3 transition-colors duration-300 rounded-lg whitespace-nowrap`}
							children={category}
						/>
					))}
				</div>

				{isLeftVisible && (
					<div
						className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-background from-50% to-transparent w-24 h-full  flex justify-start">
						<button
							className="h-full rotate-180 aspect-square w-auto p-1.5 text-card-foreground hover:bg-secondary rounded-full flex items-center justify-center"
							onClick={onLeftScroll}
						>
							<ChevronRight />
						</button>
					</div>
				)}

				{isRightVisible && (
					<div
						className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-background from-50% to-transparent w-24 h-full flex justify-end">
						<button
							className="h-full aspect-square w-auto p-1.5 text-card-foreground hover:bg-secondary rounded-full flex items-center justify-center"
							onClick={onRightScroll}
						>
							<ChevronRight />
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default CategoryPills
