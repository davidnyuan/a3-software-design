# a3-software-design
# d3-voronoi



If you use NPM, `npm install d3-voronoi`. Otherwise, download the [latest release](https://github.com/d3/d3-voronoi/releases/latest). You can also load directly from [d3js.org](https://d3js.org), either as a [standalone library](https://d3js.org/d3-voronoi.v1.min.js) or as part of [D3 4.0](https://github.com/d3/d3). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3` global is exported:

```html
<script src="https://d3js.org/d3-voronoi.v1.min.js"></script>
<script>

var chart = VoronoiChart();

</script>
```


## API Reference

<b>VoronoiChart</b>() [<>](https://github.com/cjjaeger/a3-software-design/blob/master/js/VoronoiChart.js "Source")


Data Joins[<>](https://github.com/cjjaeger/a3-software-design/blob/master/js/VoronoiChart.js#L29 "Source")
You can call and do data joins in this format
```js
var scatter = VoronoiChart();

var charts = d3.select('#vis').selectAll('.chart')
    .data([chartData]);
charts.enter().append("div")
        .attr('class', 'chart')
        .merge(charts)
        .call(scatter);
charts.exit().remove();
```
Takes in an array of objects or an array of arrays of objects
objects are in this form:
```js
{
    x: xValue,
    y: yValue,
    id: uniqueID,
}
```
you can also use the setter functions to modify some of the attributes of the VoronoiChart
Setter functions[<>](https://github.com/cjjaeger/a3-software-design/blob/master/js/VoronoiChart.js#L207 "Source")
