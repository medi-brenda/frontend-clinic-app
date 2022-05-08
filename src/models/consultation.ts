export type Consultation = {
    benefit: string,
    insurer: string,
    price: string,
}

export function newConsultation() {
    return {
        benefit: '',
        insurer: '',
        price: ''
    }
}