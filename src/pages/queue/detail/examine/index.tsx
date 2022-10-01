import { Tabs } from '@mantine/core'
import { IconReportMedical } from '@tabler/icons'
import BasicCheckup from './BasicCheckup'

const ExamineTabs = () => {
	return (
		<Tabs defaultValue="gallery">
			<Tabs.List grow>
				<Tabs.Tab value="gallery" icon={<IconReportMedical size={14} />}>
					Xét nghiệm
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value="gallery" pt="xs">
				<BasicCheckup />
			</Tabs.Panel>
		</Tabs>
	)
}
export default ExamineTabs
