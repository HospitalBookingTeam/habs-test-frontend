import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import { useGetQueueByIdQuery } from '@/store/queue/api'
import apiHelper from '@/utils/axiosHelper'
import { TestRecordStatus } from '@/utils/renderEnums'
import {
	Tabs,
	Button,
	Text,
	LoadingOverlay,
	Stack,
	Checkbox,
	Box,
	Title,
	Group,
	Divider,
} from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconReportMedical } from '@tabler/icons'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BasicCheckup from '../../components/BasicCheckup'
import { formatDate } from '@/utils/formats'

const ExamineTabs = () => {
	const [isResultDone, setIsResultDone] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { id } = useParams()
	const { data } = useGetQueueByIdQuery(Number(id), {
		skip: !id,
	})
	const navigate = useNavigate()
	const auth = useAppSelector(selectAuth)

	const confirmTest = async () => {
		openConfirmModal({
			title: 'Xác nhận đã xét nghiệm',
			children: (
				<Text size="sm">
					Người bệnh{' '}
					<Text color="orange" inherit component="span">
						{data?.patientName}
					</Text>{' '}
					đã hoàn thành xét nghiệm. Vui lòng tiếp tục để xác nhận!
				</Text>
			),
			centered: true,
			labels: { confirm: 'Tiếp tục', cancel: 'Quay lại' },
			onConfirm: handleTestBeforeFile,
		})
	}
	const handleTestBeforeFile = async () => {
		setIsLoading(true)
		await apiHelper
			.put(
				`test-queue`,
				{
					Status: TestRecordStatus.CHO_KET_QUA,
					Id: id,
				},
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${auth?.token}`,
					},
				}
			)
			.then(() => {
				showNotification({
					title: 'Cập nhật trạng thái xét nghiệm thành công',
					message: <Text>Thông tin đã được cập nhật.</Text>,
				})
				navigate('/')
			})
			.catch(() => {
				showNotification({
					title: 'Lỗi',
					message: <Text></Text>,
					color: 'red',
				})
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	const isHandleBeforeFileDisabled =
		data?.status === TestRecordStatus.CHO_KET_QUA

	return (
		<Tabs defaultValue="gallery">
			<Tabs.List grow>
				<Tabs.Tab value="gallery" icon={<IconReportMedical size={14} />}>
					Xét nghiệm
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value="gallery" pt="xs" sx={{ position: 'relative' }}>
				<LoadingOverlay visible={isLoading && !isResultDone} />
				<Stack pt="sm">
					<Stack spacing={0}>
						<Group>
							<Text weight={'bolder'} size="sm" sx={{ minWidth: 80 }}>
								Mã số
							</Text>
							<Text>{data?.code ?? '---'}</Text>
						</Group>
						<Group>
							<Text weight={'bolder'} size="sm" sx={{ minWidth: 80 }}>
								Họ tên
							</Text>
							<Text>{data?.patientName ?? '---'}</Text>
						</Group>
						<Group>
							<Text weight={'bolder'} size="sm" sx={{ minWidth: 80 }}>
								Ngày sinh
							</Text>
							<Text>
								{data?.patient?.dateOfBirth
									? formatDate(data?.patient?.dateOfBirth)
									: '---'}
							</Text>
						</Group>
					</Stack>
					<Group position="apart">
						<Title order={3} size="h4">
							{data?.operationName ?? '---'}
						</Title>
						<Box sx={{ alignSelf: 'end' }}>
							{/* <Checkbox
								checked={isResultDone}
								onChange={(e) => setIsResultDone(e.currentTarget.checked)}
								size="md"
								label="Đã có kết quả xét nghiệm?"
							/> */}
						</Box>
					</Group>
					<Divider />

					{!isResultDone ? (
						<Box sx={{ alignSelf: 'center' }}>
							<Button
								// variant="outline"
								mt="sm"
								onClick={confirmTest}
								disabled={isHandleBeforeFileDisabled}
							>
								Xác nhận đã xét nghiệm
							</Button>
						</Box>
					) : (
						<BasicCheckup />
					)}
				</Stack>
			</Tabs.Panel>
		</Tabs>
	)
}
export default ExamineTabs
