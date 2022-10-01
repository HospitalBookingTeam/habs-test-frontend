export interface Patient {
	patientName: string
	patientId: string
	icdDiseaseName: boolean
	doctorName: string
	clinicalSymptom: string
	date?: string
	estimatedDate?: string
	resultFileLink?: string
	status: string
}
