var ClimbingrouteModel = require('../models/climbingRouteModel.js');
var RouteConnectionController = require('../controllers/routeConnectionController.js');
/**
 * climbingRouteController.js
 *
 * @description :: Server-side logic for managing climbingRoutes.
 */
const ropeGrades = [
    "3", "3+", "4a", "4b", "4c",
    "5a", "5b", "5c",
    "6a", "6a+", "6b", "6b+", "6c", "6c+",
    "7a", "7a+", "7b", "7b+", "7c", "7c+",
    "8a", "8a+", "8b", "8b+", "8c", "8c+",
    "9a", "9a+", "9b", "9b+", "9c", "9c+"
];
const boulderGrades = [
    "3", "3+", "4", "4+", "5", "5+",
    "6A", "6A+", "6B", "6B+", "6C", "6C+",
    "7A", "7A+", "7B", "7B+", "7C", "7C+",
    "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A"
];
const urbanGrades = [
    "I", "II", "III", "IV", "IV+", "V", "V+", "VI", "VI+",
    "VII", "VII+", "VIII", "VIII+", "IX", "IX+", "X", "X+", "XI", "XI+"
];
module.exports = {

    /**
     * climbingRouteController.list()
     */
    list: async function (req, res) {
        try {
            const climbingRoutes = await ClimbingrouteModel
                .find()
                .populate("postedBy")
                .populate("climbingArea")
            return res.json(climbingRoutes);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing routes.',
                error: err
            });
        }
    },

    /**
     * climbingRouteController.show()
     */
    show: async function (req, res) {
        var id = req.params.id;

        try {
            const climbingRoute = await ClimbingrouteModel
                .findById(id)
                .populate("postedBy")
                .populate("climbingArea")
            if (!climbingRoute) {
                return res.status(404).json({
                    message: 'No such climbing route.'
                });
            }
            return res.json(climbingRoute);
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing route.',
                error: err
            });
        }
    },

    getByClimbingArea: async function (req, res) {
        const areaId = req.params.areaId;
        try {
            const routes = await ClimbingrouteModel
                .find({ climbingArea: areaId })
                .populate("postedBy")
                .populate("climbingArea");

            const updatedRoutes = await Promise.all(routes.map(async (route) => {
                const averageGrade = await RouteConnectionController.computeAverageGrade(route._id.toString());
                const averageRating = await RouteConnectionController.computeAverageRating(route._id.toString());

                return {
                    ...route.toObject(),
                    averageGrade,
                    averageRating
                };
            }));

            return res.json(updatedRoutes);
        } catch (err) {
            return res.status(500).json({
                message: "Error getting routes for climbing area.",
                error: err
            });
        }
    },

    /**
     * climbingRouteController.create()
     */
    create: async function (req, res) {
        var climbingRoute = new ClimbingrouteModel({
			name : req.body.name,
			length : req.body.length,
			type : req.body.type,
            climbingArea: req.body.climbingArea,
            postedBy : req.user.id
        });

        try {
            const savedClimbingRoute = await climbingRoute.save()
            return res.status(201).json(savedClimbingRoute);
        }
        catch (err) {
            return res.status(500).json({
                    message: 'Error when creating climbingRoute',
                    error: err
            });
        }
    },
    updateConnected: async function (req, res) {
        const climbingAreaId = req.body.climbingArea;
        const newRoutes = req.body.routes;
        
        if (req.user.username !== "admin") {
            return res.status(403).json({ message: "No premissions." });
        }

        try {
            if (!climbingAreaId || !Array.isArray(newRoutes)) {
                return res.status(400).json({ message: "Missing climbingArea or routes in request." });
            }
            console.log("newRoutes:", newRoutes);
            const parsedNewRoutes = newRoutes.map(route => JSON.parse(route))

            const newRouteIds = parsedNewRoutes
                .filter(route => route._id)
                .map(route => route._id.toString());
            console.log(newRouteIds)
            const query = {
                climbingArea: climbingAreaId,
            };
            if (newRouteIds.length > 0) {
                query._id = { $nin: newRouteIds };
            }

            await ClimbingrouteModel.deleteMany(query);
           
            for (const routeString of newRoutes) {
                const route = JSON.parse(routeString)
                if (!route._id) {
                    const newRoute = new ClimbingrouteModel({
                        name: route.name,
                        length: route.length,
                        type: route.type,
                        climbingArea: climbingAreaId,
                        postedBy: route.postedBy
                    });
                    try {
                        await newRoute.save();
                    }
                    catch (err){
                        console.log("Error saving route: ", err.message)
                        continue
                    }
                    
                } else {
                    await ClimbingrouteModel.findByIdAndUpdate(route._id, {
                        name: route.name,
                        length: route.length,
                        type: route.type,
                        climbingArea: climbingAreaId,
                        postedBy: route.postedBy
                    }, { new: true });
                    console.log("4")
                    console.log("LlL")
                }
            }

            return res.status(200).send();
        }
        catch (err) {
            console.log("Failed updating routes: ",err)
            return res.status(500).json({
                message: "Failed to update connected routes.",
                error: err
            });
        }
    }
};
