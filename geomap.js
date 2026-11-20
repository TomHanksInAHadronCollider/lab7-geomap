Promise.all([
  d3.json("./topo.json"),
  d3.csv("./cities.csv"),
  d3.csv("./states.csv")
]).then((data) => {
  console.log(data);

  const topology = data[0];
  const cities = data[1];
  const states = data[2];

  const stateDictionary = new Map();
  states.forEach((state) => {
    stateDictionary.set(state.State, +state.Population);
  });

  var blues = d3.scaleSequential()
    .domain(d3.extent(stateDictionary.values()))
    .range(["white", "steelblue"]);

  const topo = topojson.feature(topology, topology.objects.states);
  var projection = d3.geoAlbersUsa().scale(1000).translate([437.5, 255]);
  var path = d3.geoPath(projection);

  const svg = d3.select("#geomap").append("g").attr("transform", "translate(50,50)");

  // states, colored by population
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
      .attr("d", path)
      .attr("fill", (d) => {
        const pop = stateDictionary.get(d.properties.name);
        return pop !== undefined ? blues(pop) : "lightgray";
      })
      .attr("stroke", "black")
      .attr("stroke-width", "1px");

  // capital cities
  svg.append("g")
    .selectAll("circle")
    .data(cities)
    .join("circle")
      .attr("cx", (d) => projection([+d.longitude, +d.latitude])[0])
      .attr("cy", (d) => projection([+d.longitude, +d.latitude])[1])
      .attr("r", 4)
      .attr("fill", "orange")
      .attr("stroke", "black");
});