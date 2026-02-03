const Router = require("express");
const siteController = require("../controllers/site-controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.use(authMiddleware);

router.get("/", siteController.getSites);
router.get("/:id", siteController.getSite);
router.post("/", siteController.createSite);
router.put("/:id", siteController.updateSite);
router.delete("/:id", siteController.deleteSite);
router.post("/:id/preview", siteController.setPreview);
router.get("/:id/full", siteController.getFullSite);
router.post("/:siteId/components", siteController.addComponent);
router.put("/:siteId/components/:componentId", siteController.updateComponent);
router.delete(
  "/:siteId/components/:componentId",
  siteController.deleteComponent,
);
router.put("/:siteId/components-order", siteController.updateComponentsOrder);

module.exports = router;
