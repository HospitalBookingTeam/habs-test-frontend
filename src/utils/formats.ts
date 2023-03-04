import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const formatDate = (date: string | number, format = 'DD/MM/YYYY') => {
	return dayjs(date).format(format)
}

export const getLocalTimeFromUTC = (date: number | string) => {
	return dayjs(date).utc().local().valueOf()
}

export const formatCurrency = (amount: number | string) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(Number(amount))
}

export function readFileAsync(file: any): Promise<any> {
	return new Promise((resolve, reject) => {
		let reader = new FileReader()

		reader.onload = () => {
			resolve(reader.result)
		}

		reader.onerror = reject

		reader.readAsBinaryString(file)
	})
}
