import { Head, Html, Main, NextScript } from 'next/document'

export default function Document(props: any) {
	return (
		<Html lang={props?.__NEXT_DATA__?.locale || 'uk'}>
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
