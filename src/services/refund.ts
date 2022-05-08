import { i18n } from "i18next";
import { request } from "../utils/request";

type Refund = {
    clinicId: string,
    verifyType: number,
    voucher: string;
    password: string,
    i18n: i18n,
    token: string
}

const getUrl = (verifyType: number) => {
    switch (verifyType) {
        case 2:
            return 'refund_via_card';
        default:
            return 'refund_QRCode';
    }
}

export const refund = async ({ clinicId, verifyType, voucher, password, i18n, token }: Refund) => {
    const resp = await request({
        url: getUrl(verifyType),
        data: {
            clinic_id: Number(clinicId),
            voucher,
            op_password: password
        },
        token,
        i18n
    });
}