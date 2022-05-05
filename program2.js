let url = ' https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json ';
let req = new XMLHttpRequest()

let values = []

let xScale;
let yScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
    svg.attr('width', width)
       .attr('height', height)
}

let generateScales = () => {

    xScale = d3.scaleLinear()
               .domain([d3.min(values, (d) => d['Year']) - 1, d3.max(values, (d) => d['Year'] + 1)])
               .range([padding, width - padding])

    yScale = d3.scaleTime()
               .domain([d3.min(values, (item) => {
                   return new Date(item['Seconds'] * 1000)
               }), d3.max(values, (item) => {
                   return new Date(item['Seconds'] * 1000)
               })])
               .range([padding, height-padding])

}

let drawPoints = () => {

    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', '5')
        .attr('data-xvalue', (d) => d['Year'])
        .attr('data-yvalue', (item) => {
            return new Date(item['Seconds'] * 1000)
        })
        .attr('cx', (d) => xScale(d['Year']))
        .attr('cy', (d) => {
            return (yScale(new Date(d['Seconds'] * 1000)))
        })
        .attr('fill', (d) => {
            if(d['Doping'] != '') {
                return 'orange'
            }else {
                return 'green'
            }
        })
        .on('mouseover', (e, d) => {
            tooltip.transition()
                    .style('visibility', 'visible')

            if(d['Doping'] != ''){
                tooltip.text(d['Year'] + '-' + d['Name'] + '-' + d["Time"] + '-' + d['Doping'])
            } else {
                tooltip.text(d['Year'] + '-' + d['Name'] + '-' + d["Time"] + '-' + 'NO Doping')
                }
            tooltip.attr('data-year', (d) => d['Year'])
        })
        .on('mouseout', (e, d) => {
            tooltip.transition()
            .style('visibility', 'hidden')
        })
    }

let generateAxes = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('D'))
    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))
    svg.append('g')
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0,' + (height -padding) + ')')


       svg.append('g')
       .call(yAxis)
       .attr('id', 'y-axis')
       .attr('transform','translate(' + padding + ', 0)')

}

req.open('GET', url, true)
req.onload = () => {
       values = JSON.parse(req.responseText)
       console.log(values)
       drawCanvas()
       generateScales()
       drawPoints()
       generateAxes()
   }
req.send()