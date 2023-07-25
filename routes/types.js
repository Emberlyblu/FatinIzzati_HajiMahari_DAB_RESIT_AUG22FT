var express = require("express");
var router = express.Router();
const db = require("../../FatinIzzati_HajiMahari_DAB_RESIT_AUG22FT/models");
const { isAdmin } = require("../../FatinIzzati_HajiMahari_DAB_RESIT_AUG22FT/middlewares/authMiddleware");

// Get all vehicle types
router.get("/", async function (req, res, next) {
  try {
    const [types] = await db.sequelize.query("SELECT * FROM Types");
    console.log(types);
    res.render("types", { user: req.user, types: types });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred");
  }
});

// Create a new vehicle type
router.post("/add", isAdmin, async function (req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Missing vehicle type name");
  }
  try {
    const [result] = await db.sequelize.query(
      "INSERT INTO Types (name) VALUES (?)",
      {
        replacements: [name],
        type: db.Sequelize.QueryTypes.INSERT,
      }
    );
    res.redirect("/types");
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred");
  }
});

// Update a vehicle type
router.put("/update/:id", isAdmin, async function (req, res, next) {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await db.sequelize.query("UPDATE Types SET name = ? WHERE id = ?", {
      replacements: [name, id],
      type: db.Sequelize.QueryTypes.UPDATE,
    });
    res.json({ message: "Type updated successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Delete a vehicle type
router.post("/delete/:id", isAdmin, async function (req, res, next) {
  const { id } = req.params;
  const [vehicles] = await db.sequelize.query(
    "SELECT * FROM Vehicles WHERE typeId = ?",
    {
      replacements: [id],
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const [rentals] = await db.sequelize.query(
    `
        SELECT * 
        FROM Rentals
        INNER JOIN Vehicles ON Rentals.vehicleId = Vehicles.id
        WHERE Vehicles.typeId = ?
    `,
    {
      replacements: [id],
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if ((vehicles && vehicles.length > 0) || (rentals && rentals.length > 0)) {
    return res
      .status(400)
      .send(
        "This vehicle type cannot be deleted as there are vehicles or rentals of this type"
      );
  }

  try {
    await db.sequelize.query("DELETE FROM Types WHERE id = ?", {
      replacements: [id],
      type: db.Sequelize.QueryTypes.DELETE,
    });
    res.redirect("/types");
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .send(
        "This vehicle type cannot be deleted as there are vehicles or rentals of this type"
      );
  }
});

module.exports = router;
