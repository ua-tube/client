import { DynamicIcon, Input } from '@/components'
import { UseState } from '@/interfaces'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'

interface IHomeHeaderSearchProps {
	showFullWidthSearch: boolean
	setShowFullWidthSearch: UseState<boolean>
}

const HomeHeaderSearch: FC<IHomeHeaderSearchProps> = ({ showFullWidthSearch, setShowFullWidthSearch }) => {
	const [search, setSearch] = useState<string>('')
	const { push } = useRouter()
	const onSearch = async () => await push(`/search?query=${search}`)

	return <div
		className={`gap-4 flex-grow justify-center ${showFullWidthSearch ? 'flex' : 'hidden md:flex'}`}
	>
		{showFullWidthSearch && (
			<button
				onClick={() => setShowFullWidthSearch(false)}
				className="flex-shrink-0 rounded-lg size-10 flex items-center justify-center p-2.5"
			>
				<DynamicIcon name="arrow-left" />
			</button>
		)}

		<div className="flex flex-grow max-w-[600px]">
			<Input
				type="search"
				value={search}
				placeholder="Пошук"
				onChange={(e) => setSearch(e.target.value)}
				className="rounded-l-lg rounded-r-none py-1 px-4 text-lg"
			/>
			<button
				onClick={onSearch}
				className="py-1.5 px-4 rounded-r-lg border-input border border-l-0 flex-shrink-0 hover:bg-muted"
			>
				<DynamicIcon name="search" />
			</button>
		</div>
	</div>

}

export default HomeHeaderSearch
