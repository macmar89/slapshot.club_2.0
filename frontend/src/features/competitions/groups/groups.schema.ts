import { z } from 'zod';

type GroupsTranslator = (key: 'validation.name_min' | 'validation.name_max') => string;

export const createGroupFormSchema = (t: GroupsTranslator) =>
  z.object({
    name: z
      .string()
      .min(3, { message: t('validation.name_min') })
      .max(100, { message: t('validation.name_max') }),
  });

export type CreateGroupFormValues = z.infer<ReturnType<typeof createGroupFormSchema>>;
