// Updated weekly_top_performer.js with radial calorie chart and line chart for distance

const WEEKLY_JSON = 'DataVisualisationProject.Weekly_consolidated.json';
const DAILY_JSON  = 'DataVisualisationProject.Daily_consolidated.json';
const users = [1503960366, 1624580081, 1644430081, 1844505072, 1927972279, 2022484408, 2026352035];
let allWeeklyData = [];
let allDailyData = [];
// Fetch weekly data first
fetch(WEEKLY_JSON)
  .then(res => res.json())
  .then(data => {
    allWeeklyData = data;
    // Populate user selection dropdown
    users.forEach((id, idx) => {
      const opt = document.createElement('option');
      opt.value = id;
      opt.text = `User ${idx+1} (ID: ${id})`;
      document.getElementById('user-select').appendChild(opt);
    });
    // Extract unique week dates for dropdown
    const uniqueDates = [...new Set(data.map(d => d.Date.$date))];
    uniqueDates.forEach((date, i) => {
      const opt = document.createElement('option');
      opt.value = date;
      opt.text = `Week ${i+1}`;
      document.getElementById('week-select').append(opt);
    });
    // Now fetch daily data
    return fetch(DAILY_JSON);
  })
  .then(res => res.json())
  .then(data => {
    allDailyData = data;
    // Attach event listeners after data is available
    document.getElementById('user-select').addEventListener('change', renderCharts);
    document.getElementById('week-select').addEventListener('change', renderCharts);
    // Render initially with default selection
    renderCharts();
  });
/**
 * Filters and formats daily data for a given week for a user
 */
function getWeekRangeData(weekEndDateStr, userId, dailyData) {
  const result = [];
  const end = new Date(weekEndDateStr);
  const start = new Date(end);
  start.setDate(end.getDate() - 6); // Go back 6 days to get full week

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const isoDate = date.toISOString().split('T')[0];

    const match = dailyData.find(d => {
      const dDate = new Date(d.Date?.$date).toISOString().split('T')[0];
      return dDate === isoDate && d.Id === userId;
    });

    result.push({
      dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      steps: match ? match.TotalSteps : 0,
      calories: match ? match.Calories : 0,
      distance: match ? match.TotalDistance : 0
    });
  }

  return result;
}
/**
 * Renders all charts based on current user and week selection
 */
