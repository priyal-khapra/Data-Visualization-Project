const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "params": [
      {
        "name": "selected_id",
        "value": 5577150313,
        "bind": {
          "element": "#controls",
          "input": "select",
          "options":  [
            5577150313, 8053475328, 2022484408, 5553957443
          ],
          "labels": [
          "User 1 (ID: 5577150313)", "User 2 (ID: 8053475328)",
          "User 3 (ID: 2022484408)", "User 4 (ID: 5553957443)"
        ]
        }
      } ,
      
      {
        "name": "selected_date",
        "value": "2016-04-12T00:00:00.000Z",
        "bind": {
          "element": "#controls",
          "input": "select",
          "options": [
            "2016-04-12T00:00:00.000Z", "2016-04-13T00:00:00.000Z", "2016-04-14T00:00:00.000Z", "2016-04-15T00:00:00.000Z"
          ],
          "labels": [
            "Day 1 2016-04-12", "Day 2 2016-04-13",
            "Day 3 2016-04-14", "Day 4 2016-04-15"
          ]
        }
      }
    ],
    "vconcat": [
        {
          "columns": 4,
          "concat": [
            {
                "title": {
                  "text": "Daily Step Goal Progress (Optimium number of steps: 10,000)",
                  "anchor": "middle",
                  "fontSize": 16,
                  "fontWeight": "bold",
                  "color": "#37474f"
                },
                "width": 450,
                "height": 450,
                "data": {
                  "url": "daily_top10_clean.json"
                },
                "transform": [
                  { "filter": "datum.Id == selected_id && datum.Date == selected_date" },
                  {
                    "calculate": "min(datum.TotalSteps, 10000)",
                    "as": "achieved"
                  },
                  {
                    "calculate": "10000 - datum.achieved",
                    "as": "remaining"
                  },
                  {
                    "fold": ["achieved", "remaining"],
                    "as": ["type", "value"]
                  }
                ],
                "layer": [
                  {
                    "mark": {
                      "type": "arc",
                      "innerRadius": 80,
                      "outerRadius": 150,
                      "cornerRadius": 5
                    },
                    "encoding": {
                      "theta": { "field": "value", "type": "quantitative" },
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
                        { "field": "type", "type": "nominal", "title": "Segment" },
                        { "field": "value", "type": "quantitative", "title": "Steps" }
                      ]
                    }
                  },
                  {
                    "mark": {
                      "type": "text",
                      "align": "center",
                      "baseline": "middle",
                      "fontSize": 22,
                      "fontWeight": "bold",
                      "color": "#00796b"
                    },
                    "transform": [
                      { "filter": "datum.Id == selected_id && datum.Date == selected_date" }
                    ],
                    "encoding": {
                      "text": {
                        "field": "TotalSteps",
                        "type": "quantitative",
                        "format": ",.0f"
                      }
                    }
                  },
                  {
                    "mark": {
                      "type": "text",
                      "align": "center",
                      "baseline": "middle",
                      "dy": 18,
                      "fontSize": 12,
                      "color": "#607d8b"
                    },
                    "encoding": {
                      "text": { "value": "steps" }
                    }
                  }
                ],
                "config": {
                  "view": { "stroke": "transparent" },
                  "axis": { "domain": false }
                }
              }
              
              ,              
            {"vconcat" : [{
              "title": "Calories",
              "width": 140,
              "height": 100,
              "layer": [
                { "mark": { "type": "rect", "color": "#fff3e0", "cornerRadius": 8 } },
                {
                  "data": { "url": "daily_top10_clean.json" },
                  "transform": [{ "filter": "datum.Id == selected_id && datum.Date == selected_date" }],
                  "mark": {
                    "type": "text", "fontSize": 20, "fontWeight": "bold", "color": "#ef6c00",
                    "align": "center", "baseline": "middle"
                  },
                  "encoding": {
                    "text": { "field": "Calories", "type": "quantitative", "format": ",.0f" }
                  }
                }
              ]
            },
            {
              "title": "Distance (km)",
              "width": 140,
              "height": 100,
              "layer": [
                { "mark": { "type": "rect", "color": "#e8f5e9", "cornerRadius": 8 } },
                {
                  "data": { "url": "daily_top10_clean.json" },
                  "transform": [{ "filter": "datum.Id == selected_id && datum.Date == selected_date" }],
                  "mark": {
                    "type": "text", "fontSize": 20, "fontWeight": "bold", "color": "#2e7d32",
                    "align": "center", "baseline": "middle"
                  },
                  "encoding": {
                    "text": { "field": "TotalDistance", "type": "quantitative", "format": ".1f" }
                  }
                }
              ]
            },
            {
              "title": "Sleep (min)",
              "width": 140,
              "height": 100,
              "layer": [
                { "mark": { "type": "rect", "color": "#ede7f6", "cornerRadius": 8 } },
                {
                  "data": { "url": "daily_top10_clean.json" },
                  "transform": [{ "filter": "datum.Id == selected_id && datum.Date == selected_date" }],
                  "mark": {
                    "type": "text", "fontSize": 20, "fontWeight": "bold", "color": "#5e35b1",
                    "align": "center", "baseline": "middle"
                  },
                  "encoding": {
                    "text": { "field": "TotalMinutesAsleep", "type": "quantitative", "format": ",.0f" }
                  }
                }
              ]
            }]},
            {"vconcat" : [{
                "title": {
                  "text": "Time asleep",
                  "anchor": "middle",
                  "fontSize": 16,
                  "fontWeight": "bold",
                  "color": "#37474f"
                },
                "width": 200,
                "height": 200,
                "data": {
                  "url": "daily_top10_clean.json"
                },
                "transform": [
                  { "filter": "datum.Id == selected_id && datum.Date == selected_date" },
                  {
                    "calculate": "min(datum.TotalMinutesAsleep, 480)",
                    "as": "achieved"
                  },
                  {
                    "calculate": "480 - datum.achieved",
                    "as": "remaining"
                  },
                  {
                    "fold": ["achieved", "remaining"],
                    "as": ["type", "value"]
                  }
                ],
                "layer": [
                  {
                    "mark": {
                      "type": "arc",
                      "innerRadius": 40,
                      "outerRadius": 80,
                      "cornerRadius": 5
                    },
                    "encoding": {
                      "theta": { "field": "value", "type": "quantitative" },
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
                        { "field": "type", "type": "nominal", "title": "Segment" },
                        { "field": "value", "type": "quantitative", "title": "Minutes" }
                      ]
                    }
                  },
                  {
                    "mark": {
                      "type": "text",
                      "align": "center",
                      "baseline": "middle",
                      "fontSize": 22,
                      "fontWeight": "bold",
                      "color": "#00796b"
                    },
                    "transform": [
                      { "filter": "datum.Id == selected_id && datum.Date == selected_date" }
                    ],
                    "encoding": {
                      "text": {
                        "field": "TotalMinutesAsleep",
                        "type": "quantitative",
                        "format": ",.0f"
                      }
                    }
                  },
                  {
                    "mark": {
                      "type": "text",
                      "align": "center",
                      "baseline": "middle",
                      "dy": 18,
                      "fontSize": 12,
                      "color": "#607d8b"
                    },
                    "encoding": {
                      "text": { "value": "minutes" }
                    }
                  }
                ],
                "config": {
                  "view": { "stroke": "transparent" },
                  "axis": { "domain": false }
                }
              },
              {
                "title": {
                  "text": "Time in bed",
                  "anchor": "middle",
                  "fontSize": 16,
                  "fontWeight": "bold",
                  "color": "#37474f"
                },
                "width": 200,
                "height": 100,
                "data": {
                  "url": "daily_top10_clean.json"
                },
                "transform": [
                  { "filter": "datum.Id == selected_id && datum.Date == selected_date" },
                  {
                    "calculate": "min(datum.TotalTimeInBed, 480)",
                    "as": "achieved"
                  },
                  {
                    "calculate": "480 - datum.achieved",
                    "as": "remaining"
                  },
                  {
                    "fold": ["achieved", "remaining"],
                    "as": ["type", "value"]
                  }
                ],
                "layer": [
                  {
                    "mark": {
                      "type": "arc",
                      "innerRadius": 40,
                      "outerRadius": 80,
                      "cornerRadius": 5
                    },
                    "encoding": {
                      "theta": { "field": "value", "type": "quantitative" },
                      "color": {
                        "field": "type",
                        "type": "nominal",
                        "scale": {
                          "domain": ["achieved", "remaining"],
                          "range": ["#ff33c7", "#e0e0e0"]
                        },
                        "legend": null
                      },
                      "tooltip": [
                        { "field": "type", "type": "nominal", "title": "Segment" },
                        { "field": "value", "type": "quantitative", "title": "Minutes" }
                      ]
                    }
                  },
                  {
                    "mark": {
                      "type": "text",
                      "align": "center",
                      "baseline": "middle",
                      "fontSize": 22,
                      "fontWeight": "bold",
                      "color": "#00796b"
                    },
                    "transform": [
                      { "filter": "datum.Id == selected_id && datum.Date == selected_date" }
                    ],
                    "encoding": {
                      "text": {
                        "field": "TotalTimeInBed",
                        "type": "quantitative",
                        "format": ",.0f"
                      }
                    }
                  },
                  {
                    "mark": {
                      "type": "text",
                      "align": "center",
                      "baseline": "middle",
                      "dy": 18,
                      "fontSize": 12,
                      "color": "#607d8b"
                    },
                    "encoding": {
                      "text": { "value": "Minutes" }
                    }
                  }
                ],
                "config": {
                  "view": { "stroke": "transparent" },
                  "axis": { "domain": false }
                }
              }  ] }
          ]
        },
        {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "title": {
              "text": "Activity Minutes by Intensity",
              "anchor": "middle",
              "fontSize": 16,
              "fontWeight": "bold",
              "color": "#37474f"
            },
            "width": 1000,
            "height": 150,
            "data": { "url": "daily_top10_clean.json" },
            "transform": [
              { "filter": "datum.Id == selected_id && datum.Date == selected_date" },
              {
                "fold": [
                  "SedentaryMinutes",
                  "LightlyActiveMinutes",
                  "FairlyActiveMinutes",
                  "VeryActiveMinutes"
                ],
                "as": ["ActivityLevel", "Minutes"]
              }
            ],
            "mark": {
              "type": "bar",
              "cornerRadiusEnd": 5
            },
            "encoding": {
              "y": {
                "field": "ActivityLevel",
                "type": "nominal",
                "sort": [
                  "VeryActiveMinutes",
                  "FairlyActiveMinutes",
                  "LightlyActiveMinutes",
                  "SedentaryMinutes"
                ],
                "title": "Intensity Level",
                "axis": { "labelFontWeight": "bold" }
              },
              "x": {
                "field": "Minutes",
                "type": "quantitative",
                "title": "Minutes",
                "axis": { "grid": false }
              },
              "color": {
                "field": "ActivityLevel",
                "type": "nominal",
                "scale": {
                  "domain": [
                    "VeryActiveMinutes",
                    "FairlyActiveMinutes",
                    "LightlyActiveMinutes",
                    "SedentaryMinutes"
                  ],
                  "range": [
                    "#ef5350",  // Red for Very Active
                    "#ffca28",  // Amber for Fairly Active
                    "#aed581",  // Light Green for Lightly Active
                    "#90a4ae"   // Gray for Sedentary
                  ]
                },
                "legend": {
                  "title": "Activity Intensity",
                  "orient": "right"
                }
              },
              "tooltip": [
                { "field": "ActivityLevel", "type": "nominal", "title": "Intensity" },
                { "field": "Minutes", "type": "quantitative", "title": "Minutes" }
              ]
            },
            "config": {
              "view": { "stroke": "transparent" },
              "axis": { "domainColor": "#ccc", "tickColor": "#ccc" }
            }
          }
          
          
          
      ],
      "resolve": {
    "scale": {
      "color": "independent"
    }
  }
    };
  
  vegaEmbed("#vis", spec);