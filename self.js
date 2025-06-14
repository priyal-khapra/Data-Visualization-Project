// Vega-Lite specification for rendering a personalized monthly dashboard
const spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json", // Vega-Lite schema
  "title": {
    // "text": "Your Personal Dashboard",
    "anchor": "start",
    "fontSize": 22,
    "fontWeight": "bold",
    "subtitle": "Based on your last 31 days of activity"
  },
  // Vertical concatenation of chart sections
  "vconcat": [
    // === AVG STEPS & CALORIES INDICATORS ===
    {
      "title": {
        // "text": "aa",
        "fontSize": 22,
        "fontWeight": "bold",
        "subtitle": "Based on selected user's last 31 days of activity"
      },
      "hconcat": [  // Display two metric boxes side by side
        {// --- Average Steps Box ---
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
            {// Aggregated average steps
              "data": {"url": "daily_top10_clean.json"},
              "transform": [
                {"filter": "datum.Id == 2022484408"},
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
        // --- Average Calories Box ---
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
                {"filter": "datum.Id == 2022484408"},
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
      ],
      "config": {
    "view": { "stroke": "transparent" },
    "title": {
      "anchor": "middle",
      "font": "Segoe UI"}}
    },
    // === ACTIVITY HEATMAP + RADIAL STEPS CHART ===
    {
      "columns": 5,
      "concat": [
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
          {"filter": "datum.Id == 2022484408"},
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
      
      // --- Radial Steps Chart Over Month ---
      {
        "title": {"text": "Monthly Activity Radial Chart (Steps)", "anchor": "middle"},
        "width": 400,
        "height": 400,
        "data": {"url": "daily_top10_clean.json"},
        "transform": [
          {"filter": "datum.Id == 2022484408"},
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
    // === AREA CHARTS FOR DISTANCE & CALORIES ===
    {
      "columns": 5,
      "concat": [ 
        // --- Total Distance Area Chart ---
        {
          "title": {"text": "Daily Total Distance", "fontSize": 16, "anchor": "middle"},
          "width": 600,
          "height": 250,
          "data": {"url": "daily_top10_clean.json"},
          "transform": [{"filter": "datum.Id == 2022484408"}],
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
          },
          "config": {
            "axis": {"domainColor": "#ccc", "gridColor": "#eee"},
            "view": {"stroke": "transparent"}
          }
        },
        // --- Calories Burned Area Chart ---
        {
          "title": {"text": "Daily Calories Burnt", "fontSize": 16, "anchor": "middle"},
          "width": 600,
          "height": 250,
          "data": {"url": "daily_top10_clean.json"},
          "transform": [{"filter": "datum.Id == 2022484408"}],
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
          },
          "config": {
            "axis": {"domainColor": "#ff9033", "gridColor": "#eee"},
            "view": {"stroke": "transparent"}
          }
        } 
        
      ]
    },
    // === MODERATE DISTANCE, SEDENTARY TIME, SLEEP TRACKING ===
    {
      "columns": 4,
      "concat": [
       // --- Moderately Active Distance Line Chart ---
        {
          "title": "Moderately Active Distance",
          "width": 270,
          "height": 250,
          "data": {"url": "daily_top10_clean.json"},
          "transform": [{"filter": "datum.Id == 2022484408"}],
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
        // --- Sedentary Minutes Bar Chart ---
        {
          "title": "Sedentary Minutes",
          "width": 270,
          "height": 250,
          "data": {"url": "daily_top10_clean.json"},
          "transform": [{"filter": "datum.Id == 2022484408"}],
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
        // --- Comparison Area Chart for Sleep vs Time in Bed ---
        {
          "title": {
            "text": "Time in Bed vs Minutes Asleep",
            "fontSize": 16,
            "anchor": "start"
          },
          "width": 600,
          "height": 250,
          "data": {"url": "daily_top10_clean.json"},
          "transform": [
            {"filter": "datum.Id == 2022484408"}
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
          ],
          "config": {
            "view": {"stroke": "transparent"},
            "axis": {"domainColor": "#bbb", "gridColor": "#eee"},
            "font": "Segoe UI, Helvetica, Arial"
          }
        }
      ]
    }
    
  ]
  
};
vegaEmbed("#vis", spec);