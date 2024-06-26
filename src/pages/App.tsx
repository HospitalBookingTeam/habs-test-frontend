import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Container, LoadingOverlay } from '@mantine/core'
import { selectIsAuthenticated } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import LayoutAppShell from '@/components/Layout'
import { selectTime } from '@/store/config/selectors'
import { useLazyGetTimeQuery } from '@/store/config/api'

const Login = lazy(() => import('@/pages/auth'))
const Queue = lazy(() => import('@/pages/queue/confirm-queue'))
const QueueDetail = lazy(() => import('@/pages/queue/confirm-queue/detail'))
const FinishedQueue = lazy(() => import('@/pages/queue/finish-queue'))
const FinishedQueueDetail = lazy(
	() => import('@/pages/queue/finish-queue/detail')
)
const WaitingForResultQueue = lazy(() => import('@/pages/queue/waiting-queue'))
const WaitingForResultQueueDetail = lazy(
	() => import('@/pages/queue/waiting-queue/detail')
)

const NotFound = lazy(() => import('@/components/NotFound/NotFoundPage'))

function App() {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const configTime = useAppSelector(selectTime)
	const [triggerTimeConfig] = useLazyGetTimeQuery()
	useEffect(() => {
		const getTime = async () => {
			await triggerTimeConfig()
		}
		if (isAuthenticated && configTime === null) {
			getTime()
		}
	}, [isAuthenticated, configTime])

	return (
		<Suspense fallback={<LoadingOverlay visible={true} />}>
			<Container
				size="xl"
				sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
			>
				<Routes>
					<Route element={<RequireAuth />}>
						<Route path="/" element={<Outlet />}>
							<Route index element={<Queue />} />
							<Route path=":id" element={<QueueDetail />} />
						</Route>
						<Route path="/finished" element={<Outlet />}>
							<Route index element={<FinishedQueue />} />
							<Route path=":id" element={<FinishedQueueDetail />} />
						</Route>
						<Route path="/waiting" element={<Outlet />}>
							<Route index element={<WaitingForResultQueue />} />
							<Route path=":id" element={<WaitingForResultQueueDetail />} />
						</Route>
					</Route>
					<Route path="/login" element={<IsUserRedirect />}>
						<Route index element={<Login />} />
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Container>
		</Suspense>
	)
}

const RequireAuth = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)

	const navigate = useNavigate()
	useLayoutEffect(() => {
		if (isAuthenticated) return
		navigate('/login')
	}, [isAuthenticated, navigate])

	return isAuthenticated ? (
		<LayoutAppShell>
			<Outlet />
		</LayoutAppShell>
	) : (
		<Navigate to={'/login'} />
	)
}
const IsUserRedirect = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}

export default App
