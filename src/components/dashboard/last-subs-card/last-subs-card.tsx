import { getUserInitials, getChannelUrl, formatNumbers } from '@/utils'
import { subscriptions } from '@/data'
import { FC, useState } from 'react'
import Link from 'next/link'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Separator,
	Button,
	CardDescription,
	Avatar,
	AvatarImage,
	AvatarFallback,
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogContent,
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	DialogDescription
} from '@/components'

const DashboardLastSubscriptionsCard: FC = () => {
	const [showModal, setShowModal] = useState<boolean>(false)
	return <Card className='break-inside mb-2'>
		<CardHeader>
			<CardTitle>Нещодавні підписки</CardTitle>
			<CardDescription>Останні 90 днів</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="flex flex-col gap-y-2" children={subscriptions.map((value, index) =>
				<Link
					key={index}
					target="_blank"
					href={getChannelUrl({ nickName: value.nickName }, 'index', true)}
					className="flex flex-row items-center space-x-3"
				>
					<Avatar className="size-12">
						<AvatarImage src={value.profileImg} />
						<AvatarFallback children={getUserInitials(value.name)} />
					</Avatar>
					<div className="flex flex-col -gap-y-2">
						<p className="" children={value.name} />
						<span className="text-muted-foreground" children="654 підписників" />
					</div>
				</Link>
			)} />

			<Separator className="my-2" />
			<Button
				onClick={() => setShowModal(f => !f)}
				variant="secondary"
				className="text-lg hover:underline w-full"
			>
				Показати всі підписки
			</Button>
			<Dialog onOpenChange={setShowModal} open={showModal}>
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
								<TableHead className="text-right">Дія</TableHead>
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
									<TableCell className="text-right"><Button variant="secondary" children="Підписатися" /></TableCell>
								</TableRow>
							))} />
					</Table>
				</DialogContent>
			</Dialog>
		</CardContent>
	</Card>

}

export default DashboardLastSubscriptionsCard
