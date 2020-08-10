import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import moment from 'moment';
import { last, get } from 'lodash';

const AreaChart = ({
  height,
  data,
  currentDate,
  currentValue,
  showIntercept,
}) => {
  const d3svg = useRef(null);
  const width = 300;

  const yTicks = height * (7 / 200);

  const casesData = Object.assign(
    data.slice(1).map(({ date, cases, deaths }) => ({
      date: moment(date),
      cases: cases,
      deaths: deaths,
    })),
    { y: 'Cases' }
  );

  useEffect(() => {
    const margin = { top: 20, right: 0, bottom: 30, left: 30 };
    if (data && d3svg.current) {
      let svg = d3.select(d3svg.current);
      svg.selectAll('*').remove();
      let x = d3
        .scaleTime()
        //.domain(d3.extent(casesData, (d) => d.date))
        .domain([
          moment('2020-01-01', 'YYYY-MM-DD'),
          moment().subtract(1, 'days'),
        ])
        .range([margin.left, width - margin.right]);

      let yc = d3
        .scaleLinear()
        .domain([0, Math.max(get(last(casesData), 'cases'), 10)])
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
        g
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(
            d3
              .axisBottom(x)
              .ticks(5)
              .tickFormat(d3.timeFormat('%b'))
              .tickSizeOuter(0)
          );

      let ycAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(yc).ticks(yTicks, 's'))
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

      const radius = 2;
      const markerColor = '#ccc';
      svg
        .append('line')
        .attr('x1', x(currentDate))
        .attr('x2', x(currentDate))
        .attr('y1', height - margin.bottom)
        .attr('y2', yc(currentValue) + radius)
        .style('stroke-width', 1)
        .style('stroke', markerColor)
        .style('fill', 'none');
      svg
        .append('circle')
        .attr('cx', x(currentDate))
        .attr('cy', yc(currentValue))
        .attr('r', radius)
        .style('stroke-width', 1)
        .style('stroke', markerColor)
        .style('fill', 'none');

      if (showIntercept && casesData[0]) {
        svg
          .append('line')
          .attr('x1', x(casesData[0].date))
          .attr('x2', x(casesData[0].date))
          .attr('y1', height - margin.bottom)
          .attr('y2', height / 2 + margin.top)
          .style('stroke-width', 1)
          .style('stroke', markerColor)
          .style('fill', 'none');
        svg
          .append('text')
          .attr('x', x(casesData[0].date))
          .attr('y', height / 2 + margin.top - 5)
          .text(casesData[0].date.format('MMM D'))
          .attr('text-anchor', 'middle')
          .attr('font-family', 'sans-serif')
          .attr('font-size', '10px')
          .attr('fill', '#eee');
      }
    }
  }, [data, casesData, height, yTicks, currentDate, currentValue]);

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
  height: PropTypes.number,
  data: PropTypes.array,
  currentDate: PropTypes.object,
  currentValue: PropTypes.number,
  showIntercept: PropTypes.bool,
};

AreaChart.defaultProps = {
  height: 200,
};

export default AreaChart;
