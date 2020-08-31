import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { isEmpty } from 'lodash';

const BarChart = ({
  data,
  xLabel,
  yLabel,
  height,
  width,
  color,
  activeLayers,
  setActiveLayer,
}) => {
  const d3svg = useRef(null);
  const yTicks = height * (7 / 200);

  useEffect(() => {
    const margin = { top: 20, right: 0, bottom: 30, left: 30 };
    if (data && d3svg.current) {
      let svg = d3.select(d3svg.current);
      svg.selectAll('*').remove();

      let x = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      let y = d3
        .scaleLinear()
        .domain([
          0,
          isEmpty(data)
            ? 100
            : Math.max(
                d3.max(data, (d) => d.value),
                100
              ),
        ])
        .nice()
        .range([height - margin.bottom, margin.top]);

      let xAxis = (g) =>
        g
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(
            d3
              .axisBottom(x)
              .tickFormat((i) => data[i].date)
              .tickSizeOuter(0)
          )
          .call((g) =>
            g
              .select('.tick:first-of-type text')
              .clone()
              .attr('x', -10)
              .attr('text-anchor', 'end')
              .attr('font-weight', 'bold')
              .text(xLabel)
          );

      let yAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(yTicks, d3.format('s')))
          .call((g) => g.select('.domain').remove())
          .call((g) =>
            g
              .select('.tick:last-of-type text')
              .clone()
              .attr('x', 3)
              .attr('text-anchor', 'start')
              .attr('font-weight', 'bold')
              .text(yLabel)
          );

      svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('fill', color)
        .attr('x', (d, i) => x(i))
        .attr('y', (d) => y(d.value))
        .attr('height', (d) => y(0) - y(d.value))
        .attr('width', x.bandwidth());
      svg.append('g').call(xAxis);
      svg.append('g').call(yAxis);

      if (isEmpty(data)) {
        svg
          .append('text')
          .attr('x', width / 2)
          .attr('y', height / 2)
          .text('No data')
          .attr('text-anchor', 'middle')
          .attr('font-family', 'sans-serif')
          .attr('font-size', '20px')
          .attr('fill', '#eee');
      }
    }
  }, [
    data,
    color,
    activeLayers,
    setActiveLayer,
    height,
    xLabel,
    yLabel,
    yTicks,
  ]);

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

BarChart.propTypes = {
  data: PropTypes.array,
  color: PropTypes.string,
  height: PropTypes.number,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  activeLayers: PropTypes.array,
  setActiveLayer: PropTypes.func,
};

BarChart.defaultProps = {
  data: [],
  setActiveLayer: () => null,
  color: 'steelblue',
  height: 200,
  width: 300,
};

export default BarChart;
