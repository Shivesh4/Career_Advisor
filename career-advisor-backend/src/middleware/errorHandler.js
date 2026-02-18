export function errorHandler(err, req, res, _next) {
    console.error("Unhandled Error:", err);
    const code = err.status || 500;
    res.status(code).json({ error: err.message || "Internal error" });
  }
  