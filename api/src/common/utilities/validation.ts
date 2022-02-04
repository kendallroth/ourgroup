/**
 * Password validation regex (8 characters with at least 1 special character)
 *
 * Source: https://stackoverflow.com/a/21456918/4206438
 */
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=`~\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=`~\[\]{};':"\\|,.<>\/?]{8,}$/; // prettier-ignore
