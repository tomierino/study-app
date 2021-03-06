const passport = require("passport");
const mongoose = require("mongoose");
const keys = require("../config/keys");
const User = require("../models/User");

module.exports = (app) => {
  // Add a unit
  app.post("/units/add", (req, res) => {
    // Username of the user being followed
    const { name } = req.body;

    async function addUnit() {
      // Get the model of the user being followed
      const response = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: {
          units: { name },
        },
      });

      res.send(response);
    }

    addUnit();
  });

  // Remove a unit
  app.post("/units/remove", (req, res) => {
    // Destructure request
    const { name } = req.body;

    async function removeUnit() {
      // Get the model of the user being followed
      const response = await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          units: { name },
          assessments: { unit: name },
        },
      });

      res.send(response);
    }

    removeUnit();
  });

  // Rename a unit
  app.post("/units/rename", (req, res) => {
    const { oldName, newName } = req.body;

    async function renameUnit() {
      // Get the model of the user being followed
      const response = await User.updateOne(
        { _id: req.user._id, "units.name": oldName },
        {
          $set: {
            "units.$.name": newName,
          },
        }
      );
      res.send(response);
    }
    renameUnit();
  });

  // Get a unit's data
  app.get("/units/find", (req, res) => {
    const { name } = req.query;

    async function findUnit() {
      // Get the model of the user being followed
      const response = await User.findOne({
        _id: req.user._id,
      }).select({ units: { $elemMatch: { name: name } } });

      res.send(response.units[0]);
    }
    findUnit();
  });

  // Add an assessment to a unit
  app.post("/units/add_assessment", (req, res) => {
    // Destructure request
    const { id, unit, name, weight, dueDate } = req.body;

    async function addAssessment() {
      // Get the model of the user being followed
      const response = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: {
          assessments: {
            id,
            unit,
            name,
            weight,
            dueDate,
            isComplete: false,
            grade: null,
          },
        },
      });

      res.send(response);
    }

    addAssessment();
  });

  // Remove an assessment from a unit
  app.post("/units/remove_assessment", (req, res) => {
    const { assessmentId } = req.body;

    async function removeAssessment() {
      // Get the model of the user being followed
      const response = await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          assessments: {
            id: assessmentId,
          },
        },
      });
      res.send(response);
    }
    removeAssessment();
  });

  // Toggle an assessment's isComplete status
  app.post("/units/toggle_assessment", (req, res) => {
    const { assessmentId, grade, toggleType } = req.body;

    async function toggleAssessment() {
      // Get the model of the user being followed
      const response = await User.updateOne(
        { "assessments.id": assessmentId },
        {
          $set: {
            "assessments.$.grade": grade,
            "assessments.$.isComplete": toggleType,
          },
        }
      );
      res.send(response);
    }
    toggleAssessment();
  });

  // Get a unit's assessments
  app.get("/units/get_assessments", (req, res) => {
    const { unit } = req.query;

    async function getAssessments() {
      // Get the model of the user being followed
      const response = await User.findOne({
        _id: req.user._id,
      }).select("assessments");

      const filteredAssessments = response.assessments.filter((assessment) => {
        return assessment.unit === unit;
      });

      res.send(filteredAssessments);
    }
    getAssessments();
  });
};
