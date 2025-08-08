const cron = require("node-cron");
const axios = require("axios");

const CheckModel = require("../models/checkModel");
const LogModel = require("../models/logModel");
const MailService = require("../services/mailService");
const UserModel = require("../models/userModel");

class MonitoringEngine {
  static initialize() {
    console.log("Montioring Engine Initialized");

    // Schedule a task to run every minute.
    // The cron pattern '* * * * *' means "at every minute".
    cron.schedule("* * * * *", this.runChecks.bind(this));
  }

  static async runChecks() {
    console.log(`\n[${new Date().toISOString()}] Running scheduled checks...`);

    try {
      const allChecks = await CheckModel.findAll();
      if (allChecks.length === 0) {
        // console.log("   -> No checks to run.");
        return;
      }

      // console.log(`   -> Found ${allChecks.length} checks to process.`);
      const dueChecks = [];
      const now = new Date();

      for (const check of allChecks) {
        // If a check has never been run, it's due immediately.
        if (!check.last_checked_at) {
          dueChecks.push(check);
          continue;
        }

        const lastChecked = new Date(check.last_checked_at);
        const intervalMillis = check.interval_minutes * 60 * 1000;
        const nextDueTime = new Date(lastChecked.getTime() + intervalMillis);

        // If the current time is past the next due time, add it to the list.
        if (now >= nextDueTime) {
          dueChecks.push(check);
        }
      }

      if (dueChecks.length === 0) {
        console.log("   -> No checks are due to run at this time.");
        return;
      }

      console.log(`   -> Found ${dueChecks.length} checks due for processing.`);
      const checkPromises = dueChecks.map((check) => this.processCheck(check));
      await Promise.allSettled(checkPromises);
      console.log(
        `[${new Date().toISOString()}] ✔️ Finished processing due checks.`
      );
    } catch (error) {
      console.error("Error during runChecks:", error);
    }
  }

  /**
   * Processes a single check: pings the URL, logs the result, and updates the status.
   * @param {object} check - The check object from the database.
   */
  static async processCheck(check) {
    const startTime = Date.now();
    const oldStatus = check.current_status;
    let responseTime, newStatus, statusCode;

    try {
      // HTTP GET request to the user's URL
      const response = await axios.get(check.url, { timeout: 10000 }); //10 secs
      responseTime = Date.now() - startTime;
      newStatus = "Up";
      statusCode = response.status;
      console.log(
        `  -> SUCCESS: ${check.name} (${check.url}) - Status: ${statusCode}, Time: ${responseTime}ms`
      );
    } catch (error) {
      responseTime = Date.now() - startTime;
      newStatus = "Down";

      if (error.response) {
        // response from server(404, 500, ..)
        statusCode = error.response.status;
      } else {
        // network error
        statusCode = null;
      }
      console.log(
        `   -> FAILED: ${check.name} (${
          check.url
        }) - Status: ${newStatus}, Code: ${statusCode || "N/A"}`
      );
    }

    // DETECT STATUS CHANGE AND SEND EMAIL
    if (newStatus === "Down" && oldStatus === "Up") {
      //user who owns this check to get their email
      const user = await UserModel.findById(check.user_id);
      if (user) {
        await MailService.sentDownAlert(user.email, check);
      }
    }

    // a log entry with the result
    await LogModel.create({
      check_id: check.check_id,
      status: newStatus,
      statusCode,
      responseTime,
    });

    // check's current status in the main table
    await CheckModel.updateStatus(check.check_id, newStatus);
  }
}

module.exports = MonitoringEngine;
