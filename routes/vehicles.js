var express = require("express");
var router = express.Router();
const db = require("../../FatinIzzati_HajiMahari_DAB_RESIT_AUG22FT/models");
const { isCustomer, isAdmin } = require("../../FatinIzzati_HajiMahari_DAB_RESIT_AUG22FT/middlewares/authMiddleware");

// Get all vehicle
router.get("/", async function (req, res, next) {
  const vehiclesQuery = `
    SELECT V.*, 
           C.name AS Colour,
           T.name AS VehicleType,
           GROUP_CONCAT(F.name) AS Features,
           CASE 
             WHEN DATEDIFF(CURDATE(), lastServiceDate) < 180 THEN 'Serviced' 
             ELSE 'Not Serviced' 
           END AS ServiceStatus
    FROM Vehicles V
    LEFT JOIN Colours C ON V.colourId = C.id
    LEFT JOIN Types T ON V.typeId = T.id
    LEFT JOIN VehicleFeatures VF ON V.id = VF.vehicleId
    LEFT JOIN Features F ON VF.featureId = F.id
    GROUP BY V.id
    HAVING ServiceStatus = 'Serviced';
  `;
  try {
    const [vehicles] = await db.sequelize.query(vehiclesQuery);

    if (!vehicles || vehicles.length === 0) {
      throw new Error("No vehicles returned from the query");
    }

    res.render("vehicles", { user: req.user, vehicles: vehicles });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred");
  }
});

