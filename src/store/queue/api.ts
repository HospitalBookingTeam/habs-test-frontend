import { TestRecord } from '@/entities/record'
import { baseQueryWithRetry } from '../api'
import { createApi } from '@reduxjs/toolkit/dist/query/react'

export const queueApi = createApi({
	reducerPath: 'queueApi',
	tagTypes: ['Auth', 'Queue'],
	baseQuery: baseQueryWithRetry,
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
		notifyPatient: build.mutation<void, number>({
			query: (queueId) => ({
				url: `test-queue/notify/${queueId}`,
				method: 'GET',
			}),
		}),
		removeFromQueue: build.mutation<
			TestRecord[],
			{ id: number; roomId: number }
		>({
			query: ({ id, roomId }) => ({
				url: `test-queue/remove-from-queue`,
				method: 'POST',
				body: {
					testRecordId: id,
					roomId,
				},
			}),
			async onQueryStarted({ roomId, ...patch }, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedData } = await queryFulfilled

					dispatch(
						queueApi.util.updateQueryData('getQueue', { roomId }, (draft) => {
							return updatedData
						})
					)
				} catch {}
			},
		}),
	}),
})

export const {
	useGetQueueQuery,
	useGetQueueByIdQuery,
	useGetFinishedQueueQuery,
	useConfirmFromQueueByIdMutation,
	useUpdateFileResultMutation,
	useNotifyPatientMutation,
	useRemoveFromQueueMutation,
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
