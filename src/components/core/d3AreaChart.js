import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import moment from 'moment';
import { last } from 'lodash';

const AreaChart = ({ data }) => {
  const d3svg = useRef(null);
  const width = 300;
  const height = 200;

  const casesData = Object.assign(
    data.map(({ date, cases, deaths }) => ({
      date: moment(date),
      cases: cases,
      deaths: deaths,
    })),
    { y: 'Cases' }
  );
  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 30, left: 30 };
    if (data && d3svg.current) {
      let svg = d3.select(d3svg.current);
      svg.selectAll('*').remove();
      let x = d3
        .scaleUtc()
        .domain(d3.extent(casesData, (d) => d.date))
        .range([margin.left, width - margin.right]);

      let yc = d3
        .scaleLinear()
        .domain([0, Math.max(last(casesData).cases, 10)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      /*
      let ym = d3
        .scaleLinear()
        .domain([0, last(mortalityData).value])
        .nice()
        .range([height - margin.bottom, margin.top]);
        */

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
          .call(d3.axisLeft(yc).ticks(7, 's'))
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
      /*
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
          */

      let curve = d3.curveStep;
      let areaC = d3
        .area()
        .curve(curve)
        .x((d) => x(d.date))
        .y0(yc(0))
        .y1((d) => yc(d.cases));
      let areaM = d3
        .area()
        .curve(curve)
        .x((d) => x(d.date))
        .y0(yc(0))
        .y1((d) => yc(d.deaths));

      svg
        .append('path')
        .datum(casesData)
        .attr('fill', 'steelblue')
        .attr('d', areaC);
      svg.append('path').datum(casesData).attr('fill', 'red').attr('d', areaM);
      svg.append('g').call(xAxis);
      svg.append('g').call(ycAxis);
      //svg.append('g').call(ymAxis);
    }
  }, [data, casesData]);

  return (
    <svg
      className="area-chart-container"
      width={width}
      height={height}
      role="img"
      ref={d3svg}
      pointerEvents="none"
    ></svg>
  );
};

AreaChart.propTypes = {
  data: PropTypes.array,
};

export default AreaChart;
