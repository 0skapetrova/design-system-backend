import { HttpError } from "./HttpError";

export function makeHttpError (code: keyof typeof ERRORS) {
    const info = ERRORS[code];
    if (!info) throw new Error(`Unknown error code: ${code}`);
    return new HttpError(info.status, code, info.message, info.details);
}

export const ERRORS = {
  PHONE_INVALID: {
    status: 400,
    message: "Номер телефона не проходит серверную проверку формата",
    details: "phone должен содержать только цифры"
  },

  PHONE_ALREADY_REGISTERED: {
    status: 400,
    message: "Номер телефона уже используется другим аккаунтом",
    details: "Используйте другой номер телефона"
  },

  TOO_MANY_REQUESTS: {
    status: 429,
    message: "Повторный запрос SMS-кода отправлен слишком рано",
    details: "Подождите перед повторным запросом"
  },

  CODE_INVALID: {
    status: 400,
    message: "Введённый код неверный",
    details: "Отправьте новый запрос"
  },

  CODE_EXPIRED: {
    status: 400,
    message: "Код просрочен и требует повторной отправки",
    details: "Запросите новый код"
  },

  USERNAME_TAKEN: {
    status: 400,
    message: "Такой username уже существует",
    details: "Выберите другой username"
  },

  PASSWORD_WEAK: {
    status: 400,
    message: "Пароль не соответствует требованиям безопасности",
    details: "Минимум 8 символов, включая заглавную букву"
  },

  TOO_MANY_ATTEMPTS: {
    status: 400,
    message: "Исчерпаны попытки ввода кода",
    details: "Отправьте новый запрос кода"
  },

  PHONE_BLOCKED: {
    status: 403,
    message: "Телефон временно заблокирован",
    details: "Попробуйте позже или обратитесь в поддержку"
  }
};
