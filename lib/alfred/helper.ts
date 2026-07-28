export const serializeList = (list: string[]) =>
    list.join(", ");

export const deserializeList = (
    value?: string
) =>
    value
        ? value.split(",").map(s => s.trim())
        : [];