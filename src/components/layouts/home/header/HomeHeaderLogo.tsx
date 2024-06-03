import { useSidebarContext } from '@/providers'
import { DynamicIcon } from '@/components'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FC } from 'react'
import { useAuth } from '@/hooks'

interface IHomeHeaderLogoProps {
	hidden?: boolean
}

const HomeHeaderLogo: FC<IHomeHeaderLogoProps> = ({ hidden = false }) => {
	const { locale } = useRouter()
	const { toggle, isOpen } = useSidebarContext()
	const { user } = useAuth()

	return (
		<div
			className={`gap-4 items-center flex-shrink-0 ${hidden ? 'hidden' : 'flex'}`}
		>
			{user && <button
				className="rounded-lg hover:bg-muted size-10 flex items-center justify-center p-2.5"
				onClick={() => toggle()}
				children={<DynamicIcon name={isOpen ? 'x' : 'align-justify'} />}
			/>}

			<Link
				href="/"
				className="relative flex space-x-1.5 items-center rounded-lg p-0.5 hover:bg-muted"
			>
				<img src="/logo.png" alt="logo" className="h-6" />
				<span className="font-semibold">UaTube</span>
				<span
					className="absolute uppercase text-muted-foreground text-[0.5rem] font-semibold top-0 -right-3.5"
					children={locale}
				/>
			</Link>
		</div>
	)
}

export default HomeHeaderLogo
