d3.json('/buystat',function(err,data) {
    var margin = {
        top: 5,
        right: 10,
        bottom: 30,
        left: 75
      },
      width = 500 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    

    var minDate = new Date(data[0]._id.year,data[0]._id.month - 1,data[0]._id.day-1);
    var maxDate = new Date(data[data.length - 1]._id.year,data[data.length - 1]._id.month - 1,data[data.length - 1]._id.day+1);
    var barWidth = Math.ceil(width / (maxDate.getTime() - minDate.getTime()) * 24 * 3600000);
    var x = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, width]);

    var y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, function(d) {
        return d.totalAmount;
      })]);

    var div = d3.select(".tooltip")
      .style("opacity", 0);

    var svg = d3.select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.selectAll("rect")
      .data(data)
      .enter().append("rect")   
      .attr("x", function(d) {
        return x(new Date(d._id.year,d._id.month-1,d._id.day))-barWidth/2;
      })
      .attr("y", function(d) {
        return y(d.totalAmount);
      })
      .attr("height", function(d) {
        return height - y(d.totalAmount);
      })
      .attr("width", barWidth)

	  .on("mouseover", function(d) {
        var currentDateTime = new Date(d._id.year,d._id.month-1,d._id.day);
        var year = currentDateTime.getFullYear();
        var month = currentDateTime.getMonth();
        var date = currentDateTime.getDate();
        var amount = d.totalAmount;
        div.transition()
          .duration(200)
          .style("opacity", 0.9);
        div.html("<span class='amount'>" + d.totalAmount + "&nbsp;đồng </span><br><span class='year'>" + year + '/' + `${month+1}` + '/'+ date + "</span>")
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 50) + "px");
      })
	   .on("mouseout", function() {
        var rect = d3.select(this);
        div.transition()
          .duration(500)
          .style("opacity", 0);
      }); 
	// Set the x axis
	svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(data.length+1));
	// Set the y axis
	svg.append("g")
	  .call(d3.axisLeft(y));
	svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
	  .attr("fill","blue")
	  .attr("font-size","15px")
    .attr("font-family","Arial")
      .style("text-anchor", "end")
      .text("Income");  
    })
d3.json('/income',(err, data)=>{
  d3.select('.total').append('span').html(" "+ data[0].totalAmount + ' VND')
})
d3.json('/topuser',(err, data)=>{
  d3.select('.top1').append('span').html(`1: ${data[0].info[0].username} ${data[0].totalAmount} VND`)
  d3.select('.top2').append('span').html(`2: ${data[1].info[0].username} ${data[1].totalAmount} VND`)
  d3.select('.top3').append('span').html(`3: ${data[2].info[0].username} ${data[2].totalAmount} VND`)
})