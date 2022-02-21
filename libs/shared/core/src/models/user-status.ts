export type UserProgressStatus =
  | 'active'
  | 'provisioned'
  | 'staged'
  | 'recovery'
  | 'deprovisioned'
  | 'password expired';

export const UserStatus = {
  // Active status
  ACTIVE: 'active' as UserProgressStatus,
  // New user is added in Okta but not activated yet
  PROVISIONED: 'provisioned' as UserProgressStatus,
  // New users created through the API and not activated yet
  STAGED: 'staged' as UserProgressStatus,
  // Existing user, activated previously, is in password reset mode
  RECOVERY: 'recovery' as UserProgressStatus,
  // Deactivated in Okta
  DEPROVISIONED: 'deprovisioned' as UserProgressStatus,
  // User password is expired
  PASSWORD_EXPIRED: 'password expired' as UserProgressStatus,
};
