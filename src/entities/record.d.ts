export interface PatientInRecord {
	id: number
	phoneNumber: string
	name: string
	gender: number
	dateOfBirth: string
	address: string
	bhyt: string
}

export interface TestRecord {
	id: number
	date: string
	numericalOrder: number
	status: number
	patientName: string
	operationId: number
	operationName: string
	patientId: number
	patient: PatientInRecord

	resultFileLink?: string
	resultDescription?: string
	doctor?: string
	roomNumber?: number
	floor?: string
	failReason?: string
}
