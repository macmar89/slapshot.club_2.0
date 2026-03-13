export const GroupMessages = {
  GROUP_CREATED: 'group_created_successfully',
  JOIN_GROUP_SUCCESS: 'join_group_success',

  ERRORS: {
    GROUP_NOT_FOUND: 'group_not_found',
    USER_ALREADY_JOINED: 'user_already_joined',
    MAX_GROUPS_REACHED: 'max_groups_reached',
    MAX_JOINED_GROUPS_REACHED: 'max_joined_groups_reached',
    MAX_OWNED_GROUPS_REACHED: 'max_owned_groups_reached',
    GROUP_LOCKED: 'group_locked',
    GROUP_FULL: 'group_full',
    NOT_A_MEMBER: 'not_a_member',
    INSUFFICIENT_PERMISSIONS: 'insufficient_permissions',
    NOT_ACTIVE: 'not_active',
    SLUG_REQUIRED: 'slug_required',
    JOIN_REQUEST_REJECTED: 'join_request_rejected',
    INSUFFICIENT_PLAN_FOR_OWNERSHIP: 'insufficient_plan_for_ownership',
    MEMBER_NOT_FOUND: 'member_not_found',
  },
} as const;
