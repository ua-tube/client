import { Dialog, DialogContent, DynamicIcon, Input } from '@/components'
import { UseState } from '@/interfaces'
import { FC } from 'react'

interface IVideoUploadModalProps {
	showModal: boolean
	setShowModal: UseState<boolean>
}

const VideoUploadModal: FC<IVideoUploadModalProps> = ({
	setShowModal,
	showModal
}) => {
	return (
		<Dialog open={showModal} onOpenChange={setShowModal}>
			<DialogContent className='sm:size-[35rem] flex items-center justify-center'>
				<div className='flex flex-col items-center space-y-4'>
					<div className='rounded-full bg-muted p-4'>
						<DynamicIcon name='upload' className='size-20' />
					</div>
					<div className='flex flex-col items-center space-y-1'>
						<p className='font-semibold'>
							Перетягніть сюди відеофайли, які потрібно завантажити
						</p>
						<span className='text-muted-foreground text-sm'>
							Відео матимуть статус "Приватне", доки ви не опублікуєте їх.
						</span>
					</div>
					<Input type='file' className='max-w-fit' />
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default VideoUploadModal
