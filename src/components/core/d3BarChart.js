import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { isEmpty } from 'lodash';

const BarChart = ({
  data,
  dataDimensions,
  average,
  xLabel,
  yLabel,
  height,
  width,
  color,
  activeLayers,
  setActiveLayer,
}) => {
  const d3svg = useRef(null);

  useEffect(() => {
    const yTicks = height * (7 / 200);
    const defaultMinHeight = average ? Math.max(average * 1.5, 10) : 10;
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
            ? defaultMinHeight
            : Math.max(
                d3.max(data, (d) => d[dataDimensions.y]),
                defaultMinHeight
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
              .tickFormat((i) => data[i][dataDimensions.x])
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
        .attr('y', (d) => y(d[dataDimensions.y]))
        .attr('height', (d) => y(0) - y(d[dataDimensions.y]))
        .attr('width', x.bandwidth());
      svg.append('g').call(xAxis);
      svg.append('g').call(yAxis);

      const offset = height - margin.bottom - margin.top + 5;
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

      if (average !== undefined) {
        svg
          .append('line')
          .attr('x1', margin.left)
          .attr('x2', width - margin.right)
          .attr('y1', y(average))
          .attr('y2', y(average))
          .style('stroke-width', 1)
          .style('stroke', '#ccc')
          .style('fill', 'none');
        svg
          .append('text')
          .attr('x', margin.left)
          .attr('y', y(average) + (y(average) < offset ? 10 : -5))
          .text('30-DAY US AVERAGE')
          .attr('text-anchor', 'left')
          .attr('font-family', 'sans-serif')
          .attr('font-size', '8px')
          .attr('fill', '#ccc');
      }
    }
  }, [
    data,
    color,
    activeLayers,
    setActiveLayer,
    height,
    width,
    xLabel,
    yLabel,
    average,
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
  dataDimensions: PropTypes.object,
  color: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  average: PropTypes.number,
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
  dataDimensions: { x: 'date', y: 'value' },
};

export default BarChart;
