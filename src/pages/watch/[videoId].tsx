import { AppHead } from '@/components'
import { HomeLayout } from '@/components/layouts'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps: GetServerSideProps<{
	videoId: string
}> = async ({ query }) => {
	return { props: { videoId: (query?.videoId as string) || '' } }
}

export default function ShopPage({
	videoId
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title={`Перегляд відео ${videoId}`} />
			<HomeLayout></HomeLayout>
		</>
	)
}
