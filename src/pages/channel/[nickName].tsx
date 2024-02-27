import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, AboutChannelContent } from '@/components'
import { HomeLayout } from '@/components/layouts'


export const getServerSideProps: GetServerSideProps<{
	nickName: string
}> = async ({ query }) => {
	return { props: { nickName: (query?.nickName as string) || '' } }
}

export default function ChannelHomePage({
																					nickName
																				}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return <>
		<AppHead title={nickName} />
		<HomeLayout autoShowSidebar openInDrawer>
			<AboutChannelContent/>
		</HomeLayout>
	</>

}

