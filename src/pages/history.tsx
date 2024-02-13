import { HomeLayout } from '@/components/layouts'
import HistoryContent from '@/components/history'
import { AppHead } from '@/components'


export default function HistoryPage() {
	return (
		<>
			<AppHead title="Історія переглядів" />
			<HomeLayout hiddenSidebar>
				<HistoryContent />
			</HomeLayout>
		</>
	)
}
