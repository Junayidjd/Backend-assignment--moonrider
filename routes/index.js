// const express = require("express");
// const identifyController = require("../controllers/identifyController");

// const router = express.Router();

// router.post("/identify", identifyController.identify);

// module.exports = router;

const express = require("express");
const identifyController = require("../controllers/identifyController");

const router = express.Router();

router.post("/identify", identifyController.identify);

module.exports = router;
