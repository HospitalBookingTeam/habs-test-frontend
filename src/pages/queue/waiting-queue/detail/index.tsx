import BackButton from '@/components/Button/BackButton'
import { Badge } from '@mantine/core'
import {
	Paper,
	Stack,
	Tabs,
	Box,
	Button,
	Text,
	Modal,
	Textarea,
} from '@mantine/core'
import { IconId, IconStethoscope } from '@tabler/icons'
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ExamineTabs from './ExamineTabs'

import PatientRecord from '../../components/record'
import { TestRecordStatus } from '@/utils/renderEnums'
import apiHelper from '@/utils/axiosHelper'
import { useAppSelector } from '@/store/hooks'
import { selectAuth } from '@/store/auth/selectors'
import { showNotification } from '@mantine/notifications'

const QueueDetail = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [tabValue, setTabValue] = useState<string | null>(
		searchParams.get('tabs') ?? 'examine'
	)
	const { id } = useParams()
	const auth = useAppSelector(selectAuth)
	const navigate = useNavigate()
	const [isOpened, setIsOpened] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [failReason, setFailReason] = useState('')

	const cancelTest = async () => {
		setIsLoading(true)
		await apiHelper
			.put(
				`test-queue`,
				{
					Status: TestRecordStatus.DA_HUY,
					Id: id,
					FailReason: failReason,
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
					title: 'Hủy xét nghiệm thành công',
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
				setIsOpened(false)
			})
	}

	return (
		<Stack align={'start'}>
			<Stack
				sx={{ flexDirection: 'row', width: '100%' }}
				align="center"
				justify={'space-between'}
				mb="sm"
				spacing={40}
			>
				<BackButton />

				<Badge size="xl" radius="md">
					Xét nghiệm
				</Badge>
			</Stack>
			<Box sx={{ width: '100%' }}>
				<Tabs
					orientation="vertical"
					value={tabValue}
					onTabChange={(value: string) => {
						setTabValue(value)
						setSearchParams({ tabs: value })
					}}
				>
					<Stack sx={{ order: 2, width: 200 }}>
						<Paper p="md">
							<Tabs.List
								sx={{
									borderLeft: '2px solid #dee2e6',
									borderRight: 0,
								}}
							>
								<Tabs.Tab
									value="examine"
									icon={<IconStethoscope size={14} />}
									sx={{
										borderLeft: '2px solid transparent',
										borderRight: 0,
										borderRadius: 0,
										marginRight: 0,
										marginLeft: -2,
									}}
								>
									Nội dung khám
								</Tabs.Tab>
								<Tabs.Tab
									value="record"
									icon={<IconId size={14} />}
									sx={{
										borderLeft: '2px solid transparent',
										borderRight: 0,
										borderRadius: 0,
										marginRight: 0,
										marginLeft: -2,
									}}
								>
									Hồ sơ người bệnh
								</Tabs.Tab>
							</Tabs.List>
						</Paper>

						<Button
							color="red"
							size="sm"
							onClick={() => {
								setIsOpened(true)
							}}
						>
							Hủy xét nghiệm
						</Button>
					</Stack>

					<Tabs.Panel value="examine" pr="lg">
						<Paper p="md">
							<ExamineTabs />
						</Paper>
					</Tabs.Panel>

					<Tabs.Panel value="record" pr="lg">
						<Paper p="md">
							<PatientRecord />
						</Paper>
					</Tabs.Panel>
				</Tabs>
			</Box>

			<Modal
				opened={isOpened}
				title="Hủy xét nghiệm"
				onClose={() => setIsOpened(false)}
			>
				<>
					<Textarea
						minRows={2}
						maxRows={4}
						label="Nội dung hủy"
						placeholder="Lý do hủy"
						data-autofocus
						value={failReason}
						onChange={(e) => setFailReason(e.target.value)}
					/>
					<Button
						fullWidth
						mt="md"
						color="red"
						loading={isLoading}
						disabled={!failReason}
						onClick={cancelTest}
					>
						Xác nhận
					</Button>
				</>
			</Modal>
		</Stack>
	)
}
export default QueueDetail
