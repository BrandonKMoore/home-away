const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

router.use('/api', apiRouter);

router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

router.use((err, req, res, next)=>{
  const logErr = {}

  if(err.message) logErr.message = err.message;
  if(err.errors) logErr.errors = err.errors
  return res.json(logErr)
})

module.exports = router;
