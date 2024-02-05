import { reportReasons } from '@/data'
import { IVideo } from '@/interfaces'
import { FC, useState } from 'react'
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Label,
	RadioGroup,
	RadioGroupItem
} from '@/components'


interface IReportModalProps {
	video: IVideo
	open: boolean
	setOpen: (s: boolean) => void
}

const ReportModal: FC<IReportModalProps> = ({ setOpen, open, video }) => {
	const [currReason, setCurrReason] = useState<string>('1')

	const onReportPress = () => {
		// TODO make logic for video report
		setOpen(false)
	}

	return <Dialog open={open} onOpenChange={setOpen}>
		<DialogContent>
			<DialogHeader><DialogTitle>Поскаржитися на відео</DialogTitle></DialogHeader>
			<RadioGroup
				className="space-y-3 py-3"
				value={currReason}
				onValueChange={value => setCurrReason(value)}
				children={reportReasons.map((value, index) =>
					<div
						key={index}
						className="flex items-center space-x-2"
					>
						<RadioGroupItem value={`${value.id}`} id={`reason-${value.id}`} />
						<Label htmlFor={`reason-${value.id}`} children={value.name} />
					</div>
				)}
			/>
			<DialogFooter>
				<DialogDescription className="text-sm">
					У випадку виявлення порушень цих правил застосовуються штрафні санкції до облікового запису.
					За серйозні або повторні порушення ми можемо здійснити блокування облікового запису.
				</DialogDescription>
				<Button
					type="submit"
					onClick={onReportPress}
				>
					Поскаржитися
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
}

export default ReportModal
