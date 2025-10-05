export const requireFields = (body, fields) => {
  for (const field of fields) {
    if (!body[field]) {
      return { error: { code: "FIELD_REQUIRED", field, message: `${field} is required` } };
    }
  }
  return null;
};