function renderCharts() {
  const weekDate = document.getElementById('week-select').value;
  const userId = +document.getElementById('user-select').value;

  const weeklyData = allWeeklyData.filter(d => d.Id == userId);
  const rec = allWeeklyData.find(d => d.Id == userId && d.Date.$date == weekDate);
  const dailyData = allDailyData.filter(d => d.Id == userId);

  const dailyWeekData = getWeekRangeData(rec.Date.$date, userId, dailyData);
  const weekTitle = `${dailyWeekData[0].dateLabel} – ${dailyWeekData[6].dateLabel}`;
  // Steps Area Chart
  const dailyStepsSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    width: 300,
    height: 200,
    title: `Steps per Day (${weekTitle})`,
    data: { values: dailyWeekData },
    mark: { type: "area", tooltip: true, color: "#ff00ff" },
    encoding: {
      x: { field: "dateLabel", type: "ordinal", title: "Date" },
      y: { field: "steps", type: "quantitative", title: "Steps" },
      tooltip: [
        { field: "dateLabel", type: "nominal", title: "Date" },
        { field: "steps", type: "quantitative", title: "Steps" }
      ]
    }
  };
  vegaEmbed('#chart-steps', dailyStepsSpec, { actions: false });

  // Calories Radial Chart
  const caloriesGoal = 14000;
  const caloriesVal = rec.Calories;

  const caloriesRadialSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": {
      "text": "Total Calories Burned",
      "anchor": "middle",
      "fontSize": 16,
      "fontWeight": "bold",
      "color": "#37474f"
    },
    "width": 180,
    "height": 180,
    "data": {
      "values": [
        {
          "type": "achieved",
          "value": Math.min(caloriesVal, caloriesGoal),
          "label": "Burned",
          "percentage": Math.min(100, (caloriesVal / caloriesGoal) * 100).toFixed(1) + "%",
          "kcal": caloriesVal.toLocaleString() + " kcal"
        },
        {
          "type": "remaining",
          "value": Math.max(0, caloriesGoal - caloriesVal),
          "label": "To Goal",
          "percentage": Math.max(0, 100 - (caloriesVal / caloriesGoal) * 100).toFixed(1) + "%"
        }
      ]
    },
    "layer": [
      {
        "mark": { "type": "arc", "innerRadius": 40, "outerRadius": 70, "cornerRadius": 5 },
        "encoding": {
          "theta": { "field": "value", "type": "quantitative", "stack": true },
          "color": {
            "field": "type",
            "type": "nominal",
            "scale": { "domain": ["achieved", "remaining"], "range": ["#ff7043", "#e0e0e0"] },
            "legend": null
          },
          "tooltip": [
            { "field": "label", "type": "nominal", "title": "Type" },
            { "field": "kcal", "type": "nominal", "title": "Calories" },
            { "field": "percentage", "type": "nominal", "title": "Of Goal" }
          ]
        }
      },
      {
        "mark": { "type": "text", "align": "center", "baseline": "middle", "fontSize": 20, "fontWeight": "bold", "color": "#bf360c" },
        "encoding": { "text": { "value": Math.round(caloriesVal).toLocaleString() } }
      },
      {
        "mark": { "type": "text", "align": "center", "baseline": "middle", "dy": 24, "fontSize": 12, "color": "#616161" },
        "encoding": { "text": { "value": "calories" } }
      }
    ]
  };
  vegaEmbed('#chart-calories', caloriesRadialSpec, { actions: false });

  // Distance Line Chart
  const distanceLineSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    title: "Distance Per Day (km)",
    width: 300,
    height: 200,
    data: { values: dailyWeekData },
    mark: { type: "line", point: true },
    encoding: {
      x: { field: "dateLabel", type: "ordinal", title: "Day" },
      y: { field: "distance", type: "quantitative", title: "Distance (km)", format: ".1f" },
      tooltip: [
        { field: "dateLabel", type: "nominal", title: "Day" },
        { field: "distance", type: "quantitative", title: "Distance (km)" }
      ]
    }
  };
  vegaEmbed('#chart-distance', distanceLineSpec, { actions: false });

  // Sleep donut chart remains unchanged
  const recommended = 3360; // 8 hours * 60 * 7
  const asleep = rec.TotalMinutesAsleep;
  const inBed = rec.TotalTimeInBed;
  const sleepEff = ((asleep / inBed) * 100).toFixed(1);

  const sleepChartsSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "vconcat": [
      {
        "title": { "text": "Time asleep", "anchor": "middle", "fontSize": 16, "fontWeight": "bold", "color": "#37474f" },
        "width": 180,
        "height": 180,
        "data": {
          "values": [
            { "type": "achieved", "value": Math.min(asleep, recommended), "display": "Time asleep", "percentage": Math.min(100, (asleep / recommended) * 100).toFixed(1) + "%", "hours": Math.floor(asleep / 60) + "h " + Math.round(asleep % 60) + "m" },
            { "type": "remaining", "value": Math.max(0, recommended - asleep), "display": "Additional sleep needed", "percentage": Math.max(0, 100 - (asleep / recommended) * 100).toFixed(1) + "%" }
          ]
        },
        "layer": [
          {
            "mark": { "type": "arc", "innerRadius": 40, "outerRadius": 70, "cornerRadius": 5 },
            "encoding": {
              "theta": { "field": "value", "type": "quantitative", "stack": true },
              "color": { "field": "type", "type": "nominal", "scale": { "domain": ["achieved", "remaining"], "range": ["#26a69a", "#e0e0e0"] }, "legend": null },
              "tooltip": [
                { "field": "display", "type": "nominal", "title": "Category" },
                { "field": "hours", "type": "nominal", "title": "Duration" },
                { "field": "percentage", "type": "nominal", "title": "Of Recommended" }
              ]
            }
          },
          {
            "mark": { "type": "text", "align": "center", "baseline": "middle", "fontSize": 24, "fontWeight": "bold", "color": "#00796b" },
            "encoding": { "text": { "value": Math.round(asleep / 60) } }
          },
          {
            "mark": { "type": "text", "align": "center", "baseline": "middle", "dy": 24, "fontSize": 12, "color": "#607d8b" },
            "encoding": { "text": { "value": "hours" } }
          }
        ]
      }
    ]
  };
  vegaEmbed('#chart-sleep', sleepChartsSpec, { actions: false });
  // Activity Intensity Bar Chart
  const activityData = [
    { level:'Very Active', minutes: rec.VeryActiveMinutes, color:'#ef5350' },
    { level:'Fairly Active', minutes: rec.FairlyActiveMinutes, color:'#ffc107' },
    { level:'Lightly Active', minutes: rec.LightlyActiveMinutes, color:'#8bc34a' },
    { level:'Sedentary', minutes: rec.SedentaryMinutes, color:'#90a4ae' }
  ];
  const activitySpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    width: 600, height: 200,
    data: { values: activityData },
    mark: { type: 'bar', cornerRadiusEnd: 5 },
    encoding: {
      y: { field:'level', type:'nominal', title:null },
      x: { field:'minutes', type:'quantitative', title:'Minutes' },
      color: { field:'color', type:'nominal', scale:null, legend:null },
      tooltip: [
        { field:'level', type:'nominal' },
        { field:'minutes', type:'quantitative' }
      ]
    }
  };
  vegaEmbed('#chart-activity', activitySpec, { actions: false });
}
