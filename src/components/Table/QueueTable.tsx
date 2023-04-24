import { TestRecord } from '@/entities/record'
import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import {
	useConfirmFromQueueByIdMutation,
	useNotifyPatientMutation,
	useRemoveFromQueueMutation,
} from '@/store/queue/api'
import { formatDate } from '@/utils/formats'
import {
	TestRecordStatus,
	translateTestRecordStatus,
} from '@/utils/renderEnums'
import {
	Avatar,
	Badge,
	Table,
	Group,
	Text,
	Center,
	Anchor,
	ScrollArea,
	useMantineTheme,
	Grid,
	Divider,
	Button,
	LoadingOverlay,
	Loader,
	Stack,
	Tooltip,
	ActionIcon,
} from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconBell, IconChevronRight, IconUserMinus } from '@tabler/icons'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

interface QueueTableProps {
	data?: TestRecord[]
	isLoading?: boolean
}

const statusColors: Record<number, string> = {
	[TestRecordStatus.CHECKED_IN]: 'green',
	[TestRecordStatus.CHO_KET_QUA]: 'cyan',
	[TestRecordStatus.DANG_TIEN_HANH]: 'pink',
}

const QueueTable = ({ data, isLoading }: QueueTableProps) => {
	const theme = useMantineTheme()
	const navigate = useNavigate()
	const authData = useAppSelector(selectAuth)

	const [confirmQueueById, { isLoading: isLoadingConfirm }] =
		useConfirmFromQueueByIdMutation()

	const [notifyPatientMutation, { isLoading: isLoadingNotify }] =
		useNotifyPatientMutation()
	const [removeFromQueueMutation, { isLoading: isLoadingRemove }] =
		useRemoveFromQueueMutation()

	const openModal = (patientName: string, queueId: number) =>
		openConfirmModal({
			title: 'Xác nhận khám bệnh',
			children: (
				<Text size="sm">
					Bạn sẽ khám người bệnh{' '}
					<Text color="orange" inherit component="span">
						{patientName}
					</Text>
					. Vui lòng tiếp tục để xác nhận.
				</Text>
			),
			centered: true,
			labels: { confirm: 'Tiếp tục', cancel: 'Quay lại' },
			onCancel: () => console.log('Cancel'),
			onConfirm: () => handleConfirmQueueById(queueId),
		})

	const handleConfirmQueueById = async (queueId: number) => {
		await confirmQueueById(queueId)
			.unwrap()
			.then((payload) => navigate(`/${queueId}`))
			.catch((error) =>
				showNotification({
					title: 'Lỗi xác nhận khám bệnh',
					message: 'Đã có người bệnh khác đang khám.',
					color: 'red',
				})
			)
	}

	const handleNotifyPatient = async (queueId: number) => {
		await notifyPatientMutation(queueId)
			.unwrap()
			.then((payload) =>
				showNotification({
					title: 'Thông báo thành công',
					message: 'Thông báo đã được gửi đến người bệnh',
				})
			)
			.catch((error) =>
				showNotification({
					title: 'Lỗi thông báo',
					message: 'Không thành công.',
					color: 'red',
				})
			)
	}

	const handleRemovePatient = async (patientName: string, queueId: number) => {
		openConfirmModal({
			title: 'Xóa khỏi hàng chờ',
			children: (
				<Stack spacing={'xs'}>
					<Text size="sm">
						Bạn sẽ xóa người bệnh{' '}
						<Text color="red" inherit component="span">
							{patientName}
						</Text>{' '}
						khỏi hàng chờ.
					</Text>
					<Text size="sm">Vui lòng tiếp tục để xác nhận.</Text>
				</Stack>
			),
			centered: true,
			color: 'red',
			labels: { confirm: 'Xác nhận', cancel: 'Hủy' },
			confirmProps: {
				color: 'red',
			},
			onConfirm: () => handleConfirmRemoveQueue(patientName, queueId),
		})
	}

	const handleConfirmRemoveQueue = async (
		patientName: string,
		queueId: number
	) => {
		if (!authData?.information) return
		await removeFromQueueMutation({
			id: queueId,
			roomId: authData?.information?.room?.id,
		})
			.unwrap()
			.then((payload) =>
				showNotification({
					title: `Đã xóa ${patientName} khỏi hàng chờ`,
					message: '',
					color: 'cyan',
				})
			)
			.catch((error) =>
				showNotification({
					title: 'Lỗi',
					message: 'Không thành công.',
					color: 'red',
				})
			)
	}

	const rows = data?.map((item, index) => {
		const isInProgress =
			item?.status === TestRecordStatus.DANG_TIEN_HANH ||
			item?.status === TestRecordStatus.CHO_KET_QUA
		// ||
		// item?.status === TestRecordStatus.CHECKED_IN_SAU_XN
		const isEven = index % 2 === 0

		return (
			<Grid
				key={item.id}
				sx={{ backgroundColor: isEven ? 'white' : 'whitesmoke', width: '100%' }}
				py="sm"
				align={'center'}
			>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					{item.numericalOrder}
				</Grid.Col>
				<Grid.Col span={3}>
					<Text size="sm" weight={500}>
						{item.patientName}
					</Text>
				</Grid.Col>

				<Grid.Col span={3}>
					<Text>{item.operationName}</Text>
				</Grid.Col>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					<Badge
						color={statusColors[item.status]}
						variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
					>
						{translateTestRecordStatus(item.status)}
					</Badge>
				</Grid.Col>

				<Grid.Col span={3}>
					<Group position={'right'}>
						<Tooltip label="Xóa khỏi hàng chờ">
							<ActionIcon
								onClick={() => handleRemovePatient(item.patientName, item.id)}
								color="red"
							>
								<IconUserMinus />
							</ActionIcon>
						</Tooltip>
						<Tooltip label="Thông báo đến xét nghiệm">
							<ActionIcon onClick={() => handleNotifyPatient(item.id)}>
								<IconBell />
							</ActionIcon>
						</Tooltip>
						<Button
							variant={isInProgress ? 'outline' : 'filled'}
							rightIcon={isInProgress ? <IconChevronRight /> : null}
							color="green"
							gradient={{ from: 'teal', to: 'lime', deg: 105 }}
							onClick={() => {
								if (isInProgress) {
									navigate(`/${item.id}`)
									return
								}
								openModal(item.patientName, item.id)
							}}
							sx={{ width: 150 }}
						>
							{isInProgress ? 'Tiếp tục' : 'Xét nghiệm'}
						</Button>
					</Group>
				</Grid.Col>
			</Grid>
		)
	})

	return (
		<>
			<Grid color="gray.1" pb="md" sx={{ width: '100%' }}>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					SKB
				</Grid.Col>
				<Grid.Col span={3}>Tên người bệnh</Grid.Col>
				<Grid.Col span={3}>
					<Text>Tên xét nghiệm</Text>
				</Grid.Col>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					Trạng thái
				</Grid.Col>
				<Grid.Col span={3}></Grid.Col>
			</Grid>
			<ScrollArea sx={{ height: 450 }}>
				<Center
					sx={{
						height: 100,
						width: '100%',
						display: isLoading ? 'flex' : 'none',
					}}
				>
					<Loader size="lg" />
				</Center>
				<Stack sx={{ width: '100%' }} mt="sm">
					<LoadingOverlay visible={isLoadingConfirm || isLoadingRemove} />
					{rows}
				</Stack>
			</ScrollArea>
		</>
	)
}

export default QueueTable
