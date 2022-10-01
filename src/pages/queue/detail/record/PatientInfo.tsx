import RowWithLabel from '@/components/Row'
import { PatientInRecord } from '@/entities/record'
import { useGetQueueByIdQuery } from '@/store/queue/api'
import { formatDate } from '@/utils/formats'
import { Stack, Title } from '@mantine/core'
import { useParams } from 'react-router-dom'

const PatientInfo = () => {
	const { id } = useParams()
	const { data } = useGetQueueByIdQuery(Number(id), {
		skip: !id,
	})

	return (
		<Stack>
			<Title order={3} px="0" size="h4">
				Thông tin người bệnh
			</Title>
			<Stack sx={{ gap: 12 }}>
				<RowWithLabel label={'Họ và tên'} content={data?.patientName} />
				<RowWithLabel
					label={'Ngày sinh'}
					content={
						data?.patient?.dateOfBirth
							? formatDate(data?.patient?.dateOfBirth)
							: '---'
					}
				/>
				<RowWithLabel label={'SĐT'} content={data?.patient?.phoneNumber} />
				<RowWithLabel
					label={'Giới tính'}
					content={data?.patient?.gender === 0 ? 'Nam' : 'Nữ'}
				/>
				<RowWithLabel label={'BHYT'} content={data?.patient?.bhyt} />
			</Stack>
		</Stack>
	)
}

export default PatientInfo
