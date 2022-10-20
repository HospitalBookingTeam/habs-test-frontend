import { useEffect, useState } from 'react'

import {
	Stack,
	Text,
	Textarea,
	Button,
	Group,
	LoadingOverlay,
} from '@mantine/core'

import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { useNavigate, useParams } from 'react-router-dom'

import { BaseDropzone } from '@/components/Dropzone'
import { TestRecordStatus } from '@/utils/renderEnums'
import apiHelper from '@/utils/axiosHelper'
import { useAppSelector } from '@/store/hooks'
import { selectAuth } from '@/store/auth/selectors'

type FormProps = {
	ResultFile: FileList | null
	ResultDescription: string | null
}
const BasicCheckup = ({ navigateResult = '/' }) => {
	const { id } = useParams()

	const navigate = useNavigate()
	const auth = useAppSelector(selectAuth)

	const form = useForm<FormProps>({
		initialValues: {
			ResultFile: null,
			ResultDescription: null,
		},
		validate: {
			ResultFile: (value: FileList | null) => (!value ? true : null),
		},
	})
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = async (values: FormProps) => {
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
				navigate(navigateResult)
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

	return (
		<Stack mt={'md'}>
			<Stack>
				<form
					onSubmit={form.onSubmit(onSubmit)}
					style={{ position: 'relative' }}
				>
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
						<Button type="submit" mt="sm" disabled={!form.isValid()}>
							Cập nhật kết quả
						</Button>
					</Group>
				</form>
			</Stack>
		</Stack>
	)
}

export default BasicCheckup
