/**
 * Created by LENOVO on 18/05/2017.
 */
var yearRingChart   = dc.pieChart("#chart-ring-year"),
    spendHistChart  = dc.barChart("#chart-hist-spend"),
    spenderRowChart = dc.rowChart("#chart-row-spenders");
// use static or load via d3.csv("spendData.csv", function(error, spendData) {/* do stuff */});
var spendData = [
    {Name: 'Mr A', Spent: '$40', Year: 2011},
    {Name: 'Mr B', Spent: '$10', Year: 2011},
    {Name: 'Mr C', Spent: '$40', Year: 2011},
    {Name: 'Mr A', Spent: '$70', Year: 2012},
    {Name: 'Mr B', Spent: '$20', Year: 2012},
    {Name: 'Mr B', Spent: '$50', Year: 2013},
    {Name: 'Mr C', Spent: '$30', Year: 2013}
];
// normalize/parse data
spendData.forEach(function(d) {
    d.Spent = d.Spent.match(/\d+/);
});
function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.value != 0;
            });
        }
    };
}
// set crossfilter
var ndx = crossfilter(spendData),
    yearDim  = ndx.dimension(function(d) {return +d.Year;}),
    spendDim = ndx.dimension(function(d) {return Math.floor(d.Spent/10);}),
    nameDim  = ndx.dimension(function(d) {return d.Name;}),
    spendPerYear = yearDim.group().reduceSum(function(d) {return +d.Spent;}),
    spendPerName = nameDim.group().reduceSum(function(d) {return +d.Spent;}),
    spendHist    = spendDim.group().reduceCount(),
    nonEmptyHist = remove_empty_bins(spendHist)
yearRingChart
    .width(200).height(200)
    .dimension(yearDim)
    .group(spendPerYear)
    .innerRadius(50);
spendHistChart
    .width(300).height(200)
    .dimension(spendDim)
    .group(nonEmptyHist)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .elasticX(true)
    .elasticY(true);
spendHistChart.xAxis().tickFormat(function(d) {return d*10}); // convert back to base unit
spendHistChart.yAxis().ticks(2);
spenderRowChart
    .width(350).height(200)
    .dimension(nameDim)
    .group(spendPerName)
    .elasticX(true);
dc.renderAll();