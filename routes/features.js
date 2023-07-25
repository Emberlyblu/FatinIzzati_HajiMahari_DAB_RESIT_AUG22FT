var express = require("express");
var router = express.Router();
const db = require("../../FatinIzzati_HajiMahari_DAB_RESIT_AUG22FT/models");
const { isAdmin } = require("../../FatinIzzati_HajiMahari_DAB_RESIT_AUG22FT/middlewares/authMiddleware");


// Get all vehicle features
router.get("/", async function (req, res, next) {
  try {
    const features = await db.Feature.findAll();
    res.render("features", { user: req.user, features });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred when retrieving the features");
  }
});


// Add a feature
router.post("/add", isAdmin, async function (req, res, next) {
  const { name } = req.body;
  try {
    await db.Feature.create({ name });
    res.redirect("/features");
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred when creating the feature");
  }
});

// Update a feature
router.put("/update/:id", isAdmin, async function (req, res, next) {
  const { id } = req.params;
  const { name } = req.body;

  const [vehicleFeatures] = await db.sequelize.query(
    "SELECT * FROM VehicleFeatures WHERE featureId = ?",
    {
      replacements: [id],
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );
  if (vehicleFeatures && vehicleFeatures.length > 0) {
    return res
      .status(400)
      .send(
        "This feature cannot be updated as there are vehicles using this feature"
      );
  }
  try {
    await db.sequelize.query("UPDATE Features SET name = ? WHERE id = ?", {
      replacements: [name, id],
      type: db.Sequelize.QueryTypes.UPDATE,
    });
    res.json({ message: "Feature updated successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Delete a feature
router.post("/delete/:id", isAdmin, async function (req, res, next) {
  const { id } = req.params;

  const featureWithVehicles = await db.Feature.findOne({
    where: { id },
    include: db.Vehicle,
  });

  if (
    featureWithVehicles &&
    featureWithVehicles.Vehicles &&
    featureWithVehicles.Vehicles.length > 0
  ) {
    return res
      .status(400)
      .send(
        "This feature cannot be deleted as there are vehicles using this feature"
      );
  }

  try {
    await db.Feature.destroy({ where: { id } });
    res.redirect("/features");
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred when deleting the feature");
  }
});

module.exports = router;
