import { TestRecord } from '@/entities/record'
import { api } from '../api'

export const queueApi = api.injectEndpoints({
	endpoints: (build) => ({
		getQueue: build.query<
			TestRecord[],
			{ roomId?: number; isWaitingForResult?: boolean }
		>({
			query: ({ roomId, isWaitingForResult = false }) => ({
				url: 'test-queue',
				params: {
					'room-id': roomId,
					'is-waiting-for-result': isWaitingForResult,
				},
			}),
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: 'Queue', id } as const)),
				{ type: 'Queue' as const, id: 'LIST' },
			],
		}),
		getQueueById: build.query<TestRecord, number | undefined>({
			query: (id) => ({
				url: `test-queue/${id}`,
			}),
			providesTags: (result) => [{ type: 'Queue' as const, id: result?.id }],
		}),
		getFinishedQueue: build.query<TestRecord[], number>({
			query: (roomId) => ({
				url: 'test-queue/finished',
				params: { 'room-id': roomId },
			}),
			providesTags: (result = []) => [
				...result.map(
					({ id }) => ({ type: 'Queue', field: 'finished', id } as const)
				),
				{ type: 'Queue' as const, id: 'FINISHED_LIST' },
			],
		}),
		confirmFromQueueById: build.mutation<void, number>({
			query: (queueId) => ({
				url: `test-queue/confirm/${queueId}`,
				method: 'POST',
			}),
		}),
		updateFileResult: build.mutation<void, any>({
			query: (body) => ({
				url: `test-queue`,
				headers: { 'Content-Type': 'multipart/form-data' },
				method: 'PUT',
				body: {
					...body,
				},
			}),
		}),
	}),
})

export const {
	useGetQueueQuery,
	useGetQueueByIdQuery,
	useGetFinishedQueueQuery,
	useConfirmFromQueueByIdMutation,
	useUpdateFileResultMutation,
} = queueApi

export const {
	endpoints: {
		getQueue,
		getQueueById,
		getFinishedQueue,
		confirmFromQueueById,
		updateFileResult,
	},
} = queueApi
