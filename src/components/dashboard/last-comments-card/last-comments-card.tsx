import { videos, defaultComments, defaultVideo } from '@/data'
import { cn, getUserInitials } from '@/utils'
import Link from 'next/link'
import { FC } from 'react'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Separator,
	buttonVariants,
	CardDescription,
	Avatar,
	AvatarImage,
	AvatarFallback
} from '@/components'

const DashboardLastCommentsCard: FC = () => {

	return <Card className="break-inside mb-2">
		<CardHeader>
			<CardTitle>Останні коментарі</CardTitle>
			<CardDescription>Коментарі каналу без моїх відповідей</CardDescription>
		</CardHeader>
		<CardContent>
			<div
				className="flex flex-col gap-y-3 divide-secondary divide-y"
				children={
					defaultComments.map((value, index) =>
						<div key={index} className="flex flex-row justify-between pt-2">
							<div className="flex flex-row space-x-2">
								<Avatar>
									<AvatarImage src={value.chanel.profileImg} />
									<AvatarFallback children={getUserInitials(value.chanel.name)} />
								</Avatar>
								<div className="flex flex-col space-y-1">
									<p className="text-muted-foreground text-sm" children={value.chanel.name} />
									<div children={value.message} />
								</div>
							</div>
							<div className="h-10 aspect-video ml-3">
								<img src={videos[0].thumbnailUrl} alt={defaultVideo.id} />
							</div>
						</div>
					)}
			/>
			<Separator className="my-2" />
			<Link
				href="/dashboard/comments"
				className={cn(buttonVariants({ variant: 'secondary' }), 'text-lg hover:underline w-full')}
			>
				Перейти до коментарів
			</Link>
		</CardContent>

	</Card>

}

export default DashboardLastCommentsCard
