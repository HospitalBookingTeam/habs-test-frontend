import { useGetQueueByIdQuery } from '@/store/queue/api'
import { Tabs, Stack, Divider, Title, Group } from '@mantine/core'
import { IconReportMedical } from '@tabler/icons'
import { useParams } from 'react-router-dom'
import BasicCheckup from '../../components/BasicCheckup'

const ExamineTabs = () => {
	const { id } = useParams()
	const { data } = useGetQueueByIdQuery(Number(id), {
		skip: !id,
	})

	return (
		<Tabs defaultValue="gallery">
			<Tabs.List grow>
				<Tabs.Tab value="gallery" icon={<IconReportMedical size={14} />}>
					Xét nghiệm
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value="gallery" pt="xs">
				<Stack>
					<Group mt="sm">
						<Title order={3} size="h4">
							{data?.operationName ?? '---'}
						</Title>
					</Group>
					<Divider />
					<BasicCheckup navigateResult="/waiting" />
				</Stack>
			</Tabs.Panel>
		</Tabs>
	)
}
export default ExamineTabs
