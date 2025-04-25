// Define the Vega-Lite specification for a dashboard with user ID dropdown selection
const spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  // Parameters to make user ID dynamic via dropdown bound to #controls
  "params": [
    {
      "name": "selected_id",
      "value": 5577150313,
      "bind": {
        "element": "#controls", // Dropdown container
        "input": "select",
        "options": [
          5577150313, 8053475328, 2022484408, 5553957443
        ],
        "labels": [
          "User 1 (ID: 5577150313)", "User 2 (ID: 8053475328)",
          "User 3 (ID: 2022484408)", "User 4 (ID: 5553957443)"
        ]
      }
    }

  ],
  // Vertically stacked chart sections
  "vconcat": [
    {
      // === Metric Summary Boxes ===
      "title": {
        // "text": "Top Health Enthusiast Dashboard",
        "fontSize": 22,
        "fontWeight": "bold",
        "subtitle": "Based on selected user's last 31 days of activity"
      },
      "hconcat": [
        // Average Steps
        {
          "title": "Avg Steps",
          "width": 180,
          "height": 100,
          "layer": [
            {
              "data": {"values": [{}]},
              "mark": {
                "type": "rect",
                "color": "#dcfce7",
                "cornerRadius": 12
              }
            },
            {
              "data": {"url": "daily_top10_clean.json"},
              "transform": [
                {"filter": "datum.Id == selected_id"},
                {"aggregate": [{"op": "mean", "field": "TotalSteps", "as": "avg_steps"}]}
              ],
              "mark": {
                "type": "text",
                "fontSize": 32,
                "fontWeight": "bold",
                "color": "#16a34a",
                "align": "center",
                "baseline": "middle"
              },
              "encoding": {
                "text": {"field": "avg_steps", "type": "quantitative", "format": ",.0f"}
              }
            }
          ]
        },
        // Average Calories
        {
          "title": "Avg Calories",
          "width": 180,
          "height": 100,
          "layer": [
            {
              "data": {"values": [{}]},
              "mark": {
                "type": "rect",
                "color": "#ffe8d6",
                "cornerRadius": 12
              }
            },
            {
              "data": {"url": "daily_top10_clean.json"},
              "transform": [
                {"filter": "datum.Id == selected_id"},
                {"aggregate": [{"op": "mean", "field": "Calories", "as": "avg_cal"}]}
              ],
              "mark": {
                "type": "text",
                "fontSize": 32,
                "fontWeight": "bold",
                "color": "#fb923c",
                "align": "center",
                "baseline": "middle"
              },
              "encoding": {
                "text": {"field": "avg_cal", "type": "quantitative", "format": ",.0f"}
              }
            }
          ]
        }
      ]
    },
    // === Heatmap & Radial Steps Chart ===
    {
      "columns": 5,
      "concat": [
        // Daily Activity Intensity Heatmap
      {
        "title": {
          "text": "Daily Activity Intensity Heatmap",
          "fontSize": 16,
          "anchor": "middle"
        },
        "width": 600,
        "height": 180,
        "data": {"url": "daily_top10_clean.json"},
        "transform": [
          {"filter": "datum.Id == selected_id"},
          {
            "fold": [
              "LightlyActiveMinutes",
              "FairlyActiveMinutes",
              "VeryActiveMinutes"
            ],
            "as": ["ActivityType", "Minutes"]
          },
          {
            "calculate": "indexof(['LightlyActiveMinutes','FairlyActiveMinutes','VeryActiveMinutes'], datum.ActivityType)",
            "as": "ActivityOrder"
          }
        ],
        "mark": {
          "type": "rect",
          "cornerRadius": 5,
          "stroke": "#fff",
          "strokeWidth": 1
        },
        "encoding": {
          "x": {
            "field": "Date",
            "type": "ordinal",
            "timeUnit": "yearmonthdate",
            "title": "Date",
            "axis": {"labelAngle": -45, "format": "%b %d"}
          },
          "y": {
            "field": "ActivityType",
            "type": "nominal",
            "title": "Activity Level",
            "sort": {"field": "ActivityOrder", "order": "descending"},
            "axis": {"titleFontWeight": "bold"}
          },
          "color": {
            "field": "Minutes",
            "type": "quantitative",
            "title": "Minutes",
            "scale": {"scheme": "viridis"}
          },
          "tooltip": [
            {"field": "Date", "type": "temporal", "title": "Date"},
            {"field": "ActivityType", "type": "nominal", "title": "Activity"},
            {"field": "Minutes", "type": "quantitative", "title": "Minutes"}
          ]
        }
      },
      // Radial Chart: Steps Per Day of Month
      {
        "title": {"text": "Monthly Activity Radial Chart (Steps)", "anchor": "middle"},
        "width": 400,
        "height": 400,
        "data": {"url": "daily_top10_clean.json"},
        "transform": [
          {"filter": "datum.Id == selected_id"},
          {"calculate": "date(datum.Date)", "as": "DayOfMonth"},
          {"calculate": "datum.TotalSteps", "as": "Steps"}
        ],
        "mark": {
          "type": "arc",
          "innerRadius": 70,
          "stroke": "#ffffff",
          "strokeWidth": 1
        },
        "encoding": {
          "theta": {
            "field": "DayOfMonth",
            "type": "ordinal",
            "sort": "ascending",
            "title": "Day of Month"
          },
          "color": {
            "field": "Steps",
            "type": "quantitative",
            "scale": {
              "domain": [0, 5000, 10000, 15000, 20000, 25000],
              "range": ["#e0f2f1", "#80cbc4", "#26a69a", "#00897b", "#00695c", "#004d40"]
            },
            "legend": {"title": "Steps"}
          },
          "tooltip": [
            {"field": "Date", "type": "temporal", "title": "Date"},
            {"field": "Steps", "type": "quantitative", "title": "Total Steps"}
          ]
        }
      }
      
    ],
    "resolve": {"scale": {"color": "independent"}},
    "config": {
      "view": {"stroke": "transparent"},
      "axis": {"domainColor": "#bbb", "gridColor": "#eee"},
      "font": "Segoe UI, Helvetica, Arial"
    }
    
    
    },
    // === Daily Distance & Calories Burned Area Charts ===
    {
      "hconcat": [ 
        {
          "title": {"text": "Daily Total Distance", "fontSize": 16, "anchor": "middle"},
          "width": 600,
          "height": 250,
          "data": {"url": "daily_top10_clean.json"},
          "transform": [{"filter": "datum.Id == selected_id"}],
          "mark": {
            "type": "area",
            "color": "#c1ff33",
            "opacity": 0.7,
            "line": {"color": "green"}
          },
          "encoding": {
            "x": {
              "field": "Date",
              "type": "temporal",
              "title": "Date",
              "axis": {"format": "%b %d", "labelAngle": -45}
            },
            "y": {
              "field": "TotalDistance",
              "type": "quantitative",
              "title": "Distance (km)"
            },
            "tooltip": [
              {"field": "Date", "type": "temporal", "title": "Date"},
              {"field": "TotalDistance", "type": "quantitative", "title": "Distance (km)"}
            ]
          }
        },
        {
          "title": {"text": "Daily Calories Burnt", "fontSize": 16, "anchor": "middle"},
          "width": 600,
          "height": 250,
          "data": {"url": "daily_top10_clean.json"},
          "transform": [{"filter": "datum.Id == selected_id"}],
          "mark": {
            "type": "area",
            "color": "#ff9033",
            "opacity": 0.7,
            "line": {"color": "red"}
          },
          "encoding": {
            "x": {
              "field": "Date",
              "type": "temporal",
              "title": "Date",
              "axis": {"format": "%b %d", "labelAngle": -45}
            },
            "y": {
              "field": "Calories",
              "type": "quantitative",
              "title": "Calories (cal)"
            },
            "tooltip": [
              {"field": "Date", "type": "temporal", "title": "Date"},
              {"field": "Calories", "type": "quantitative", "title": "Calories (cal)"}
            ]
          }
        } 
      ]
    },
    // === Moderate Activity, Sedentary Time & Sleep Comparison ===
    {
      "hconcat": [
        {
          "title": "Moderately Active Distance",
          "width": 270,
          "height": 250,
          "data": {"url": "daily_top10_clean.json"},
          "transform": [{"filter": "datum.Id == selected_id"}],
          "mark": {
            "type": "line",
            "color": "#66bb6a",
            "strokeWidth": 2
          },
          "encoding": {
            "x": {"field": "Date", "type": "temporal", "title": "Date"},
            "y": {"field": "ModeratelyActiveDistance", "type": "quantitative", "title": "Distance (km)"},
            "tooltip": [
              {"field": "Date", "type": "temporal", "title": "Date"},
              {"field": "ModeratelyActiveDistance", "type": "quantitative", "title": "Moderate Distance"}
            ]
          }
        },
        {
          "title": "Sedentary Minutes",
          "width": 270,
          "height": 250,
          "data": {"url": "daily_top10_clean.json"},
          "transform": [{"filter": "datum.Id == selected_id"}],
          "mark": {
            "type": "bar",
            "color": "#90caf9"
          },
          "encoding": {
            "x": {"field": "Date", "type": "temporal", "title": "Date"},
            "y": {"field": "SedentaryMinutes", "type": "quantitative", "title": "Minutes"},
            "tooltip": [
              {"field": "Date", "type": "temporal", "title": "Date"},
              {"field": "SedentaryMinutes", "type": "quantitative", "title": "Sedentary Minutes"}
            ]
          }
        },
        {
          "title": {
            "text": "Time in Bed vs Minutes Asleep",
            "fontSize": 16,
            "anchor": "middle"
          },
          "width": 600,
          "height": 250,
          "data": {"url": "daily_top10_clean.json"},
          "transform": [
            {"filter": "datum.Id == selected_id"}
          ],
          "layer": [
            {
              "mark": {
                "type": "area",
                "color": "#ffccbc",
                "opacity": 0.6
              },
              "encoding": {
                "x": {
                  "field": "Date",
                  "type": "temporal",
                  "title": "Date",
                  "axis": {"labelAngle": -45}
                },
                "y": {
                  "field": "TotalTimeInBed",
                  "type": "quantitative",
                  "title": "Minutes"
                },
                "tooltip": [
                  {"field": "Date", "type": "temporal", "title": "Date"},
                  {"field": "TotalTimeInBed", "type": "quantitative", "title": "Time in Bed"}
                ]
              }
            },
            {
              "mark": {
                "type": "area",
                "color": "#ce93d8",
                "opacity": 0.8
              },
              "encoding": {
                "x": {
                  "field": "Date",
                  "type": "temporal"
                },
                "y": {
                  "field": "TotalMinutesAsleep",
                  "type": "quantitative"
                },
                "tooltip": [
                  {"field": "Date", "type": "temporal", "title": "Date"},
                  {"field": "TotalMinutesAsleep", "type": "quantitative", "title": "Minutes Asleep"}
                ]
              }
            }
          ]
        }
      ]
    }
  ],
  // Independent color scales for each chart
  "resolve": {
    "scale": {"color": "independent"}
  },
  // Global configuration
  "config": {
    "view": {"stroke": "transparent"},
    "axis": {"domainColor": "#bbb", "gridColor": "#eee"},
    "font": "Segoe UI, Helvetica, Arial"
  }
};
// Render the dashboard in a DOM element with id="vis"
vegaEmbed("#vis", spec);