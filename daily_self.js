// Sample data representing the user with ID 2022484408
const userData = [
  // Array of objects, each representing a day's health metrics
  {
    "Date": "2016-04-12",
    "Calories": 2390,
    "TotalSteps": 11875,
    "TotalDistance": 8.34,
    "TotalMinutesAsleep": 163.86,
    "TotalTimeInBed": 184.50,
    "SedentaryMinutes": 1157,
    "LightlyActiveMinutes": 227,
    "FairlyActiveMinutes": 14,
    "VeryActiveMinutes": 42
  },
  {
    "Date": "2016-04-13",
    "Calories": 2601,
    "TotalSteps": 12024,
    "TotalDistance": 8.50,
    "TotalMinutesAsleep": 179.98,
    "TotalTimeInBed": 185.71,
    "SedentaryMinutes": 1100,
    "LightlyActiveMinutes": 292,
    "FairlyActiveMinutes": 5,
    "VeryActiveMinutes": 43
  },
  {
    "Date": "2016-04-14",
    "Calories": 2312,
    "TotalSteps": 10690,
    "TotalDistance": 7.50,
    "TotalMinutesAsleep": 164.89,
    "TotalTimeInBed": 178.04,
    "SedentaryMinutes": 1148,
    "LightlyActiveMinutes": 257,
    "FairlyActiveMinutes": 3,
    "VeryActiveMinutes": 32
  },
  {
    "Date": "2016-04-15",
    "Calories": 2525,
    "TotalSteps": 11034,
    "TotalDistance": 8.03,
    "TotalMinutesAsleep": 150.20,
    "TotalTimeInBed": 166.50,
    "SedentaryMinutes": 1122,
    "LightlyActiveMinutes": 282,
    "FairlyActiveMinutes": 9,
    "VeryActiveMinutes": 27
  }
];

