var VoronoiChart = function() {
    // Set default values
    var height = 300,
        width = 300,
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        xTitle = 'X Axis Title',
        yTitle = 'Y Axis Title',
        title = 'Chart title',
        fill = 'green',
        radius = 3,
        margin = {
            left: 70,
            bottom: 50,
            top: 30,
            right: 10,
        };
    var dataKey ="chartG";
    var sites ;
    var chart = function(selection) {
        var chartHeight = height - margin.bottom - margin.top;
        var chartWidth = width - margin.left - margin.right;
        selection.each(function(datas) {

            var ele = d3.select(this);
            var svg = ele.selectAll("svg").data([datas]);
            var svgEnter = svg.enter()
                .append("svg")
                .attr('width', width)
                .attr("height", height);

            svgEnter.append('text')
                    .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + 20 + ')')
                    .text(title)
                    .attr('class', 'chart-title')

            // g element for markers
            var chartG = svgEnter.append('g')
                .attr('width', chartWidth)
                .attr("height", chartHeight)
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr("class", 'chartG').on("mousemove", moved);
            // Append axes to the svgEnter element
            svgEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + (chartHeight +margin.top) + ')')
                .attr('class', 'axis x');

            svgEnter.append('g')
                .attr('class', 'axis y')
                .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')

            // Add a title g for the x axis
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + (chartHeight + margin.top + 40) + ')')
                .attr('class', 'title x');

            // Add a title g for the y axis
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + chartHeight / 2) + ') rotate(-90)')
                .attr('class', 'title y');

            // Calculate x and y scales

            var xMax = d3.max(datas, function(d) {
                return +d.x;
            }) * 1.05;

            // Find the minimum GDP value for the minimum of the x Scale, and multiply it by .85 (to add space)
            var xMin = d3.min(datas, function(d) {
                return +d.x;
            }) * 0.85;

            // Use `d3.scaleLog` to define a variable `xScale` with the appropriate domain and range
            var xScale = d3.scaleLog()
                .range([0, chartWidth])
                .domain([xMin, xMax]);

            // Find the maximum life expectance value for the maximum of the y Scale, and multiply it by 1.05 (to add space)
            var yMax = d3.max(datas, function(d) {
                return +d.y;
            }) * 1.05;

            // Find the minimum life expectance value for the minimum of the y Scale, and multiply it by .9 (to add space)
            var yMin = d3.min(datas, function(d) {
                return +d.y;
            }) * 0.9;

            // Use `d3.scaleLinear` to define a variable `yScale` with the appropriate domain and range
            var yScale = d3.scaleLinear()
                .range([chartHeight, 0])
                .domain([yMin, yMax]);
                // Define xAxis and yAxis functions
            var xAxis = d3.axisBottom().tickFormat(d3.format('.2s'));
            var yAxis = d3.axisLeft().tickFormat(d3.format('.2s'));
            xAxis.scale(xScale);
            yAxis.scale(yScale);
            ele.select('.axis.x').transition().duration(1000).call(xAxis);
            ele.select('.axis.y').transition().duration(1000).call(yAxis);

            // Update titles
            ele.select('.title.x').text(xTitle);
            ele.select('.title.y').text(yTitle);

            sites = datas.map(function(d) {
                return [xScale(d.x), yScale(d.y), d.id];
            });

            //console.log(sites);
            var voronoi = d3.voronoi()
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; })
                .extent([[0, 0], [(chartWidth), (chartHeight)]]);

            var polygon = d3.select(".chartG")
                .selectAll("path").data(voronoi.polygons(sites), function(d){
                    return d[2];
                });

            polygon.enter().append("path").merge(polygon).call(redrawPolygon);

            var link = d3.select(".chartG").selectAll("line").data(voronoi.links(sites), function(d){
                return d[2];
            });
            link.enter().append("line").merge(link).call(redrawLink);

            var site = d3.select(".chartG")
                .selectAll("circle").data(sites, function(d){
                    return d[2];
                });
            site.enter().append("circle")
                .merge(site).call(redrawSite);
                polygon.exit().remove();
                site.exit().remove();
                link.exit().remove();

            function moved() {
                sites[0] = d3.mouse(this);
                redraw();
            }

            function redraw() {
                polygon =d3.select(".chartG")
                    .selectAll("path").data(voronoi.polygons(sites)).call(redrawPolygon);
                link =  d3.select('.chartG')
                    .selectAll("line").data(voronoi.links(sites), function(d){
                        return d[2];
                    });
                linkEnter = link.enter().append("line").merge(link).call(redrawLink);
                link.exit().remove();

            }

            function redrawPolygon(polygonE) {
                polygonE.attr("d", function(d) {
                     return d ? "M" + d.join("L") + "Z" : null;
                 });
            }

            function redrawLink(linkE) {
                linkE.attr("x1", function(d) { return d.source[0]; })
                    .attr("y1", function(d) { return d.source[1]; })
                    .attr("x2", function(d) { return d.target[0]; })
                    .attr("y2", function(d) { return d.target[1]; });
            }

            function redrawSite(siteE) {
                siteE.attr("cx", function(d) { return d[0]; })
                    .attr("cy", function(d) { return d[1]; })
                        .attr("r", radius);
            }

        });

    };
    // Getter/setter methods to change locally scoped options
    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.fill = function(value) {
        if (!arguments.length) return fill;
        fill = value;
        return chart;
    };

    chart.xTitle = function(value) {
        if (!arguments.length) return xTitle;
        xTitle = value;
        return chart;
    };
    chart.title = function(value) {
        if (!arguments.length) return title;
        title = value;
        return chart;
    };

    chart.yTitle = function(value) {
        if (!arguments.length) return yTitle;
        yTitle = value;
        return chart;
    };
    chart.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    return chart;
};
