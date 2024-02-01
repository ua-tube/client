import { siteConfig } from '@/config'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC } from 'react'

export interface IAppHeadProps {
	title: string
	description?: string
	image?: string
	disableDesc?: boolean
	disableMeta?: boolean
}

const AppHead: FC<IAppHeadProps> = ({
	image,
	title,
	description,
	disableDesc,
	disableMeta
}) => {
	const { locale } = useRouter()
	const defaultImg = image || `${process.env.SERVER_URL}/og_image.webp`
	const defaultDesc = !disableDesc ? description : ''
	return (
		<Head>
			<title>{`${title} | ${siteConfig.name}`}</title>
			<meta property='og:title' key='title' content={title} />
			{!disableMeta && (
				<>
					<meta name='twitter:image' content={defaultImg} />
					<meta property='og:image' content={defaultImg} />
					<meta name='description' content={defaultDesc} />
					<meta property='og:description' content={defaultDesc} />
					<meta name='twitter:card' content='summary_large_image' />
					<meta
						name='twitter:site'
						content={`@${siteConfig?.name?.toLowerCase()}`}
					/>
					<meta name='twitter:title' content={title} />
					<meta name='twitter:description' content={defaultDesc} />
					<meta name='twitter:image' content={defaultImg} />
					<meta property='og:type' content='website' />
					<meta property='og:site_name' content={siteConfig.name} />
					<meta property='og:image:width' content='1280' />
					<meta property='og:image:height' content='720' />
				</>
			)}
		</Head>
	)
}

export default AppHead
