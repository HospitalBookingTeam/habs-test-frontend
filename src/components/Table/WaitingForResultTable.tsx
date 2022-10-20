import { TestRecord } from '@/entities/record'
import { useConfirmFromQueueByIdMutation } from '@/store/queue/api'
import { formatDate } from '@/utils/formats'
import {
	TestRecordStatus,
	translateTestRecordStatus,
} from '@/utils/renderEnums'
import {
	Badge,
	Text,
	Center,
	ScrollArea,
	useMantineTheme,
	Grid,
	Button,
	Loader,
	Stack,
} from '@mantine/core'
import { IconChevronRight } from '@tabler/icons'
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

const WaitingForResultTable = ({ data, isLoading }: QueueTableProps) => {
	const theme = useMantineTheme()
	const navigate = useNavigate()

	const rows = data?.map((item, index) => {
		const isEven = index % 2 === 0

		return (
			<Grid
				key={item.id}
				sx={{ backgroundColor: isEven ? 'white' : 'whitesmoke', width: '100%' }}
				py="sm"
				align={'center'}
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
							variant={'filled'}
							rightIcon={<IconChevronRight />}
							color="green"
							onClick={() => {
								navigate(`/waiting/${item.id}`)
							}}
							sx={{ width: 170 }}
						>
							{'Cập nhật'}
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
					{rows}
				</Stack>
			</ScrollArea>
		</>
	)
}

export default WaitingForResultTable
