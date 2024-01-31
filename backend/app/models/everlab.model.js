"use strict";

const sql = require("./db.js");

// constructor
const Diagnostic = function (diagnostic) {};

// getMetrics() : fetch metrics data from MySQL
Diagnostic.getMetrics = async() => {
  const query = "SELECT * FROM diagnostic_metrics";
  let metrics = await new Promise((resolve, reject) => {
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
  return metrics;
}

// analyse() : return obx recognition data
Diagnostic.analyse = async (patient, result) => {
  try {
    let metrics_data = [];
    let conditions_data = [];
    let metrics = await Diagnostic.getMetrics();

    const lines = patient.oru_data.split("\n");

    // Check each OBX data, whether it has match.
    for( let i = 0; i < lines.length; i++)
    {
      const line = lines[i];
      const obx_data_list = line.split("|");
      const obx_id = obx_data_list[3] || "";
      const obx_id_list = obx_id.split("^");
      const obx_sonic_code = obx_id_list[1];
      let confirmed_metric;

      metrics.some((metric) => {
        if (metric.oru_sonic_codes) {
          metric.oru_sonic_codes.split(";").some((sonic_code) => {
            if (obx_sonic_code && obx_sonic_code == sonic_code) {
              confirmed_metric = metric;
              return true;
            }
          });
        }
        if (confirmed_metric) return true;
      });

      if (confirmed_metric) {

        // Lower and Higher validation
        let condition_data = { status: false, message: "", name: "" };
        const dia_val = Number(obx_id[5]);
        const dia_sta_lo = Number(confirmed_metric.standard_lower);
        const dia_sta_hi = Number(confirmed_metric.standard_higher);
        const dia_ever_lo = Number(confirmed_metric.everlab_lower);
        const dia_ever_hi = Number(confirmed_metric.standard_higher);
        confirmed_metric.value = dia_val;
        if (dia_val) {
          if (
            (dia_sta_lo && dia_val < dia_sta_lo) ||
            (dia_sta_hi && dia_val > dia_sta_hi)
          ) {
            condition_data.status = true;
            condition_data.message += "Standard Range Exceeds. ";
          }
          if (
            (dia_ever_lo && dia_val < dia_ever_lo) ||
            (dia_ever_hi && dia_val > dia_ever_hi)
          ) {
            condition_data.status = true;
            condition_data.message += "Everlab Range Exceeds. ";
          }
        }

        // Age validation
        const age = patient.age;
        const min_age = Number(confirmed_metric.min_age);
        const max_age = Number(confirmed_metric.max_age);
        if (!(age >= min_age && age <= max_age)) {
          condition_data.status = true;
          condition_data.message += "Age Range Exceeds. ";
        }

        // Sex validation
        const sex = patient.sex;
        const sta_sex = confirmed_metric.gender;
        if (sex && sta_sex && sta_sex != "Any" && sex[0] != sta_sex[0]) {
          condition_data.status = true;
          condition_data.message += "Sex unexpected. ";
        }

        // Condition match find
        if (condition_data.status) {
          const condition_res = await findCondition(confirmed_metric.name);
          if ( !condition_res.error) {
            condition_data.name = condition_res.data;
          }
        }
        metrics_data.push(confirmed_metric);
        conditions_data.push(condition_data);
      }
    }
    result(null, { metrics: metrics_data, conditions: conditions_data });
  } catch (error) {
    console.error("An error occurred: ", error);
    result(error, null);
  }
};

// findCondition() : Search for matching condition data.
const findCondition = async (diagnostic_metric) => {
  let result;
  let metrics = await new Promise((resolve, reject) => {
    sql.query(
      `SELECT * FROM conditions WHERE diagnostic_metrics = '${diagnostic_metric}' LIMIT 1`,
      (err, res) => {
        if (err) {
          reject({ data: null, error: err });
        } else {
          if (res.length) {
            resolve({ data: res[0].name, error: null });
          } else {
            resolve({ data: null, error: null });
          }
        }
      }
    );
  });
  return metrics;
};
module.exports = Diagnostic;
