import { WaitingForResultTable } from '@/components/Table'
import { TestRecord } from '@/entities/record'
import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import { useGetQueueQuery } from '@/store/queue/api'
import { SEARCH_OPTIONS } from '@/utils/constants'
import { Stack, Title, TextInput, Paper } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons'
import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'

const WaitingForResultQueue = () => {
	const authData = useAppSelector(selectAuth)

	const [queueData, setQueueData] = useState<TestRecord[] | undefined>(
		undefined
	)
	const [value, setValue] = useDebouncedState('', 200)

	const { data, isLoading, isSuccess } = useGetQueueQuery(
		{ roomId: authData?.information?.room?.id, isWaitingForResult: true },
		{
			refetchOnFocus: true,
			refetchOnMountOrArgChange: true,
			skip: !authData?.information,
		}
	)

	useEffect(() => {
		if (!data?.length) {
			if (isSuccess) {
				setQueueData(undefined)
			} else {
				return
			}
		}
		if (value === '') {
			setQueueData(data)
			return
		}
		const fuse = new Fuse(data as TestRecord[], SEARCH_OPTIONS)
		const results: TestRecord[] = fuse.search(value).map(({ item }) => item)
		setQueueData(results)
	}, [value, data, isSuccess])

	return (
		<Stack p="sm">
			<Stack
				sx={{ flexDirection: 'row' }}
				align="center"
				justify={'space-between'}
				mb="sm"
			>
				<Title order={1} size="h3">
					Danh sách chờ kết quả
				</Title>
				<TextInput
					placeholder="Tìm kiếm người bệnh"
					size="md"
					sx={{ minWidth: 450 }}
					icon={<IconSearch size={16} stroke={1.5} />}
					defaultValue={value}
					onChange={(event) => setValue(event.currentTarget.value)}
				/>
			</Stack>
			<Paper p="md">
				<WaitingForResultTable data={queueData} isLoading={isLoading} />
			</Paper>
		</Stack>
	)
}
export default WaitingForResultQueue
