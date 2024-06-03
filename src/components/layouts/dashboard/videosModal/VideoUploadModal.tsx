import { StorageService, VideoManagerService } from '@/services'
import { toastError } from '@/utils'
import { IVideo, UseState } from '@/interfaces'
import { FC, useState } from 'react'
import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Input,
	Label,
	Progress
} from '@/components'

interface IVideoUploadModalProps {
	video?: IVideo
	setVideo: UseState<IVideo | undefined>
}

interface IUploadProgress {
	percentage: number
	timeRemaining: number
	uploadSpeed: number
}

const formatTime = (seconds: number): string => {
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	const s = Math.floor(seconds % 60)
	return `${h > 0 ? `${h}г. ` : ''}${m > 0 ? `${m}х. ` : ''}${s}с.`
}

const formatSpeed = (bytesPerSecond: number): string => {
	const units = ['B/s', 'KB/s', 'MB/s', 'GB/s']
	let speed = bytesPerSecond
	let unitIndex = 0

	while (speed >= 1024 && unitIndex < units.length - 1) {
		speed /= 1024
		unitIndex += 1
	}

	return `${speed.toFixed(2)} ${units[unitIndex]}`
}

const VideoUploadModal: FC<IVideoUploadModalProps> = ({ video, setVideo }) => {
	const [videoFile, setVideoFile] = useState<File>()
	const [uploadProgress, setUploadProgress] = useState<IUploadProgress>()

	const onSubmit = async () => {
		if (video)
			try {
				const {
					data: { token }
				} = await VideoManagerService.generateVideoUploadToken(video.id)

				const formData = new FormData()
				formData.append('file', videoFile!)
				const startTime = Date.now()

				await StorageService.uploadVideo(
					formData,
					token,
					undefined,
					({ loaded, total }) => {
						const percentage = Math.round((loaded * 100) / (total || 0))

						const currentTime = Date.now()
						const timeElapsed = (currentTime - startTime) / 1000
						const uploadSpeed = loaded / timeElapsed
						const timeRemaining = ((total || 0) - loaded) / uploadSpeed

						setUploadProgress({ percentage, timeRemaining, uploadSpeed })
					}
				)
				setVideoFile(undefined)
				setUploadProgress(undefined)
				setVideo(undefined)
			} catch (e) {
				toastError(e)
			}
	}

	return (
		<Dialog
			open={!!video}
			onOpenChange={() => !uploadProgress && setVideo(undefined)}
		>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-center'>
						Завантаження відео файлу
					</DialogTitle>
				</DialogHeader>

				<Label htmlFor='file'>Відео файл</Label>
				<Input
					id='file'
					type='file'
					accept='video/mp4,video/x-m4v,video/*'
					onChange={e => setVideoFile(e.target.files?.[0])}
				/>
				<div className='text-sm text-muted-foreground'>
					Підтримуються лише формати, які використовуються в відео.
				</div>
				{uploadProgress && uploadProgress && (
					<>
						<Progress
							value={uploadProgress.percentage}
							className='rounded-md'
						/>
						<div className='text-sm text-muted-foreground'>
							До кінця завантаження залишилося{' '}
							{formatTime(uploadProgress.timeRemaining)}, з поточню швидкістю{' '}
							{formatSpeed(uploadProgress.uploadSpeed)}
						</div>
					</>
				)}
				<Button
					onClick={onSubmit}
					className='w-full flex flex-row items-center gap-2'
					disabled={!videoFile || !!uploadProgress}
				>
					<span>Завантажити відео</span>
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default VideoUploadModal
