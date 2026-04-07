import { db } from '../db/index.js';
import type { Request } from 'express';
import { auditActionEnum, auditLogs } from '../db/schema/index.js';

export interface AuditCtx {
  userId?: string | undefined;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

export const logActivity = async (
  ctx: Request | AuditCtx,
  action: (typeof auditActionEnum.enumValues)[number],
  entity: { type: any; id?: string },
  metadata?: any,
  overrides?: { userId?: string; orgId?: string },
) => {
  const isRequest = (obj: any): obj is Request =>
    obj && typeof obj.get === 'function' && 'ip' in obj;

  const userId = overrides?.userId ?? (isRequest(ctx) ? ctx.user?.id : ctx.userId);
  const ipAddress = isRequest(ctx) ? ctx.ip : ctx.ipAddress;
  const userAgent = isRequest(ctx) ? ctx.get('user-agent') : ctx.userAgent;

  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      entityType: entity.type,
      entityId: entity.id,
      metadata: metadata,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
};
