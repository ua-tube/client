import { createContext, useContext, FC, PropsWithChildren, useState } from 'react'

interface ISidebarContext {
	isOpen: boolean
	toggle: () => void
}

const SidebarContext = createContext<ISidebarContext | null>(null)

export function useSidebarContext() {
	const value = useContext(SidebarContext)
	if (value == null) throw Error('Cannot use outside of SidebarProvider')
	return value
}

const SidebarProvider: FC<PropsWithChildren> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false)

	const toggle = () => setIsOpen(p => !p)

	return (
		<SidebarContext.Provider
			value={{ toggle, isOpen }}
			children={children}
		/>
	)
}
export default SidebarProvider
