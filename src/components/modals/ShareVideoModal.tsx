import { getSourceVideoUrl, writeVideoUrl, getUserInitials } from '@/utils'
import { subscriptions } from '@/data'
import { IVideo } from '@/interfaces'
import { FC } from 'react'
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	Dialog,
	DialogDescription,
	Input,
	Button,
	Separator,
	Avatar,
	AvatarImage,
	AvatarFallback,
	DynamicIcon
} from '@/components'

interface IShareVideoModalProps {
	video?: IVideo
	open: boolean
	setOpen: (s: boolean) => void
}

const ShareVideoModal: FC<IShareVideoModalProps> = ({ video, setOpen, open }) => {
	return <Dialog open={open} onOpenChange={setOpen}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>
					Поширити
				</DialogTitle>
				<DialogDescription>
					Поширити посиланння на це відео
				</DialogDescription>
			</DialogHeader>

			<div className="flex space-x-2">
				<Input value={getSourceVideoUrl(video?.id || '')} readOnly />
				<Button
					variant="secondary"
					onClick={async () => await writeVideoUrl(video?.id)}
					children="Копіювати"
				/>
			</div>
			<Separator className="my-4" />
			<div className="space-y-4">
				<h4 className="text-sm font-medium">Поділитися з</h4>
				<div
					className="grid gap-6"
					children={subscriptions.map((value, index) =>
						<div
							key={index}
							className="flex items-center justify-between space-x-4">
							<div className="flex items-center space-x-4">
								<Avatar>
									<AvatarImage src={value.profileImg} />
									<AvatarFallback children={getUserInitials(value.name)} />
								</Avatar>
								<div>
									<p className="text-sm font-medium leading-none" children={value.name} />
									<p className="text-sm text-muted-foreground" children={value.nickName} />
								</div>
							</div>
							<Button
								variant="secondary"
								size="sm"
								children={<DynamicIcon name="send-horizontal" />}
							/>
						</div>
					)}
				/>
			</div>

		</DialogContent>
	</Dialog>

}

export default ShareVideoModal
