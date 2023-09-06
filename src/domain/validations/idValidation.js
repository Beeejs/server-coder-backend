import z from 'zod';

const idValidation = z.string({
  id: z.string().length(24)
});

export { idValidation };
