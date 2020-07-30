import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const AreaChart = ({ csvData }) => {
  //const [data, setData] = useState(null);
  const d3svg = useRef(null);
  const width = 500;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 30, left: 30 };

  const data = Object.assign(
    d3
      .csvParse(csvData, d3.autoType)
      .map(({ date, close }) => ({ date, value: close })),
    { y: '$ Close' }
  );
  /*
  useEffect(() => {
    (async () => {
      const response = await fetch('aapl.csv');
      const data = Object.assign(
        d3
          .csvParse(await response.text(), d3.autoType)
          .map(({ date, close }) => ({ date, value: close })),
        { y: '$ Close' }
      );
      setData(data);
      initializeChart(data);
    })();
  }, []);*/
  console.debug(csvData, data);

  useEffect(() => {
    if (data && d3svg.current) {
      let svg = d3.select(d3svg.current);
      let x = d3
        .scaleUtc()
        .domain(d3.extent(data, (d) => d.date))
        .range([margin.left, width - margin.right]);

      let y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      let xAxis = (g) =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );

      let yAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .call((g) => g.select('.domain').remove())
          .call((g) =>
            g
              .select('.tick:last-of-type text')
              .clone()
              .attr('x', 3)
              .attr('text-anchor', 'start')
              .attr('font-weight', 'bold')
              .text(data.y)
          );

      let curve = d3.curveLinear;
      let area = d3
        .area()
        .curve(curve)
        .x((d) => x(d.date))
        .y0(y(0))
        .y1((d) => y(d.value));

      svg.append('path').datum(data).attr('fill', 'steelblue').attr('d', area);
      svg.append('g').call(xAxis);
      svg.append('g').call(yAxis);
    }
  });

  return (
    <svg
      className="area-chart-container"
      width={width}
      height={height}
      role="img"
      ref={d3svg}
    ></svg>
  );
};

export default AreaChart;
