import { DocumentProps, Head, Html, Main, NextScript } from 'next/document'

export default function Document({ __NEXT_DATA__ }: DocumentProps) {
	return (
		<Html lang={__NEXT_DATA__?.locale || 'uk'}>
			<Head />
			<body className='bg-background font-sans antialiased'>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
