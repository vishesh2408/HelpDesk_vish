export const checkVersion = (req, res, next) => {
  const version = req.body.version;
  if (version === undefined) {
    return res.status(400).json({
      error: { code: "FIELD_REQUIRED", field: "version", message: "Version is required" }
    });
  }
  next();
};
