/* eslint-disable @typescript-eslint/no-explicit-any */
//export interface SaveDataModel {
//    coordinatorName: string,
//    caregiverName: string,
//    caregiverId: string,
//    caregiverPhone: string,
//    caregiverEmail: string,
//    address: string
//}

export interface QuestionModel {
    question: string,
    type: string,
    priority: number,
    options: any[]
}

export interface Kindergarten {
    id: number;
    nanny: string;
    // שדות נוספים לפי הצורך
};
export interface HubModel {
    id: string,
    kindergartens?: Kindergarten[]
}
