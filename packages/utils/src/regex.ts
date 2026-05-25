/**
 * Commonly used regular expressions
 */
export const SNAKE_CASE_REGEX = /^[a-z]+(_[a-z0-9]+)*$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_REGEX = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
export const PHONE_REGEX = /^\+?[\d\s\-().]{7,}$/;
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const HEX_COLOR_REGEX = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
export const POSTAL_CODE_REGEX = /^\d{5}(-\d{4})?$/;
export const IP_V4_REGEX = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
export const IP_V6_REGEX = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|::1)$/;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
export const NON_EMPTY_STRING_REGEX = /\S+/;