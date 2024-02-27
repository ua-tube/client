import { TooltipProvider, Skeleton } from '@/components/ui'
import { useState } from 'react'
import dynamic from 'next/dynamic'


const HomeHeaderLogo = dynamic(
	() => import( './HomeHeaderLogo'),
	{ loading: () => <Skeleton className="px-4 py-2 rounded-lg" /> }
)
const HomeHeaderSearch = dynamic(
	() => import( './HomeHeaderSearch'),
	{ loading: () => <Skeleton className="w-full max-w-[600px] py-2 rounded-lg" /> }
)
const HomeHeaderPopover = dynamic(
	() => import( './HomeHeaderPopover'),
	{ loading: () => <Skeleton className="size-4 rounded-full" /> }
)

const HomeHeader = () => {
	const [showFullWidthSearch, setShowFullWidthSearch] = useState<boolean>(false)

	return (
		<TooltipProvider>
			<div className="flex gap-10 lg:gap-20 w-full justify-between py-2 px-4 border-b border-muted fixed top-0 z-10 bg-background/50 backdrop-blur-lg">
				<HomeHeaderLogo hidden={showFullWidthSearch} />
				<HomeHeaderSearch {...{ showFullWidthSearch, setShowFullWidthSearch }} />
				<HomeHeaderPopover {...{ showFullWidthSearch, setShowFullWidthSearch }} />
			</div>
		</TooltipProvider>
	)
}

export default HomeHeader
