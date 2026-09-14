const MAX_CAUSE_DEPTH = 5;
const MAX_PART_LENGTH = 500;

const truncate = (value: string) =>
  value.length > MAX_PART_LENGTH ? `${value.slice(0, MAX_PART_LENGTH)}…` : value;

const describeSingle = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return typeof error === 'string' ? error : String(error);
  }

  const details = error as { code?: unknown; detail?: unknown; constraint?: unknown };
  const extras: string[] = [];

  if (typeof details.code === 'string') {
    extras.push(`code=${details.code}`);
  }

  if (typeof details.constraint === 'string') {
    extras.push(`constraint=${details.constraint}`);
  }

  if (typeof details.detail === 'string') {
    extras.push(`detail=${details.detail}`);
  }

  return extras.length ? `${error.message} (${extras.join(', ')})` : error.message;
};

export const describeError = (error: unknown): string => {
  const parts: string[] = [];
  let current: unknown = error;

  for (
    let depth = 0;
    depth < MAX_CAUSE_DEPTH && current !== undefined && current !== null;
    depth++
  ) {
    const part = truncate(describeSingle(current).trim());

    if (part.length && !parts.includes(part)) {
      parts.push(part);
    }

    current = current instanceof Error ? current.cause : undefined;
  }

  return parts.join(' | caused by: ') || 'Unknown error';
};
