const express = require("express");
const router = express.Router();
const packageController = require("../controllers/package");
const { verifyAdmin } = require("../auth");

const { addPackageToUser, getAllPackages, getPackagesByUser } = packageController;

router.post("/add-package", addPackageToUser);
router.get("/all-packages", getAllPackages);
router.get("/:membershipId", getPackagesByUser);

module.exports = router;