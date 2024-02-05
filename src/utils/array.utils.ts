function getAllElementsFromOrToCurrentElement(array: string[], current: string, from: boolean = false) {
	const i = array.indexOf(current)
	return i > -1 ? !from ? array.slice(0, i) : array.slice(i, array.length) : []
}

export { getAllElementsFromOrToCurrentElement }