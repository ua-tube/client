import { UseState } from '@/interfaces'
import { Skeleton } from '@/components'
import { FC, useState } from 'react'
import dynamic from 'next/dynamic'

const HomeHeaderLogo = dynamic(
	() => import('../../home/header/HomeHeaderLogo'),
	{ loading: () => <Skeleton className='px-4 py-2 rounded-lg' /> }
)

const DashboardHeaderPopover = dynamic(
	() => import('./DashboardHeaderPopover'),
	{ loading: () => <Skeleton className='px-4 py-2 rounded-lg' /> }
)

interface IDashboardHeaderProps {
	setUploadModalShow: UseState<boolean>
}

const DashboardHeader: FC<IDashboardHeaderProps> = ({ setUploadModalShow }) => {
	const [showFullWidthSearch, setShowFullWidthSearch] = useState(false)
	return (
		<div className='flex gap-10 lg:gap-20 justify-between items-center w-full px-4 border-b border-muted fixed top-0 z-10 bg-background/50 backdrop-blur-lg'>
			<HomeHeaderLogo hidden={showFullWidthSearch} />
			<DashboardHeaderPopover
				{...{ showFullWidthSearch, setShowFullWidthSearch, setUploadModalShow }}
			/>
		</div>
	)
}

export default DashboardHeader
