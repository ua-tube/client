import { FC, useState, useRef, useEffect } from 'react'
import { DynamicIcon, Button } from '@/components'
import { IVideo } from '@/interfaces'
import VideoCard from './video-card'

interface IVideosListPillsProps {
	title?: string
	videos: IVideo[]
}

const VideosPills: FC<IVideosListPillsProps> = ({ videos, title }) => {
	const [translate, setTranslate] = useState(0)
	const [isLeftVisible, setIsLeftVisible] = useState(false)
	const [isRightVisible, setIsRightVisible] = useState(false)
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
	}, [videos, translate])

	const onLeftScroll = () =>
		setTranslate(translate => {
			const newTranslate = translate - 400
			if (newTranslate <= 0) return 0
			return newTranslate
		})

	const onRightScroll = () =>
		setTranslate(translate => {
			if (containerRef.current == null) return translate
			const newTranslate = translate + 400
			const edge = containerRef.current.scrollWidth
			const width = containerRef.current.clientWidth
			if (newTranslate + width >= edge) return edge - width
			return newTranslate
		})

	return (
		<div className="relative">

			{title &&
				<h2
					className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0"
					children={title}
				/>
			}

			{isLeftVisible && (
				<div
					className="absolute -left-5 z-[2] top-1/2  -translate-y-1/2 w-24 h-full flex justify-start">
					<Button
						className="my-auto aspect-square rotate-180 rounded-full h-10"
						children={<DynamicIcon name="chevron-right" className="size-10" />}
						onClick={onLeftScroll}
					/>
				</div>
			)}

			<div ref={containerRef} className="relative overflow-hidden py-5">
				<div
					className="flex whitespace-nowrap gap-x-5 transition-transform duration-300 w-[max-content] overflow-x-hidden"
					style={{ transform: `translateX(-${translate}px)` }}
					children={videos.map((video, index) => (<VideoCard key={index} fixedSize {...video} />))}
				/>
			</div>

			{isRightVisible && (
				<div
					className="absolute -right-5 top-1/2 -translate-y-1/2 w-24 h-full flex justify-end">
					<Button
						className="my-auto aspect-square rounded-full h-10"
						children={<DynamicIcon name="chevron-right" className="size-10" />}
						onClick={onRightScroll}
					/>
				</div>
			)}
		</div>
	)
}

export default VideosPills
