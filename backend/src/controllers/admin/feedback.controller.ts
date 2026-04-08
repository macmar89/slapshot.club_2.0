import { catchAsync } from '../../utils/catchAsync.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import * as feedbackService from '../../services/admin/feedback.service.js';
import { buildPaginatedResponse } from '../../utils/pagination.js';
import type { Request, Response } from 'express';
import type { ListFeedbackQueryInput, UpdateFeedbackStatusInput } from '../../shared/constants/schema/admin/feedback.schema.js';

export const listFeedbackHandler = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListFeedbackQueryInput;
  const { limit, offset } = req.pagination;
  const filters = query.filters || {};

  const { data, totalCount } = await feedbackService.listFeedback(limit, offset, filters as any);

  const response = buildPaginatedResponse(data, totalCount, req.pagination);

  return res.status(HttpStatusCode.OK).json(response);
});

export const getFeedbackHandler = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const item = await feedbackService.getFeedbackAndMarkRead(id);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: item,
  });
});

export const updateFeedbackHandler = catchAsync(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const body = req.body as UpdateFeedbackStatusInput;

  const updated = await feedbackService.updateFeedbackStatus(id, body.status);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: updated,
  });
});
