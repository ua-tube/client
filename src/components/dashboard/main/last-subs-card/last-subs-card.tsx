import { getUserInitials, getChannelUrl } from '@/utils'
import { subscriptions } from '@/data'
import { FC, useState } from 'react'
import dynamic from 'next/dynamic'
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
	AvatarFallback
} from '@/components'

const LastSubscriptionsDialog = dynamic(() => import('./last-subs-dialog'))

const DashboardLastSubscriptionsCard: FC = () => {
	const [showModal, setShowModal] = useState<boolean>(false)
	return <Card className="break-inside mb-2">
		<CardHeader>
			<CardTitle>Нещодавні підписки</CardTitle>
			<CardDescription>Останні 90 днів</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="flex flex-col gap-y-2" children={subscriptions.map((value, index) =>
				<Link
					key={index}
					target="_blank"
					href={getChannelUrl(value.nickName, 'index', true)}
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
			<LastSubscriptionsDialog
				open={showModal}
				setOpen={setShowModal}
			/>
		</CardContent>
	</Card>

}

export default DashboardLastSubscriptionsCard
