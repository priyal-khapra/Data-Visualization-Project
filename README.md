 The Unified Health Dashboard doesn’t just show your data — it motivates you by letting you compare your health metrics with top performers. 
 Our dashboard is divided into two powerful modules:
	• The Personal Dashboard, to help users track and reflect on their own health over time — daily, weekly, and monthly. (visualisation files: daily_self.js, weekly_self2.js, self.js respectively) 
	• And the Top Performer Dashboard, which introduces a motivational element by showing how the best performers are doing in the same categories. (visualisation files: daily_top_performer.js, week_top_performer2.js, top_performer.js) 
 We  hosted this enriched dataset on a MongoDB live server, which provides JSON output compatible with our visualization library — Vega-Lite. We’ve added custom tooltips, independent color scales, and used responsive SVG rendering to ensure that the dashboard looks good and works smoothly on any device. It’s built using vegaEmbed, which makes integration seamless and performance efficient.


