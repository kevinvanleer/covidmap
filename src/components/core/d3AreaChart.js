import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import moment from 'moment';
import { last } from 'lodash';

const AreaChart = ({ data }) => {
  //const [data, setData] = useState(null);
  const d3svg = useRef(null);
  const width = 300;
  const height = 200;
  const margin = { top: 20, right: 40, bottom: 30, left: 40 };

  const casesData = Object.assign(
    data.map(({ date, cases }) => ({ date: moment(date), value: cases })),
    { y: 'Cases' }
  );
  const mortalityData = Object.assign(
    data.map(({ date, deaths }) => ({ date: moment(date), value: deaths })),
    { y: 'Deaths' }
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

  useEffect(() => {
    if (data && d3svg.current) {
      let svg = d3.select(d3svg.current);
      svg.selectAll('*').remove();
      let x = d3
        .scaleUtc()
        .domain(d3.extent(casesData, (d) => d.date))
        .range([margin.left, width - margin.right]);

      let yc = d3
        .scaleLinear()
        .domain([0, last(casesData).value])
        .nice()
        .range([height - margin.bottom, margin.top]);

      let ym = d3
        .scaleLinear()
        .domain([0, last(mortalityData).value])
        .nice()
        .range([height - margin.bottom, margin.top]);

      let xAxis = (g) =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );

      let ycAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(yc))
          .call((g) => g.select('.domain').remove())
          .call((g) =>
            g
              .select('.tick:last-of-type text')
              .clone()
              .attr('x', 3)
              .attr('text-anchor', 'start')
              .attr('font-weight', 'bold')
              .text(casesData.y)
          );

      let ymAxis = (g) =>
        g
          .attr('transform', `translate(${width - margin.right},0)`)
          .call(d3.axisRight(ym))
          .call((g) => g.select('.domain').remove())
          .call((g) =>
            g
              .select('.tick:last-of-type text')
              .clone()
              .attr('x', 3)
              .attr('text-anchor', 'start')
              .attr('font-weight', 'bold')
              .text(mortalityData.y)
          );

      let curve = d3.curveLinear;
      let areaC = d3
        .area()
        .curve(curve)
        .x((d) => x(d.date))
        .y0(yc(0))
        .y1((d) => yc(d.value));
      let areaM = d3
        .area()
        .curve(curve)
        .x((d) => x(d.date))
        .y0(yc(0))
        .y1((d) => yc(d.value));

      svg
        .append('path')
        .datum(casesData)
        .attr('fill', 'steelblue')
        .attr('d', areaC);
      svg
        .append('path')
        .datum(mortalityData)
        .attr('fill', 'red')
        .attr('d', areaM);
      svg.append('g').call(xAxis);
      svg.append('g').call(ycAxis);
      //svg.append('g').call(ymAxis);
    }
  }, [data]);

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
