import { Card, CardHeader, CardTitle, CardContent, Separator, buttonVariants } from '@/components'
import { FC } from 'react'
import { videos } from '@/data'
import Link from 'next/link'
import { formatNumbers, cn, getDashboardVideoUrl } from '@/utils'

const DashboardAnalyticsCard: FC = () => {

	return <Card className='break-inside mb-2'>
		<CardHeader>
			<CardTitle>Аналітика каналу</CardTitle>
		</CardHeader>
		<CardContent>
			<div>
				<p className="leading-7">Поточні підписки</p>
				<h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
					2 953
				</h3>
				<div className="gap-x-2 flex items-center">
					<span className="text-red-500">–2</span>
					за останні 28 днів
				</div>
			</div>
			<Separator className="my-2" />
			<div>
				<p className="leading-7">Підсумок</p>
				<span className="text-sm text-muted-foreground">За останні 28 днів</span>
				<div className="flex flex-row items-center justify-between w-full mt-2">
					<p>Перегляди</p>
					<span>16,6 тис.</span>
				</div>
				<div className="flex flex-row items-center justify-between w-full mt-2">
					<p>Тривалість перегляду (у годинах)</p>
					<span>396,2</span>
				</div>
			</div>
			<Separator className="my-2" />
			<div>
				<p className="leading-7">Найкращі відео</p>
				<span className="text-sm text-muted-foreground">За останні 48 годин · Перегляди</span>
				{videos.slice(0, 3).map((value, index) =>
					<div
						key={index}
						className="flex flex-row items-center justify-between w-full mt-2"
					>
						<Link
							href={getDashboardVideoUrl(value.id, 'analytics')}
							children={value.title}
							className="hover:underline"
						/>
						<span children={formatNumbers(value.views)} />
					</div>)}
			</div>
			<Separator className="my-2" />
			<Link
				href="/dashboard/analytics"
				className={cn(buttonVariants({ variant: 'secondary' }), 'text-lg hover:underline w-full')}
			>
				Перейти до аналітики
			</Link>
		</CardContent>
	</Card>

}

export default DashboardAnalyticsCard
