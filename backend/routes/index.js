const Router = require("express");
const router = new Router();

const userRouter = require("./user-router");
const siteRouter = require("./site-router");

router.use("/user", userRouter);
router.use("/site", siteRouter);

module.exports = router;
