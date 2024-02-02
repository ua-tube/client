const LEADING_ZERO_FORMATTER = new Intl.NumberFormat(undefined, {
	minimumIntegerDigits: 2,
	compactDisplay: 'short'
})

export function formatDuration(duration: number) {
	const hours = Math.floor(duration / 60 / 60)
	const minutes = Math.floor((duration - hours * 60 * 60) / 60)
	const seconds = duration % 60

	if (hours > 0) {
		return `${hours}:${LEADING_ZERO_FORMATTER.format(minutes)}:${LEADING_ZERO_FORMATTER.format(seconds).split(',').at(0)}`
	}

	return `${minutes}:${LEADING_ZERO_FORMATTER.format(seconds).split(',').at(0)}`
}

const formatter = new Intl.RelativeTimeFormat(undefined, {
	numeric: 'always'
})

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
	{ amount: 60, name: 'seconds' },
	{ amount: 60, name: 'minutes' },
	{ amount: 24, name: 'hours' },
	{ amount: 7, name: 'days' },
	{ amount: 4.34524, name: 'weeks' },
	{ amount: 12, name: 'months' },
	{ amount: Number.POSITIVE_INFINITY, name: 'years' }
]

export function formatTimeAgo(date: Date) {
	let duration = (date.getTime() - new Date().getTime()) / 1000

	for (let i = 0; i < DIVISIONS.length; i++) {
		const division = DIVISIONS[i]
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.name)
		}
		duration /= division.amount
	}
}
