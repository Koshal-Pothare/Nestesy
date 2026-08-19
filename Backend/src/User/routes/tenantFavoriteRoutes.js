const express = require("express");

const {
  addFavorite,
  getFavorites,
  removeFavorite,
  isFavorited,
  getFavoriteCount,
} = require("../controllers/favoriteController");

const { protect, authorize } = require("../../common/middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize("tenant"));

router.post("/", addFavorite);

router.get("/", getFavorites);

router.get("/count", getFavoriteCount);

router.get("/check/:propertyId", isFavorited);

router.delete("/:propertyId", removeFavorite);

module.exports = router;