// Function to create the dashboard
function createDashboard(selectedDate) {
  // Find the user data for selected date
  const userDataForDate = userData.find(d => d.Date === selectedDate);
  // If no data is found for the selected date, exit
  if (!userDataForDate) {
    console.error('No data found for selected date');
    return;
  }
  
  // Format date for display - human readable format
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Create step progress donut chart
  const stepProgressSpec = {
    // Vega-Lite schema and chart configuration
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": {
      "text": "Daily Step Goal Progress (Optimum number of steps: 10,000)",
      "anchor": "middle",
      "fontSize": 16,
      "fontWeight": "bold",
      "color": "#37474f"
    },
    "width": 350,
    "height": 350,
    "data": {
      "values": [
        {"type": "achieved", "value": Math.min(userDataForDate.TotalSteps, 10000), "display": "Steps taken", "percentage": Math.min(100, (userDataForDate.TotalSteps / 10000) * 100).toFixed(1) + "%"},
        {"type": "remaining", "value": Math.max(0, 10000 - userDataForDate.TotalSteps), "display": "Steps remaining", "percentage": Math.max(0, 100 - (userDataForDate.TotalSteps / 10000) * 100).toFixed(1) + "%"}
      ]
    },
    "layer": [
      {
        "mark": {
          "type": "arc",
          "innerRadius": 70,
          "outerRadius": 140,
          "cornerRadius": 5,
          "tooltip": true
        },
        "encoding": {
          "theta": {"field": "value", "type": "quantitative", "stack": true},
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
            {"field": "display", "type": "nominal", "title": "Category"},
            {"field": "value", "type": "quantitative", "title": "Steps", "format": ","},
            {"field": "percentage", "type": "nominal", "title": "Of Goal"}
          ]
        }
      },
      {
        "mark": {
          "type": "text",
          "align": "center",
          "baseline": "middle",
          "fontSize": 28,
          "fontWeight": "bold",
          "color": "#00796b"
        },
        "encoding": {
          "text": {"value": userDataForDate.TotalSteps.toLocaleString()}
        }
      },
      {
        "mark": {
          "type": "text",
          "align": "center",
          "baseline": "middle",
          "dy": 30,
          "fontSize": 14,
          "color": "#607d8b"
        },
        "encoding": {
          "text": {"value": "steps"}
        }
      }
    ]
  };
  
  // Metrics summary view for calories, distance, and sleep
  const metricsSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "vconcat": [
      {
        "title": "Calories",
        "width": 150,
        "height": 60,
        "data": {
          "values": [{"value": userDataForDate.Calories, "detail": "Total calories burned on " + formattedDate}]
        },
        "layer": [
          {
            "mark": {
              "type": "text",
              "fontSize": 28,
              "fontWeight": "bold",
              "color": "#ef6c00",
              "align": "center"
            },
            "encoding": {
              "text": {"field": "value", "type": "quantitative", "format": ","},
              "tooltip": {"field": "detail", "type": "nominal"}
            }
          },
          {
            "mark": {"type": "rect", "fillOpacity": 0, "stroke": "#ccc", "strokeOpacity": 0},
            "encoding": {
              "tooltip": {"field": "detail", "type": "nominal"}
            }
          }
        ]
      },
      {
        "title": "Distance (km)",
        "width": 150,
        "height": 60,
        "data": {
          "values": [{"value": userDataForDate.TotalDistance, "detail": "Total distance covered: " + userDataForDate.TotalDistance.toFixed(1) + " km on " + formattedDate}]
        },
        "layer": [
          {
            "mark": {
              "type": "text",
              "fontSize": 28,
              "fontWeight": "bold",
              "color": "#2e7d32",
              "align": "center"
            },
            "encoding": {
              "text": {"field": "value", "type": "quantitative", "format": ".1f"},
              "tooltip": {"field": "detail", "type": "nominal"}
            }
          },
          {
            "mark": {"type": "rect", "fillOpacity": 0, "stroke": "#ccc", "strokeOpacity": 0},
            "encoding": {
              "tooltip": {"field": "detail", "type": "nominal"}
            }
          }
        ]
      },
      {
        "title": "Sleep (min)",
        "width": 150,
        "height": 60,
        "data": {
          "values": [{"value": userDataForDate.TotalMinutesAsleep, "detail": "Total sleep time: " + Math.floor(userDataForDate.TotalMinutesAsleep / 60) + "h " + Math.round(userDataForDate.TotalMinutesAsleep % 60) + "m on " + formattedDate}]
        },
        "layer": [
          {
            "mark": {
              "type": "text",
              "fontSize": 28,
              "fontWeight": "bold",
              "color": "#5e35b1",
              "align": "center"
            },
            "encoding": {
              "text": {"field": "value", "type": "quantitative", "format": ".0f"},
              "tooltip": {"field": "detail", "type": "nominal"}
            }
          },
          {
            "mark": {"type": "rect", "fillOpacity": 0, "stroke": "#ccc", "strokeOpacity": 0},
            "encoding": {
              "tooltip": {"field": "detail", "type": "nominal"}
            }
          }
        ]
      }
    ]
  };
  
  // Calculate sleep efficiency (as a percentage of time asleep while in bed)
  const sleepEfficiency = ((userDataForDate.TotalMinutesAsleep / userDataForDate.TotalTimeInBed) * 100).toFixed(1);
  
  // Donut charts to visualize time asleep vs. recommendation and time in bed
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
              "value": Math.min(userDataForDate.TotalMinutesAsleep, 480), 
              "display": "Time asleep", 
              "percentage": Math.min(100, (userDataForDate.TotalMinutesAsleep / 480) * 100).toFixed(1) + "%",
              "hours": Math.floor(userDataForDate.TotalMinutesAsleep / 60) + "h " + Math.round(userDataForDate.TotalMinutesAsleep % 60) + "m"
            },
            {
              "type": "remaining", 
              "value": Math.max(0, 480 - userDataForDate.TotalMinutesAsleep), 
              "display": "Recommended additional sleep", 
              "percentage": Math.max(0, 100 - (userDataForDate.TotalMinutesAsleep / 480) * 100).toFixed(1) + "%"
            }
          ]
        },
        "layer": [
          {
            "mark": {
              "type": "arc",
              "innerRadius": 40,
              "outerRadius": 70,
              "cornerRadius": 5,
              "tooltip": true
            },
            "encoding": {
              "theta": {"field": "value", "type": "quantitative", "stack": true},
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
                {"field": "display", "type": "nominal", "title": "Category"},
                {"field": "hours", "type": "nominal", "title": "Duration"},
                {"field": "percentage", "type": "nominal", "title": "Of Recommended"}
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
              "text": {"value": Math.round(userDataForDate.TotalMinutesAsleep)}
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
              "text": {"value": "minutes"}
            }
          }
        ]
      },
      {
        "title": {
          "text": "Time in bed",
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
              "value": Math.min(userDataForDate.TotalTimeInBed, 480), 
              "display": "Time in bed", 
              "hours": Math.floor(userDataForDate.TotalTimeInBed / 60) + "h " + Math.round(userDataForDate.TotalTimeInBed % 60) + "m",
              "efficiency": "Sleep efficiency: " + sleepEfficiency + "%"
            },
            {
              "type": "remaining", 
              "value": Math.max(0, 480 - userDataForDate.TotalTimeInBed), 
              "display": "Recommended additional rest time"
            }
          ]
        },
        "layer": [
          {
            "mark": {
              "type": "arc",
              "innerRadius": 40,
              "outerRadius": 70,
              "cornerRadius": 5,
              "tooltip": true
            },
            "encoding": {
              "theta": {"field": "value", "type": "quantitative", "stack": true},
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
                {"field": "display", "type": "nominal", "title": "Category"},
                {"field": "hours", "type": "nominal", "title": "Duration"},
                {"field": "efficiency", "type": "nominal", "title": "Note"}
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
              "text": {"value": Math.round(userDataForDate.TotalTimeInBed)}
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
              "text": {"value": "Minutes"}
            }
          }
        ]
      }
    ]
  };
  
  // Helper function to return description, color and percentage info for each activity intensity
  const getActivityDescription = (minutes, type) => {
    let intensity = "";
    let color = "";
    let percentage = (minutes / 1440 * 100).toFixed(1);
    
    switch(type) {
      case "VeryActiveMinutes":
        intensity = "Very Active";
        color = "#ef5350";
        break;
      case "FairlyActiveMinutes":
        intensity = "Fairly Active";
        color = "#ffc107";
        break;
      case "LightlyActiveMinutes":
        intensity = "Lightly Active";
        color = "#8bc34a";
        break;
      case "SedentaryMinutes":
        intensity = "Sedentary";
        color = "#90a4ae";
        break;
    }
    
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    let timeString = "";
    
    if (hours > 0) {
      timeString = `${hours}h ${mins}m`;
    } else {
      timeString = `${mins}m`;
    }
    
    return {
      "intensity": intensity,
      "timeString": timeString,
      "percentage": percentage,
      "color": color
    };
  };
  
  // Create activity minutes data with enhanced descriptions
  const activityData = [
    {
      "ActivityLevel": "VeryActiveMinutes", 
      "Minutes": userDataForDate.VeryActiveMinutes, 
      "color": "#ef5350",
      ...getActivityDescription(userDataForDate.VeryActiveMinutes, "VeryActiveMinutes")
    },
    {
      "ActivityLevel": "FairlyActiveMinutes", 
      "Minutes": userDataForDate.FairlyActiveMinutes, 
      "color": "#ffc107",
      ...getActivityDescription(userDataForDate.FairlyActiveMinutes, "FairlyActiveMinutes")
    },
    {
      "ActivityLevel": "LightlyActiveMinutes", 
      "Minutes": userDataForDate.LightlyActiveMinutes, 
      "color": "#8bc34a",
      ...getActivityDescription(userDataForDate.LightlyActiveMinutes, "LightlyActiveMinutes")
    },
    {
      "ActivityLevel": "SedentaryMinutes", 
      "Minutes": userDataForDate.SedentaryMinutes, 
      "color": "#90a4ae",
      ...getActivityDescription(userDataForDate.SedentaryMinutes, "SedentaryMinutes")
    }
  ];
  
  // Horizontal bar chart for activity intensity distribution
  const activityChartSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": {
      "text": "Activity Minutes by Intensity",
      "anchor": "middle",
      "fontSize": 16,
      "fontWeight": "bold",
      "color": "#37474f"
    },
    "width": 800,
    "height": 150,
    "data": {
      "values": activityData
    },
    "mark": {
      "type": "bar",
      "cornerRadiusEnd": 5,
      "tooltip": true
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
        "axis": {"labelFontWeight": "bold"}
      },
      "x": {
        "field": "Minutes",
        "type": "quantitative",
        "title": "Minutes",
        "axis": {"grid": false}
      },
      "tooltip": [
        {"field": "intensity", "type": "nominal", "title": "Activity Level"},
        {"field": "Minutes", "type": "quantitative", "title": "Minutes"},
        {"field": "timeString", "type": "nominal", "title": "Duration"},
        {"field": "percentage", "type": "nominal", "title": "% of Day"}
      ],
      "fill": {
        "field": "color",
        "type": "nominal",
        "scale": null
      }
    }
  };
  
  // Combine all charts into a single dashboard layout using vconcat and hconcat
  const mainSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "vconcat": [
      {
        "hconcat": [
          stepProgressSpec,
          metricsSpec,
          sleepChartsSpec
        ]
      },
      activityChartSpec
    ],
    // General chart configuration
    "config": {
      "view": {"stroke": "transparent"},
      "axis": {"domainColor": "#ccc", "tickColor": "#ccc"}
    }
  };
  
  // Render the dashboard with hover capabilities // Render the dashboard using Vega-Embed
  vegaEmbed('#dashboard', mainSpec, {
    renderer: 'svg',
    actions: false,
    tooltip: {
      theme: 'custom', 
      style: {
        'background-color': 'white',
        'border': '1px solid #ddd',
        'border-radius': '4px',
        'padding': '10px',
        'box-shadow': '2px 2px 6px rgba(0, 0, 0, 0.1)'
      }
    }
  }).then(function(result) {
    // Apply direct color override using SVG manipulation
    setTimeout(function() {
      const bars = document.querySelectorAll('.mark-bar path');
      if (bars.length >= 4) {
        // VeryActiveMinutes
        bars[0].setAttribute('fill', '#ef5350');
        // FairlyActiveMinutes
        bars[1].setAttribute('fill', '#ffc107');
        // LightlyActiveMinutes
        bars[2].setAttribute('fill', '#8bc34a');
        // SedentaryMinutes
        bars[3].setAttribute('fill', '#90a4ae');
        
        // Add hover effect to all chart elements
        const allChartElements = document.querySelectorAll('path, rect');
        allChartElements.forEach(element => {
          if (!element.hasAttribute('hover-added')) {
            element.setAttribute('hover-added', 'true');
            element.style.transition = 'opacity 0.2s ease-in-out, stroke-width 0.2s ease-in-out';
            
            element.addEventListener('mouseenter', function() {
              element.style.opacity = '0.8';
              if (element.hasAttribute('stroke')) {
                element.setAttribute('data-original-stroke-width', element.getAttribute('stroke-width') || '1');
                element.setAttribute('stroke-width', '2');
              }
            });
            
            element.addEventListener('mouseleave', function() {
              element.style.opacity = '1';
              if (element.hasAttribute('stroke') && element.hasAttribute('data-original-stroke-width')) {
                element.setAttribute('stroke-width', element.getAttribute('data-original-stroke-width'));
              }
            });
          }
        });
      }
    }, 200);
  });
}

// Initialize dashboard with default date
createDashboard('2016-04-12');

// Update dashboard when date selection changes
document.getElementById('date-select').addEventListener('change', function() {
  createDashboard(this.value);
});

// Add custom CSS styles for Vega tooltips directly into the page
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .vg-tooltip {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
      pointer-events: none;
      z-index: 1000;
    }
    
    .vg-tooltip td.key {
      font-weight: bold;
      color: #37474f;
      padding-right: 10px;
    }
    
    .vg-tooltip td.value {
      color: #607d8b;
    }
    
    /* Hover styles for chart elements */
    .mark-arc path:hover,
    .mark-bar path:hover {
      opacity: 0.8;
      cursor: pointer;
    }
  </style>
`);