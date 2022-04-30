let a = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';

let movieData;
let movieDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
let c = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawTreeMap = () => {

    let hierarchy = d3.hierarchy(movieData, (d) => {
       return d['children'] 
    }).sum((d) => {
        return d['value']
    }).sort((d1, d2) => {
        return d2['value'] - d1['value']
    })

    let createTreeMap = d3.treemap()
                            .size([1000, 600])

    createTreeMap(hierarchy);

    let movieTiles = hierarchy.leaves()

    let block = canvas.selectAll('g')
            .data(movieTiles)
            .enter()
            .append('g')
            .attr('transform', (d) => {
                return 'translate(' + d['x0'] + ', ' + d['y0'] + ')'
            }
            )

    block.append('rect')
            .attr('class', 'tile')
            .attr('fill', (d) => {
                let category = d['data']['category']
                if(category === 'Action'){
                    return 'orange'
                }else if(category === 'Drama') {
                    return 'lightgreen'
                }else if (category === 'Adventure') {
                    return 'coral'
                }else if (category === 'Family') {
                    return 'lightblue'
                }else if(category === 'Animation'){
                    return 'pink'
                }else if(category === 'Comedy'){
                    return 'khaki'
                }else if (category === 'Biography'){
                    return 'tan'
                }
            })
            .attr('data-name', (d) => d['data']['name'] )
            .attr('data-category', (d) => d['data']['category'])
            .attr('data-value', (d) => d['data']['value'])
            .attr('width', (d) => {
                return d['x1'] - d['x0']
            })
            .attr('height', (d) => {
                return d['y1'] - d['y0']
            })
            .on("mouseover", (e, d) => {
                tooltip.transition()
                        .style('visibility', 'visible')

                let revenue = d['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")


                tooltip.html(
                    '$ ' + revenue + "<hr />" + d['data']['name']
                )
            })
            .on("mouseout", (e, d) => {
                tooltip.transition()
                        .style('visibility', 'visible')
            }
            )

    block.append('text')
            .text((d) => d['data']['name'])
            .attr('x', 5)
            .attr('y', 20)

}

d3.json(movieDataUrl).then(
    (data, error) => {
        if(error) {
            console.log(error)
        }else{
            movieData = data;
            console.log(movieData)
            drawTreeMap()
        }
    }
)










