import { getUserInitials, formatNumbers } from '@/utils'
import { UseState } from '@/interfaces'
import { subscriptions } from '@/data'
import { FC } from 'react'
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Avatar,
	AvatarImage,
	AvatarFallback,
	Dialog
} from '@/components'

interface ILastSubscriptionsDialogProps {
	open: boolean
	setOpen: UseState<boolean>
}

const LastSubscriptionsDialog: FC<ILastSubscriptionsDialogProps> = ({ setOpen, open }) => {

	return <Dialog onOpenChange={setOpen} open={open}>
		<DialogContent className="sm:min-w-fit">
			<DialogHeader>
				<DialogTitle children="Підписники" />
				<DialogDescription>
					Включає лише користувачів, які зробили свої підписки загальнодоступними за 90 днів
				</DialogDescription>
			</DialogHeader>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Канал</TableHead>
						<TableHead> Дата оформлення підписки</TableHead>
						<TableHead>Кількість підписників</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody children={
					subscriptions.map((sub, index) => (
						<TableRow key={index}>
							<TableCell className="flex items-center space-x-2">
								<Avatar>
									<AvatarImage src={sub.profileImg} />
									<AvatarFallback children={getUserInitials(sub.name)} />
								</Avatar>
								<div className="font-medium" children={sub.name} />
							</TableCell>
							<TableCell>{new Date(new Date().getTimezoneOffset() - index).toLocaleString()}</TableCell>
							<TableCell>{formatNumbers(1434 * (index + 1))}</TableCell>
						</TableRow>
					))} />
			</Table>
		</DialogContent>
	</Dialog>
}

export default LastSubscriptionsDialog
