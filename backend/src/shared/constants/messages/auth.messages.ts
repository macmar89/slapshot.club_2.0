export const AuthMessages = {
  LOGOUT_SUCCESS: 'Logged out successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  REGISTER_SUCCESS: 'Registered successfully',
  VERIFY_SUCCESS: 'verify_success',
  VERIFICATION_SENT: 'verification_sent',
  FORGOT_PASSWORD_SUCCESS: 'forgot_password_success',
  RESET_PASSWORD_SUCCESS: 'reset_password_success',

  ERRORS: {
    MISSING_REFRESH_TOKEN: 'missing_refresh_token',

    USERNAME_ALREADY_EXISTS: 'username_already_exists',
    EMAIL_ALREADY_EXISTS: 'email_already_exists',
    INVALID_CREDENTIALS: 'wrong_credentials',
    TOKEN_EXPIRED: 'token_expired',
    UNAUTHORIZED: 'unauthorized',

    SESSION_FAILED: 'session_failed',
    USER_CREATION_FAILED: 'user_creation_failed',
    USER_NOT_FOUND: 'user_not_found',

    INVALID_REFRESH_TOKEN: 'invalid_refresh_token',
    INVALID_TOKEN: 'invalid_token',
    EMAIL_ALREADY_VERIFIED: 'email_already_verified',

    VALIDATION: {
      INVALID_EMAIL: 'invalid_email',
      PHONE_NUMBER_TOO_SHORT: 'phone_number_too_short',
      PASSWORD_MISSING_REQUIREMENTS: 'password_missing_requirements',
      USERNAME_TOO_SHORT: 'username_too_short',
      USERNAME_TOO_LONG: 'username_too_long',
      USERNAME_INVALID_CHARACTERS: 'username_invalid_characters',
      PASSWORD_TOO_SHORT: 'password_too_short',
      PASSWORD_TOO_LONG: 'password_too_long',
      PASSWORD_NO_UPPERCASE: 'password_no_uppercase',
      PASSWORD_NO_LOWERCASE: 'password_no_lowercase',
      PASSWORD_NO_NUMBER: 'password_no_number',
      PASSWORD_NO_SPECIAL: 'password_no_special',
      TURNISTILE_ERROR: 'turnistile_error',
      GDPR_REQUIRED: 'gdpr_required',
      PASSWORDS_DONT_MATCH: 'passwords_dont_match',
      REQUIRED: 'required',
    },

    FORBIDDEN: 'forbidden',
    SUBSCRIPTION_REQUIRED: 'subscription_required',
    PREMIUM_ONLY: 'premium_only',
  },
} as const;
