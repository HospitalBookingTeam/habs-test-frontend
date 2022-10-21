import { TestRecord } from '@/entities/record'
import { formatDate } from '@/utils/formats'
import { Button, Group, Stack, Title } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons'
import RowWithLabel from '../Row'

const TestRecordItem = ({
	data,
	showTitle = true,
}: {
	data?: TestRecord
	showTitle?: boolean
}) => {
	return (
		<Stack>
			<Group position="apart" grow>
				<Title
					sx={{ display: showTitle ? 'block' : 'none' }}
					order={3}
					size="h4"
				>
					Thông tin xét nghiệm
				</Title>
				<Button
					sx={{ maxWidth: 200 }}
					component="a"
					href={data?.resultFileLink}
					target="_blank"
					variant="subtle"
					leftIcon={<IconExternalLink size={14} />}
				>
					Xem chi tiết
				</Button>
			</Group>
			<RowWithLabel label="Bác sĩ xét nghiệm" content={data?.doctor} />

			<RowWithLabel
				label="Thời gian"
				content={data?.date ? formatDate(data.date) : '---'}
			/>
			<RowWithLabel
				label="Chẩn đoán"
				content={data?.resultDescription ?? '---'}
			/>

			{!!data?.resultFileLink && (
				<Stack sx={{ position: 'relative' }}>
					<iframe src={data.resultFileLink} height="550" />
				</Stack>
			)}
		</Stack>
	)
}

export default TestRecordItem
