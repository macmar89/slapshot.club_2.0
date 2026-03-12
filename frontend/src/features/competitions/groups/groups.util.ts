import { SUBSCRIPTION_CONFIG } from '@/config/subscription.config';
import { GroupMemberRole } from '@/features/competitions/groups/group.types';
import { SubscriptionPlan } from '@/features/users/users.types';

export const GROUP_OWNERSHIP_RULES = {
  ELIGIBLE_PLANS: [SUBSCRIPTION_CONFIG.PLANS.PRO, SUBSCRIPTION_CONFIG.PLANS.VIP],
} as const;

export const isPlanEligibleForOwnership = (plan: SubscriptionPlan | null | undefined): boolean => {
  if (!plan) return false;
  return (GROUP_OWNERSHIP_RULES.ELIGIBLE_PLANS as readonly string[]).includes(plan);
};

export const canActorManageTarget = (
  actorRole: GroupMemberRole,
  targetRole: GroupMemberRole,
): boolean => {
  if (actorRole === 'owner') return targetRole !== 'owner';
  if (actorRole === 'admin') return targetRole === 'member';
  return false;
};
