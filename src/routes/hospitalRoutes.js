const express = require("express");
const { http400 } = require("../helpers/string-resources");
const router = express.Router();

const stringResources = require("../helpers/string-resources");

const userHasReadPermission = require("../helpers/userHasReadPermission.js");
const userHasAdminPermission = require("../helpers/userHasAdminPermission.js");

const Hospital = require("../models/Hospital");
const User = require("../models/User");

const AllHospitals = require("../controllers/AllHospitals");
const HospitalsByCityAndState = require("../controllers/HospitalsByCityAndState");
const HospitalsByCity = require("../controllers/HospitalsByCity");
const HospitalsByCounty = require("../controllers/HospitalsByCounty");
const HospitalsByHospitalType = require("../controllers/HospitalsByHospitalType");
const HospitalsByHospitalOwnership = require("../controllers/HospitalsByHospitalOwnership");
const HospitalsByEmergencyServices = require("../controllers/HospitalsByEmergencyServices");
const HospitalsByProviderID = require("../controllers/HospitalsByProviderID");
const HospitalsByRadius = require("../controllers/HospitalsByRadius");
const HospitalsByState = require("../controllers/HospitalsByState");

router.get("/", async (req, res) => {
      let apiKeyHeaderValue = "";

      let userPermission = "NONE";

      if (req.get("X-API-KEY") !== undefined) {
            apiKeyHeaderValue = req.get("X-API-KEY");
      }

      const userQuery = await User.find({ api_key: apiKeyHeaderValue }).exec();
      let authenticated = false;
      if (userQuery && userQuery.length === 1) {
            authenticated = true;

            if (userQuery[0].permission) {
                  userPermission = userQuery[0].permission;
            }
      }

      try {
            // console.log(JSON.stringify(req.headers));

            // We only want to send the request through only if the person accessing
            // the API is authenticated AND has a READ permission.
            if (authenticated && userHasReadPermission(userPermission)) {
                  // All hospitals -- If nothing in the query string
                  if (Object.keys(req.query).length === 0) {
                        AllHospitals(req, res);
                  }
                  // If something in the query string, lets read the query string and find accordingly
                  else {
                        // If city and state are part of the query string
                        if (req.query.city && req.query.state) {
                              HospitalsByCityAndState(req, res);
                        }

                        // If city name is part of the query string, but not state
                        else if (req.query.city && !req.query.state) {
                              HospitalsByCity(req, res);
                        }
                        // If state is part of the query string, but not city
                        else if (req.query.state && !req.query.city) {
                              HospitalsByState(req, res);
                        }

                        // If county name is part of the query string
                        else if (req.query.county) {
                              HospitalsByCounty(req, res);
                        }

                        // If hospital name is part of the query string
                        else if (req.query.name) {
                              HospitalsByHospitalName(req, res);
                        }

                        // If hospital type is part of the query string
                        else if (req.query.type) {
                              HospitalsByHospitalType(req, res);
                        }

                        // If hospital ownership is part of the query string
                        else if (req.query.ownership) {
                              HospitalsByHospitalOwnership(req, res);
                        }

                        // If emergency services is part of the query string
                        else if (req.query.emergency) {
                              HospitalsByEmergencyServices(req, res);
                        }

                        // If provider ID is part of the query string
                        else if (req.query.providerId) {
                              HospitalsByProviderID(req, res);
                        }

                        // If emergency services is part of the query string
                        else if (req.query.zipCode) {
                              HospitalsByZipCode(req, res);
                        } else if (
                              req.query.lat &&
                              req.query.lon &&
                              req.query.dist
                        ) {
                              console.log(req.query.lon);
                              // Extra credit - Not implemented yet
                              HospitalsByRadius(req, res);
                        }
                  }
            } else {
                  res.status(401).json({
                        data: { error: stringResources.http401 },
                  });
                  console.log("AAA");
            }
      } catch (err) {
            res.status(400).json({
                  data: { error: stringResources.http400 },
            });
            console.log("BBB");
      }
});

// 37:42 in Youtube video for POST
// TO-DO

module.exports = router;
