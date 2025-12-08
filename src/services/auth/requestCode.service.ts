import { makeHttpError } from "../../utils/errors/errorCatalog";


export function requestCodeService(phone: string) {
    if (!phone || typeof(phone) !== 'string' || phone.match(/^[0-9]+$/) === null) {
        throw makeHttpError("PHONE_INVALID");
    };
    return { attempts_left: 4,
    time_to_new_code_left: 30};
};
