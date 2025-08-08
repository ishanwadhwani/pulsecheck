const CheckModel = require("../models/checkModel");
const LogModel = require("../models/logModel");

class CheckController {
  // creating a new check
  static async createCheck(req, res) {
    const { name, url, interval_minutes } = req.body;
    const user_id = req.user.id; // Get the user ID from the authenticated user

    if (!name || !url || !interval_minutes) {
      return res
        .status(400)
        .json({ error: "Name, URL, and interval are required." });
    }

    try {
      const newCheck = await CheckModel.create({
        user_id,
        name,
        url,
        interval_minutes,
      });
      return res.status(201).json(newCheck);
    } catch (error) {
      console.error("Error creating check:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // getting all checks for a user
  static async getUserChecks(req, res) {
    try {
      const checks = await CheckModel.findByUserId(req.user.id);
      res.json(checks);
    } catch (error) {
      console.error("Error fetching user checks:", error);
      res.status(500).json({ error: "Error fetching user checks." });
    }
  }

  static async getCheckLogs(req, res) {
    try {
      const { checkId } = req.params;
      const userId = req.user.id;

      const check = await CheckModel.findByIdAndUserId(checkId, userId);
      if (!check) {
        return res.status(404).json({
          message: "Check not found or do not have permission to view it.",
        });
      }
      const logs = await LogModel.findByCheckId(checkId);
      res.json(logs);
    } catch (error) {
      console.error("Get check logs error:", error);
      res.status(500).json({ error: "Error fetching check logs." });
    }
  }

  static async deleteCheck(req, res) {
    try {
      const { checkId } = req.params;
      const userId = req.user.id;

      const deleteCheck = await CheckModel.deleteByIdAndUserId(checkId, userId);

      if (!deleteCheck) {
        return res.status(404).json({
          message:
            "Check not found or you do not have permission to delete it.",
        });
      }
      res.json({ message: "Check deleted successfully." });
    } catch (error) {
      console.error("Delete Check Error:", error);
      res.status(500).json({ message: "Server error deleting check." });
    }
  }

  static async updateCheck(req, res) {
    try {
      const { checkId } = req.params;
      const userId = req.user.id;
      const { name, url, interval_minutes } = req.body;

      // Basic validation
      if (!name || !url || !interval_minutes) {
        return res
          .status(400)
          .json({ message: "Name, URL, and interval are required." });
      }

      const updatedCheck = await CheckModel.update(checkId, userId, {
        name,
        url,
        interval_minutes,
      });

      if (!updatedCheck) {
        return res
          .status(404)
          .json({
            message:
              "Check not found or you do not have permission to edit it.",
          });
      }

      res.json(updatedCheck);
    } catch (error) {
      console.error("Update Check Error:", error);
      res.status(500).json({ message: "Server error updating check." });
    }
  }
}

module.exports = CheckController;
