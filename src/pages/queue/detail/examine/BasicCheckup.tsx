import { useEffect, useState } from 'react'

import {
	Stack,
	Title,
	Divider,
	Text,
	Textarea,
	Button,
	Group,
	LoadingOverlay,
	Paper,
} from '@mantine/core'

import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { useNavigate, useParams } from 'react-router-dom'

import { BaseDropzone } from '@/components/Dropzone'
import { useGetQueueByIdQuery } from '@/store/queue/api'
import { TestRecordStatus } from '@/utils/renderEnums'
import apiHelper from '@/utils/axiosHelper'
import { useAppSelector } from '@/store/hooks'
import { selectAuth } from '@/store/auth/selectors'

const BasicCheckup = () => {
	const { id } = useParams()
	const { data } = useGetQueueByIdQuery(Number(id), {
		skip: !id,
	})
	const navigate = useNavigate()
	const auth = useAppSelector(selectAuth)

	const form = useForm<any>({
		initialValues: {},
	})
	const [isLoading, setIsLoading] = useState(false)
	const onSubmit = async (values: any) => {
		console.log('values', values)

		setIsLoading(true)
		await apiHelper
			.put(
				`test-queue`,
				{
					ResultDescription: values?.ResultDescription,
					ResultFile: values?.ResultFile?.[0],
					Status: TestRecordStatus.HOAN_THANH,
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
					title: 'Cập nhật file xét nghiệm thành công',
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
		<Stack mt={'md'}>
			<Stack>
				<Stack>
					<Title order={3} size="h6">
						Xét nghiệm
					</Title>
					<Paper>
						<Text>{data?.operationName ?? '---'}</Text>
					</Paper>
					<Divider />
				</Stack>

				<form onSubmit={form.onSubmit(onSubmit)}>
					<LoadingOverlay visible={isLoading} />

					<BaseDropzone {...form.getInputProps('ResultFile')} />

					<Textarea
						minRows={2}
						maxRows={4}
						label="Kết quả xét nghiệm"
						mt="sm"
						{...form.getInputProps('ResultDescription')}
					/>
					<Group position="center">
						<Button
							variant="outline"
							mt="sm"
							onClick={handleTestBeforeFile}
							disabled={isHandleBeforeFileDisabled}
						>
							Xác nhận đã xét nghiệm
						</Button>
						<Button type="submit" mt="sm">
							Cập nhật kết quả
						</Button>
					</Group>
				</form>
			</Stack>
		</Stack>
	)
}

export default BasicCheckup
