import { IProcessedVideo } from '@/interfaces'

function getAllQualitiesFromOrToCurrentElement(
	array?: IProcessedVideo[],
	current?: IProcessedVideo,
	from: boolean = false
) {
	const qualities = array?.map(p => p.label)
	const i = qualities?.indexOf(current?.label || '')
	return (i || 0) > -1 ? !from ? array?.slice(0, i) : array?.slice(i, array.length) : []
}

export { getAllQualitiesFromOrToCurrentElement }
