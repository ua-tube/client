import { TooltipProvider, Skeleton } from '@/components/ui'
import { useState } from 'react'
import dynamic from 'next/dynamic'


const HomeHeaderLogo = dynamic(
	() => import( './home-header-logo'),
	{ loading: () => <Skeleton className="px-4 py-2 rounded-lg" /> }
)
const HomeHeaderSearch = dynamic(
	() => import( './home-header-search'),
	{ loading: () => <Skeleton className="w-full max-w-[600px] py-2 rounded-lg" /> }
)
const HomeHeaderPopover = dynamic(
	() => import( './home-header-popover'),
	{ loading: () => <Skeleton className="size-4 rounded-full" /> }
)

const HomeHeader = () => {
	const [showFullWidthSearch, setShowFullWidthSearch] = useState<boolean>(false)

	return (
		<TooltipProvider>
			<div className="flex gap-10 lg:gap-20 justify-between py-2 mx-4">
				<HomeHeaderLogo hidden={showFullWidthSearch} />
				<HomeHeaderSearch {...{ showFullWidthSearch, setShowFullWidthSearch }} />
				<HomeHeaderPopover {...{ showFullWidthSearch, setShowFullWidthSearch }} />
			</div>
		</TooltipProvider>
	)
}

export default HomeHeader
