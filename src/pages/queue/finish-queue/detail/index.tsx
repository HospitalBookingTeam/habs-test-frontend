import BackButton from '@/components/Button/BackButton'
import { Badge } from '@mantine/core'
import { Stack, Box, Paper, Group, Divider, Title } from '@mantine/core'

import { useParams } from 'react-router-dom'

import { useGetQueueByIdQuery } from '@/store/queue/api'
import PatientInfo from '../../components/record/PatientInfo'

const FinishQueueDetail = () => {
	const { id } = useParams()
	const { data } = useGetQueueByIdQuery(Number(id), {
		skip: !id,
	})

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
					Kết quả xét nghiệm
				</Badge>
			</Stack>
			<Box sx={{ width: '100%' }}>
				<Paper p="md">
					<Stack>
						<Group mt="sm">
							<Title order={3} size="h4">
								{data?.operationName ?? '---'}
							</Title>
						</Group>
						<Divider />
						<PatientInfo />
						<Divider />
					</Stack>
				</Paper>
			</Box>
		</Stack>
	)
}
export default FinishQueueDetail
