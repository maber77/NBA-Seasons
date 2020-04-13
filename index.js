const svg = d3.select('svg');

var margin = {top: 60, right: 60, bottom: 60, left: 90},
    innerwidth = +svg.attr('width') - margin.left - margin.right,
    innerheight = +svg.attr('height') - margin.top - margin.bottom;

const width = +svg.attr('width');
const height = +svg.attr('height');

var tooltip = d3.select("#vis-container").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const updateChart = function(data, year) {

    var xScale = d3.scaleLinear()
        .domain([40, 160])//([d3.min(data, d => d.weight) - 5, d3.max(data, d => d.weight) + 5])
        .range([margin.left, width - margin.right]);

    var yScale = d3.scaleLinear()
        .domain([155, 240])//([d3.min(data, d => d.height) - 5, d3.max(data, d => d.height) + 5])
        .range([height - margin.bottom, margin.top]);

    var myColor = d3.scaleOrdinal()
        .domain(['G-F', 'SG', 'SF', 'F-G', 'F', 'G', 'F-C', 'PG', 'C', 'PF', 'C-F',
            'SF-SG', 'PF-C', 'C-PF', 'SG-SF', 'PF-SF', 'SF-PF', 'SG-PG',
            'SF-PG', 'C-SF', 'SG-PF', 'PG-SG', 'PG-SF'])
        .range(d3.schemeSet1);

    // tooltip mouseover event handler
    var tipMouseover = function (d) {
        var html = d.Player + "<br/>" + "Pos: " + d.Pos + "<br/>" + "Points: " + d.PTS;

        tooltip.html(html)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style("background-color", "white")
            .transition()
            .duration(200) // ms
            .style("opacity", .9); // started as 0!

    };

    // tooltip mouseout event handler
    var tipMouseout = function(d) {
        tooltip.transition()
            .duration(300) // ms
            .style("opacity", 0); // don't care about position!
    };

    svg.selectAll('circle')
        .data(data.filter(function (d) {
            return d.Year === year && d.Rank < 100
        }))
        .enter()
        .append('circle')
        .attr('r', d => d.PTS / 145)
        .attr('cx', d => xScale(d.weight))
        .attr('cy', d => yScale(d.height))
        .style('opacity', .6)
        .style('stroke', 'black')
        .attr('fill', function (d) {
            return myColor(d.Pos)
        })
        .on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout);
};


d3.csv('basketball2.csv').then(function (data) {
    data.forEach(function (d) {
        d.Year = +d.Year;
        d.PTS = +d.PTS;
        d.height = +d.height;
        d.weight = +d.weight;
        d.Rank = + d.Rank;
    });

    updateChart(data,1950);

    //-----------------------------------------TITLE-----------------------------------------//

    svg.append("text")
        .attr("class", "Title")
        .attr("text-anchor", "right")
        .attr("x", 145)
        .attr("y", 40)
        .text("Top 100 NBA Players' Height, Weight, and Points Per Season (1950-2017) ")
        .style('font-size', '18pt');

    //-----------------------------------------X - AXIS-----------------------------------------//


    var xScale = d3.scaleLinear()
        .domain([40,160])//([d3.min(data, d => d.weight) - 5, d3.max(data, d => d.weight) + 5])
        .range([margin.left, width - margin.right]);
    svg.append('g')
        .attr('transform', `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "right")
        .attr("x", width/2 - 35)
        .attr("y", height - 6)
        .text("Player Weight (kg)");


    //-----------------------------------------Y - AXIS-----------------------------------------//

    var yScale = d3.scaleLinear()
        .domain([155,240])//([d3.min(data, d => d.height) - 5, d3.max(data, d => d.height) + 5])
        .range([height - margin.bottom, margin.top]);
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr('x', -250)
        .attr("y", 20)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Player Height (cm)");




    // Step
    var sliderStep = d3
        .sliderBottom()
        .min(1950)
        .max(2017)
        .width(800)
        .ticks(10)
        .tickFormat(d3.format(".0f"))
        .step(1)
        .default(1950)
        .on('onchange', val => {
            d3.selectAll('circle').remove();

            updateChart(data,val);


        });



    var gStep = d3
        .select('div#slider-step')
        .append('svg')
        .attr('width', 900)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(80,30)');

    gStep.call(sliderStep);

    d3.select('p#value-step').text((sliderStep.value()));


});



