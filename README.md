# a3-software-design

```html
<script src="https://code.jquery.com/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.2/js/materialize.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.2/css/materialize.css" />
<script src="http://d3js.org/d3.v4.js"></script>
<link rel="stylesheet" href="css/main.css" />
<script src="js/VoronoiChart.js"></script>
<script>

var chart = VoronoiChart();

</script>
```


## API Reference

<b>VoronoiChart</b>() [<>](https://github.com/cjjaeger/a3-software-design/blob/master/js/VoronoiChart.js "Source")


Data Joins[<>](https://github.com/cjjaeger/a3-software-design/blob/master/js/VoronoiChart.js#104 "Source")
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
Takes in an array of objects in this form:
```js
{
    x: xValue,
    y: yValue,
    id: uniqueID,
}
```
you can also use the setter functions to modify some of the attributes of the VoronoiChart
Setter functions[<>](https://github.com/cjjaeger/a3-software-design/blob/master/js/VoronoiChart.js#L176 "Source")
