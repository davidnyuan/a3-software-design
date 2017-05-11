/* Create a scatter plot of 1960 life expectancy (gdp) versus 2013 life expectancy (life_expectancy).*/

$(function() {
    // Variables to show
    var xVar = 'gdp';
    var yVar = 'life_expectancy';
    var chartData,
    nestedData;

    // Load data in using d3's csv function.
    d3.csv('data/prepped_data.csv', function(error, data) {
        var prepData = function() {
            chartData = data.map(function(d) {
                return {
                    x: d[xVar],
                    y: d[yVar],
                    id: d.country,
                    region: d.region
                };
            });

        }
        var scatter = VoronoiChart().width(700).height(400);

        prepData();

        var draw = function() {
            prepData();
            scatter.title("Chart");
            scatter.xTitle(xVar);
            scatter.yTitle(yVar);
            var charts = d3.select('#vis').selectAll('.chart')
                .data([chartData]);
                charts.enter().append("div")
                    .attr('class', 'chart')
                    .merge(charts)
                    .call(scatter);
                charts.exit().remove();
        };

        draw();
        $('select').on('change', function(d) {
        xVar = $(this).val();
        draw();
    });

    // Initialize materialize style
    $('select').material_select()

    });
});
