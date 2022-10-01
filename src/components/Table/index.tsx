import { TestRecord } from '@/entities/record'
import { useConfirmFromQueueByIdMutation } from '@/store/queue/api'
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
} from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconChevronRight } from '@tabler/icons'
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

export function QueueTable({ data, isLoading }: QueueTableProps) {
	const theme = useMantineTheme()
	const navigate = useNavigate()
	const [confirmQueueById, { isLoading: isLoadingConfirm }] =
		useConfirmFromQueueByIdMutation()

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
			>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
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

				<Grid.Col span={2}>
					<Stack align={'end'}>
						<Button
							variant={isInProgress ? 'gradient' : 'filled'}
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
							sx={{ width: 170 }}
						>
							{isInProgress ? 'Tiếp tục' : 'Xét nghiệm'}
						</Button>
					</Stack>
				</Grid.Col>
			</Grid>
		)
	})

	return (
		<>
			<Grid color="gray.1" pb="md" sx={{ width: '100%' }}>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					Số khám bệnh
				</Grid.Col>
				<Grid.Col span={3}>Tên người bệnh</Grid.Col>
				<Grid.Col span={3}>
					<Text>Tên xét nghiệm</Text>
				</Grid.Col>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					Trạng thái
				</Grid.Col>
				<Grid.Col span={2}></Grid.Col>
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
					<LoadingOverlay visible={isLoadingConfirm} />
					{rows}
				</Stack>
			</ScrollArea>
		</>
	)
}
