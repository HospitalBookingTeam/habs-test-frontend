export enum TestRecordStatus {
	CHUA_DAT_LICH,
	DA_DAT_LICH,
	DA_THANH_TOAN,
	CHECKED_IN,
	DANG_TIEN_HANH,
	CHO_KET_QUA,
	HOAN_THANH,
	DA_HUY,
	DA_XOA,
}

export const TEST_RECORD_TRANSLATION: {
	[key in keyof typeof TestRecordStatus]: string
} = {
	CHUA_DAT_LICH: 'Chưa đặt lịch',
	DA_DAT_LICH: 'Đã đặt lịch',
	DA_THANH_TOAN: 'Chờ xét nghiệm',
	CHECKED_IN: 'Đã checkin',
	DANG_TIEN_HANH: 'Đang xét nghiệm',
	CHO_KET_QUA: 'Chờ kết quả',
	HOAN_THANH: 'Hoàn thành',
	DA_HUY: 'Đã hủy',
	DA_XOA: 'Đã xóa',
}

export const renderEnumTestRecordStatus = (status: number) =>
	TestRecordStatus[status]

export const translateTestRecordStatus = (status: number) =>
	TEST_RECORD_TRANSLATION[
		TestRecordStatus[status] as keyof typeof TestRecordStatus
	]

export enum InsuranceSupportStatus {
	KHONG_HO_TRO,
	HO_TRO_MOT_PHAN,
	HO_TRO_TOAN_PHAN,
}

export const INSURANCE_TRANSLATION: {
	[key in keyof typeof InsuranceSupportStatus]: string
} = {
	KHONG_HO_TRO: 'Không hỗ trợ',
	HO_TRO_MOT_PHAN: 'Hỗ trợ một phần',
	HO_TRO_TOAN_PHAN: 'Hỗ trợ toàn phần',
}

export const translateEnumInsuranceStatus = (status: number) =>
	INSURANCE_TRANSLATION[
		InsuranceSupportStatus[status] as keyof typeof InsuranceSupportStatus
	]
