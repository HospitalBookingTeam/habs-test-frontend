import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/pages/App'
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
//pdfjs-dist@2.12.313
// const worker = new Worker(
// 	new URL(
// 		'https://www.unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js',
// 		import.meta.url
// 	)
// )
function workerCros(url: string) {
	const iss = "importScripts('" + url + "');"
	return URL.createObjectURL(new Blob([iss]))
}

const workerUrl = workerCros(
	new URL(
		'https://www.unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js',
		window.location as any
	).href
)
const worker = new Worker(workerUrl)

import { BrowserRouter as Router } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import GlobalStyles from './GlobalStyles'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<MantineProvider
					withGlobalStyles={true}
					withNormalizeCSS={true}
					theme={{
						primaryColor: 'green',
						white: '#f9f9f9',
					}}
				>
					<NotificationsProvider>
						<ModalsProvider>
							<GlobalStyles />
							<Router>
								<App />
							</Router>
						</ModalsProvider>
					</NotificationsProvider>
				</MantineProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
)
