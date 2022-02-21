const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var parseDate = d3.timeParse("%Y-%m-%d");
const formatTime = d3.timeFormat("%Y-%m-%d");
d3.json(url).then((urlData)=>{
    dataset = [];
    urlData.data.forEach(d => {
        dataset.push({date: parseDate(d[0]), value: Number(d[1])});
    });
    
    var width = 900, height = 500;
    var minValue = 0;
    var maxValue = d3.max(dataset, (d)=>d.value);
    var minDate = d3.min(dataset, (d)=>d.date);
    var maxDate = d3.max(dataset, (d)=>d.date);
    
    var x = d3.scaleTime()
              .domain([minDate, maxDate])
              .range([0, width]);
    var y = d3.scaleLinear()
                  .domain([minValue, maxValue])
                  .range([height, 0]);

    var yAxis = d3.axisLeft(y);
    var xAxis = d3.axisBottom(x);

    //Title
    d3.select('body').append('h1')
                     .attr("id", "title")
                     .text('United States GDP');

    var svg = d3.select('body').append('svg')
                .attr("height", "100%").attr("width", "100%");
    //Margin
    var margin = {left:50, right:50, top:40, bottom:0};
    //Creating group with svg element
    var chartGroup = svg.append('g')
                        .attr("transform", "translate("+margin.left+","+margin.top+")");
    //Chaining axis calls
    chartGroup.append("g")
                .attr("id","x-axis").attr("transform","translate(0,"+height+")")
                .attr("class", "tick")
                .call(xAxis);
    chartGroup.append("g")
                .attr("id","y-axis")
                .attr("class", "tick")
                .call(yAxis);
    //Chart Logic
    chartGroup.selectAll('rect')
              .data(dataset)
              .enter()
              .append('rect')
              .attr("class", "bar")
              .attr("fill", "skyblue")
              .attr("data-date",(d)=>formatTime(d.date))
              .attr("data-gdp",(d)=>(d.value))
              .attr("x",(d)=>x(d.date))
              .attr("y",(d)=>y(d.value))
              .attr("height", (d)=>height - y(d.value))
              .attr("width",10);

    //Axis Label
    chartGroup.append('text')
               .text("Gross Domestic Product($)")
               .attr("class", "yLabel")
               .attr('x', 0)
               .attr('y', 0);

    //Tooltip Logic
    d3.select('body').append('div')
              .attr('id', 'tooltip');
    const tooltipDiv = document.querySelector('#tooltip');
    console.log(tooltipDiv);
    d3.selectAll('.bar').on("mousemove", function mouseover(e,d){
  
        const qtr = d.date.getMonth()+1;
        // const qtr = Number.parseInt(d.date.slice(5,7),10);
        const q = qtr>9? 'Q4': (qtr>6? 'Q3':(qtr>3? 'Q2': 'Q1'));

        const x = Number.parseInt(e.currentTarget.getAttribute('x'), 10);
        // const y = Number.parseInt(e.currentTarget.getAttribute('y'), 10) - 50;
        const y = 400;
        
        tooltipDiv.innerHTML = `${d.date.getFullYear()} ${q} <br/>  $${d.value} Billion`;
        e.currentTarget.style.fill = "lightblue";
        tooltipDiv.style.top = `${y}px`;
        tooltipDiv.style.left = `${x}px`;
        tooltipDiv.style.visibility = 'visible';
        tooltipDiv.style.opacity = 0.6;
        tooltipDiv.setAttribute('data-date',formatTime(d.date));
    });
    d3.selectAll('.bar').on("mouseout", function mouseout(e){
        e.currentTarget.style.fill ="skyblue";
        tooltipDiv.style.opacity = 0;
        tooltipDiv.style.visibility = "hidden";
    });



});
