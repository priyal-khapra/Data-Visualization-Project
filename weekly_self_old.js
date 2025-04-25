// weekly_self.js
const WEEKLY_JSON = 'DataVisualisationProject.Weekly_consolidated.json';
const USER_ID     = 2022484408;
let weeklyData;
let dailyData = [];

fetch(WEEKLY_JSON)
  .then(res => res.json())
  .then(data => {
    weeklyData = data.filter(d => d.Id === USER_ID)
    document.getElementById('week-select')
                .addEventListener('change', renderCharts);
    renderCharts();
    fetch('DataVisualisationProject.Daily_consolidated.json')
      .then(res => res.json())
      .then(daily => {
        dailyData = daily.filter(d => d.Id === USER_ID);
        document.getElementById('week-select')
                .addEventListener('change', renderCharts);
        renderCharts();
      });
  });

function getWeekRangeData(weekEndDateStr) {
  const result = [];
  const end = new Date(weekEndDateStr);
  const start = new Date(end);
  start.setDate(end.getDate() - 6);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const isoDate = date.toISOString().split('T')[0];

    const match = dailyData.find(d => {
      const dDate = new Date(d.Date?.$date || d.Date).toISOString().split('T')[0];
      return dDate === isoDate && d.Id === USER_ID;
    });

    result.push({
      dateLabel: date.toLocaleDateString('en-US', { weekday: 'short' }),
      steps: match ? match.TotalSteps : 0,
      calories: match ? match.Calories : 0,
      distance: match ? match.TotalDistance : 0
    });
  }

  return result;
}

function renderCharts() {
  const highlightIdx = +document.getElementById('week-select').value;
  const rec = weeklyData[highlightIdx];
  const dailyDataForWeek = getWeekRangeData(rec.Date.$date);
  const weekTitle = `${dailyDataForWeek[0].dateLabel} – ${dailyDataForWeek[6].dateLabel}`;

  // 1) Steps per day (area chart)
  const dailyStepsSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    width: 300,
    height: 200,
    title: `Steps per Day (${weekTitle})`,
    data: { values: dailyDataForWeek },
    mark: { type: "area", tooltip: true, color: "#e37af4 " },
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

  // 2) Calories Heatmap
  const caloriesHeatmapSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    title: "Daily Calories Burned",
    width: 300,
    height: 200,
    data: { values: dailyDataForWeek },
    mark: "rect",
    encoding: {
      x: { field: "dateLabel", type: "ordinal", title: "Day" },
      y: { value: "Calories" },
      color: {
        field: "calories",
        type: "quantitative",
        scale: { scheme: "reds" },
        legend: { title: "Calories" }
      },
      tooltip: [
        { field: "dateLabel", type: "nominal", title: "Day" },
        { field: "calories", type: "quantitative", title: "Calories" }
      ]
    }
  };
  vegaEmbed('#chart-calories', caloriesHeatmapSpec, { actions: false });

  // 3) Distance Line Chart
  const distanceLineSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    title: "Distance Per Day (km)",
    width: 300,
    height: 200,
    data: { values: dailyDataForWeek },
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

  // 4) Sleep efficiency chart remains unchanged
  const recommended = 3360;
  const asleep = rec.TotalMinutesAsleep;
  const inBed = rec.TotalTimeInBed;
  const sleepEff = ((asleep / inBed) * 100).toFixed(1);

  const sleepChartsSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "vconcat": [
      {
        "title": {
          "text": "Time asleep",
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
              "value": Math.min(asleep, recommended),
              "display": "Time asleep",
              "percentage": Math.min(100, (asleep / recommended) * 100).toFixed(1) + "%",
              "hours": Math.floor(asleep / 60) + "h " + Math.round(asleep % 60) + "m"
            },
            {
              "type": "remaining",
              "value": Math.max(0, recommended - asleep),
              "display": "Additional sleep needed",
              "percentage": Math.max(0, 100 - (asleep / recommended) * 100).toFixed(1) + "%"
            }
          ]
        },
        "layer": [
          {
            "mark": {
              "type": "arc",
              "innerRadius": 40,
              "outerRadius": 70,
              "cornerRadius": 5
            },
            "encoding": {
              "theta": { "field": "value", "type": "quantitative", "stack": true },
              "color": {
                "field": "type",
                "type": "nominal",
                "scale": {
                  "domain": ["achieved", "remaining"],
                  "range": ["#26a69a", "#e0e0e0"]
                },
                "legend": null
              },
              "tooltip": [
                { "field": "display", "type": "nominal", "title": "Category" },
                { "field": "hours", "type": "nominal", "title": "Duration" },
                { "field": "percentage", "type": "nominal", "title": "Of Recommended" }
              ]
            }
          },
          {
            "mark": {
              "type": "text",
              "align": "center",
              "baseline": "middle",
              "fontSize": 24,
              "fontWeight": "bold",
              "color": "#00796b"
            },
            "encoding": {
              "text": { "value": Math.round(asleep / 60) }
            }
          },
          {
            "mark": {
              "type": "text",
              "align": "center",
              "baseline": "middle",
              "dy": 24,
              "fontSize": 12,
              "color": "#607d8b"
            },
            "encoding": {
              "text": { "value": "hours" }
            }
          }
        ]
      }
    ]
  };
  vegaEmbed('#chart-sleep', sleepChartsSpec, { actions: false });

  // 5) Activity minutes
  const activityData = [
    { level: 'Very Active', minutes: rec.VeryActiveMinutes, color: '#ef5350' },
    { level: 'Fairly Active', minutes: rec.FairlyActiveMinutes, color: '#ffc107' },
    { level: 'Lightly Active', minutes: rec.LightlyActiveMinutes, color: '#8bc34a' },
    { level: 'Sedentary', minutes: rec.SedentaryMinutes, color: '#90a4ae' }
  ];
  const activitySpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    width: 600, height: 200,
    data: { values: activityData },
    mark: { type: 'bar', cornerRadiusEnd: 5 },
    encoding: {
      y: { field: 'level', type: 'nominal', title: null },
      x: { field: 'minutes', type: 'quantitative', title: 'Minutes' },
      color: { field: 'color', type: 'nominal', scale: null, legend: null },
      tooltip: [
        { field: 'level', type: 'nominal' },
        { field: 'minutes', type: 'quantitative' }
      ]
    }
  };
  vegaEmbed('#chart-activity', activitySpec, { actions: false });
}
