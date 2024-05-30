import { getSourceVideoUrl, writeVideoUrl } from '@/utils'
import { IVideo } from '@/interfaces'
import { toast } from 'sonner'
import { FC } from 'react'
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Input
} from '@/components'

interface IShareVideoModalProps {
	video?: IVideo
	open: boolean
	setOpen: (s: boolean) => void
}

const ShareVideoModal: FC<IShareVideoModalProps> = ({
	video,
	setOpen,
	open
}) => {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Поширити</DialogTitle>
					<DialogDescription>Поширити посиланння на це відео</DialogDescription>
				</DialogHeader>

				<div className='flex space-x-2'>
					<Input value={getSourceVideoUrl(video?.id || '')} readOnly />
					<Button
						variant='secondary'
						onClick={async () => {
							await writeVideoUrl(video?.id)
							setOpen(false)
							toast.success('Скопійовано успішно!')
						}}
						children='Копіювати'
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ShareVideoModal
