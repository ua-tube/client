import {
	createContext,
	FC,
	PropsWithChildren,
	useContext,
	useState
} from 'react'

interface ISidebarContext {
	isLargeOpen: boolean
	isSmallOpen: boolean
	toggle: () => void
	close: () => void
}

const SidebarContext = createContext<ISidebarContext | null>(null)

export function useSidebarContext() {
	const value = useContext(SidebarContext)
	if (value == null) throw Error('Cannot use outside of SidebarProvider')
	return value
}

export const SidebarProvider: FC<PropsWithChildren> = ({ children }) => {
	const [isLargeOpen, setIsLargeOpen] = useState(true)
	const [isSmallOpen, setIsSmallOpen] = useState(false)

	const isScreenSmall = () => window.innerWidth < 1024

	const toggle = () =>
		isScreenSmall() ? setIsSmallOpen(s => !s) : setIsLargeOpen(l => !l)

	const close = () =>
		isScreenSmall() ? setIsSmallOpen(false) : setIsLargeOpen(false)

	return (
		<SidebarContext.Provider
			value={{ isLargeOpen, isSmallOpen, toggle, close }}
			children={children}
		/>
	)
}