// Create vehicle rental
router.post("/rent/:id", isCustomer, async function (req, res, next) {
  const { id } = req.params;
  const userId = req.user.id;

  const [rentedVehicle] = await db.sequelize.query(
    "SELECT * FROM Rentals WHERE userId = ?",
    {
      replacements: [userId],
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (rentedVehicle) {
    return res.status(400).send("You have already rented a vehicle");
  }

  const [rentedVehicleAlready] = await db.sequelize.query(
    "SELECT * FROM Vehicles WHERE rented = 1 AND id = ?",
    {
      replacements: [id],
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  if (rentedVehicleAlready) {
    return res.status(400).send("This vehicle is already rented");
  }

  await db.sequelize.query("UPDATE Vehicles SET rented = 1 WHERE id = ?", {
    replacements: [id],
    type: db.Sequelize.QueryTypes.UPDATE,
  });

  await db.sequelize.query(
    "INSERT INTO Rentals (userId, vehicleId) VALUES (?, ?)",
    {
      replacements: [userId, id],
      type: db.sequelize.QueryTypes.INSERT,
    }
  );

  res.redirect("/vehicles");
});

// Delete vehicle rental
router.delete("/rent/:id", isAdmin, async function (req, res, next) {
  const { id } = req.params;

  const [rentedVehicle] = await db.sequelize.query(
    "SELECT * FROM Vehicles WHERE rented = 1 AND id = ?",
    {
      replacements: [id],
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!rentedVehicle) {
    return res.status(400).send("This vehicle is not currently rented");
  }

  await db.sequelize.query("UPDATE Vehicles SET rented = 0 WHERE id = ?", {
    replacements: [id],
    type: db.Sequelize.QueryTypes.UPDATE,
  });

  await db.sequelize.query("DELETE FROM Rentals WHERE vehicleId = ?", {
    replacements: [id],
    type: db.Sequelize.QueryTypes.DELETE,
  });

  res.sendStatus(200);
});

//Get all most count of vehicle types
router.get("/popular-types", async function (req, res, next) {
  const [[{ name }]] = await db.sequelize.query(`
    SELECT T.name, COUNT(*) AS count
    FROM Types T 
    INNER JOIN Vehicles V ON T.id = V.typeId 
    GROUP BY T.name 
    ORDER BY count DESC 
    LIMIT 1;
  `);

  const vehiclesQuery = `
    SELECT V.*, 
           C.name AS Colour,
           T.name AS VehicleType,
           GROUP_CONCAT(F.name) AS Features,
           CASE 
             WHEN DATEDIFF(CURDATE(), lastServiceDate) < 180 THEN 'Serviced' 
             ELSE 'Not Serviced' 
           END AS ServiceStatus
    FROM Vehicles V
    LEFT JOIN Colours C ON V.colourId = C.id
    LEFT JOIN Types T ON V.typeId = T.id
    LEFT JOIN VehicleFeatures VF ON V.id = VF.vehicleId
    LEFT JOIN Features F ON VF.featureId = F.id
    WHERE T.name = ?
    GROUP BY V.id;
  `;

  const vehiclesResult = await db.sequelize.query(vehiclesQuery, {
    replacements: [name],
    type: db.sequelize.QueryTypes.SELECT,
  });

  if (Array.isArray(vehiclesResult)) {
    res.render("vehicles-list", { user: req.user, vehicles: vehiclesResult });
  } else {
    console.error("Vehicles data is not an array:", vehiclesResult);
    res.status(500).send("An error occurred");
  }
});

//Get all vehicles requiring service
router.get("/vehicles-requiring-service", async function (req, res, next) {
  const vehiclesRequiringServiceQuery = `
    SELECT V.*, 
           C.name AS Colour,
           T.name AS VehicleType,
           GROUP_CONCAT(F.name) AS Features,
           CASE 
             WHEN DATEDIFF(CURDATE(), lastServiceDate) < 180 THEN 'Serviced' 
             ELSE 'Not Serviced' 
           END AS ServiceStatus
    FROM Vehicles V
    LEFT JOIN Colours C ON V.colourId = C.id
    LEFT JOIN Types T ON V.typeId = T.id
    LEFT JOIN VehicleFeatures VF ON V.id = VF.vehicleId
    LEFT JOIN Features F ON VF.featureId = F.id
    GROUP BY V.id
    HAVING ServiceStatus = 'Not Serviced';
  `;
  const [vehicles] = await db.sequelize.query(vehiclesRequiringServiceQuery);
  res.render("vehicles-list", { vehicles: vehicles, user: req.user });
});

//Get all vehicles with cruise control feature
router.get("/vehicles-with-cruise-control", async function (req, res, next) {
  const vehiclesWithCruiseControlQuery = `
    SELECT V.*, 
           C.name AS Colour,
           T.name AS VehicleType,
           GROUP_CONCAT(F.name) AS Features,
           CASE 
             WHEN DATEDIFF(CURDATE(), lastServiceDate) < 180 THEN 'Serviced' 
             ELSE 'Not Serviced' 
           END AS ServiceStatus
    FROM Vehicles V
    INNER JOIN VehicleFeatures VF ON V.id = VF.vehicleId
    LEFT JOIN Colours C ON V.colourId = C.id
    LEFT JOIN Types T ON V.typeId = T.id
    LEFT JOIN Features F ON VF.featureId = F.id
    WHERE VF.featureId = 2
    GROUP BY V.id;
  `;
  const [vehicles] = await db.sequelize.query(vehiclesWithCruiseControlQuery);
  res.render("vehicles-list", { vehicles: vehicles, user: req.user });
});

//Get all currently rented vehicles
router.get("/currently-rented-vehicles", async function (req, res, next) {
  const vehiclesQuery = `
    SELECT V.*, 
           C.name AS Colour,
           T.name AS VehicleType,
           GROUP_CONCAT(F.name) AS Features,
           CASE 
             WHEN DATEDIFF(CURDATE(), lastServiceDate) < 180 THEN 'Serviced' 
             ELSE 'Not Serviced' 
           END AS ServiceStatus
    FROM Vehicles V
    INNER JOIN Rentals R ON V.id = R.vehicleId
    LEFT JOIN Colours C ON V.colourId = C.id
    LEFT JOIN Types T ON V.typeId = T.id
    LEFT JOIN VehicleFeatures VF ON V.id = VF.vehicleId
    LEFT JOIN Features F ON VF.featureId = F.id
    WHERE V.rented = 1
    GROUP BY V.id;
  `;

  const [results] = await db.sequelize.query(vehiclesQuery);

  res.render("vehicles-list", { vehicles: results, user: req.user });
});

//Get all vehicles
router.get("/all", async function (req, res, next) {
  const vehiclesQuery = `
    SELECT V.*, 
           C.name AS Colour,
           T.name AS VehicleType,
           GROUP_CONCAT(F.name) AS Features,
           CASE 
             WHEN DATEDIFF(CURDATE(), lastServiceDate) < 180 THEN 'Serviced' 
             ELSE 'Not Serviced' 
           END AS ServiceStatus
    FROM Vehicles V
    LEFT JOIN Colours C ON V.colourId = C.id
    LEFT JOIN Types T ON V.typeId = T.id
    LEFT JOIN VehicleFeatures VF ON V.id = VF.vehicleId
    LEFT JOIN Features F ON VF.featureId = F.id
    GROUP BY V.id;
  `;

  const [vehicles] = await db.sequelize.query(vehiclesQuery);

  res.render("vehicles-list", { user: req.user, vehicles: vehicles });
});

module.exports = router;
