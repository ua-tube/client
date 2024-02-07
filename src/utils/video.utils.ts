import { getVideoUrl } from './'

const writeVideoUrl = async (videoId?: string, time?: number) => await navigator.clipboard.writeText(getVideoUrl(videoId, time))

const formatNumbers = (v: number = 0, locale = 'uk') => Intl.NumberFormat(locale, { notation: 'compact' }).format(v)

const shakeConfetti = async (shapedText: string | undefined) => {
	const confetti = (await import('canvas-confetti')).default
	Array(shapedText ? 5 : 10).fill(null).forEach(() => confetti({
		...(shapedText && { shapes: [confetti.shapeFromText({ text: shapedText, scalar: 10 })] }),
		particleCount: shapedText ? 100 : 200,
		startVelocity: 30,
		spread: 360,
		origin: { x: Math.random(), y: Math.random() - 0.2 }
	}))
}

export { writeVideoUrl, formatNumbers, shakeConfetti }