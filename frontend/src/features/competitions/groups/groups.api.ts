import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';
import {
  GroupDetailSettings,
  GroupMemberRole,
  GroupMemberStatus,
} from '@/features/competitions/groups/group.types';

export const postCreatePrivateGroup = async (slug: string, name: string) => {
  try {
    const response = await api.post(API_ROUTES.GROUPS.CREATE, {
      name,
      competitionSlug: slug,
      type: 'private',
    });

    return { success: response.status === 201 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};

export const postJoinGroup = async (code: string, competitionSlug: string) => {
  try {
    const response = await api.post(API_ROUTES.GROUPS.JOIN, { code, competitionSlug });

    return { success: response.status === 201 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};

export const patchUpdateGroupSettings = async (
  groupSlug: string,
  type: keyof GroupDetailSettings,
  value: boolean,
) => {
  try {
    const response = await api.patch(API_ROUTES.GROUPS.DETAIL.SETTINGS(groupSlug), { type, value });

    return { success: response.status === 201, data: response.data };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};

export const patchUpdateGroupName = async (groupSlug: string, name: string) => {
  try {
    const response = await api.patch(API_ROUTES.GROUPS.DETAIL.NAME(groupSlug), { name });

    return { success: response.status === 201, data: response.data.data };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};

export const deleteGroup = async (groupSlug: string) => {
  try {
    const response = await api.delete(API_ROUTES.GROUPS.DETAIL.INFO(groupSlug));

    return { success: response.status === 200 || response.status === 204 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};

export const patchGroupMemberStatus = async (
  groupSlug: string,
  memberId: string,
  status: GroupMemberStatus,
) => {
  try {
    const response = await api.patch(API_ROUTES.GROUPS.DETAIL.MEMBERS.STATUS(groupSlug, memberId), {
      status,
    });

    return { success: response.status === 201 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};

export const postTransferOwnership = async (groupSlug: string, memberId: string) => {
  try {
    const response = await api.post(API_ROUTES.GROUPS.DETAIL.TRANSFER_OWNERSHIP(groupSlug), {
      memberId,
    });

    return { success: response.status === 201 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};
export const patchGroupMemberRole = async (
  groupSlug: string,
  memberId: string,
  role: GroupMemberRole,
) => {
  try {
    const response = await api.patch(API_ROUTES.GROUPS.DETAIL.MEMBERS.ROLE(groupSlug, memberId), {
      role,
    });

    return { success: response.status === 200 || response.status === 201 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};
export const deleteGroupMember = async (groupSlug: string, memberId: string) => {
  try {
    const response = await api.delete(API_ROUTES.GROUPS.DETAIL.MEMBERS.DELETE(groupSlug, memberId));

    return { success: response.status === 200 || response.status === 204 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};
