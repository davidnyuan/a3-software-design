$(function() {
    // Read in your data. On success, run the rest of your code
    d3.csv('data/prepped_data.csv', function(error, data) {
        var xValue = 'gdp';
        var yValue = 'life_expectancy';
        var circleR ='fertility_rate';
        var circleColor ='country';
        // var colorScale = d3.scaleOrdinal()
        //     .domain(regions)
        //     .range(d3.schemeCategory10);

        // Setting defaults
        console.log(data);
        var margin = {
                top: 40,
                right: 10,
                bottom: 10,
                left: 10
            },
            width = 960,
            height = 500,
            drawWidth = width - margin.left - margin.right,
            drawHeight = height - margin.top - margin.bottom;

            // Find the maximum GDP value for the maximum of the x Scale, and multiply it by 1.05 (to add space)
            var xMax = d3.max(data, function(d) {
                return +d[xValue];
            }) * 1.05;

            // Find the minimum GDP value for the minimum of the x Scale, and multiply it by .85 (to add space)
            var xMin = d3.min(data, function(d) {
                return +d[xValue];
            }) * 0.85;

            // Use `d3.scaleLog` to define a variable `xScale` with the appropriate domain and range
            var xScale = d3.scaleLog()
                .range([0, width])
                .domain([xMin, xMax]);

            // Find the maximum life expectance value for the maximum of the y Scale, and multiply it by 1.05 (to add space)
            var yMax = d3.max(data, function(d) {
                return +d[yValue];
            }) * 1.05;

            // Find the minimum life expectance value for the minimum of the y Scale, and multiply it by .9 (to add space)
            var yMin = d3.min(data, function(d) {
                return +d[yValue];
            }) * 0.9;

            // Use `d3.scaleLinear` to define a variable `yScale` with the appropriate domain and range
            var yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([yMin, yMax]);

            var svg = d3.select("svg").on("touchmove mousemove", moved),
                width = +svg.attr("width"),
                height = +svg.attr("height");

            var sites = data.map(function(d) { return [xScale(d[xValue]), yScale(d[yValue]), d[circleColor], d[circleR]]; });

                //make scales and then bind the data
            /console.log(sites);
            var voronoi = d3.voronoi()
                .extent([[-1, -1], [width + 1, height + 1]]);

            var polygon = svg.append("g")
                .attr("class", "polygons")
              .selectAll("path")
              .data(voronoi.polygons(sites))
              .enter().append("path")
                .call(redrawPolygon);

            var link = svg.append("g")
                .attr("class", "links")
              .selectAll("line")
              .data(voronoi.links(sites))
              .enter().append("line")
                .call(redrawLink);

            var site = svg.append("g")
                .attr("class", "sites")
              .selectAll("circle")
              .data(sites)
              .enter().append("circle")
                .attr("r", function(d){
                    return d[3];
                })
                .attr('title', function(d) {
                           return d[2];
                       })
                .call(redrawSite);

            function moved() {
              sites[0] = d3.mouse(this);
              redraw();
            }

            function redraw() {
              var diagram = voronoi(sites);
              polygon = polygon.data(diagram.polygons()).call(redrawPolygon);
              link = link.data(diagram.links()), link.exit().remove();
              link = link.enter().append("line").merge(link).call(redrawLink);
              site = site.data(sites).call(redrawSite);
            }

            function redrawPolygon(polygon) {
              polygon
                  .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });
            }

            function redrawLink(link) {
              link
                  .attr("x1", function(d) { return d.source[0]; })
                  .attr("y1", function(d) { return d.source[1]; })
                  .attr("x2", function(d) { return d.target[0]; })
                  .attr("y2", function(d) { return d.target[1]; });
            }

            function redrawSite(site) {
              site
                  .attr("cx", function(d) { return d[0]; })
                  .attr("cy", function(d) { return d[1]; });
            }
    });
});
