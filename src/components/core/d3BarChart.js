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
  horizontal,
  labelBars,
}) => {
  const d3svg = useRef(null);

  useEffect(() => {
    const axes = horizontal
      ? { category: 'y', magnitude: 'x' }
      : { category: 'x', magnitude: 'y' };
    const dimensions = horizontal
      ? { category: 'height', magnitude: 'width' }
      : { category: 'width', magnitude: 'height' };
    const dimensionValues = horizontal
      ? { category: height, magnitude: width }
      : { category: width, magnitude: height };
    const magnitudeTicks = horizontal ? (width * 7) / 300 : (height * 7) / 200;
    const defaultMaxMagnitude = average ? Math.max(average * 1.5, 10) : 10;
    const margin = labelBars
      ? { top: 5, right: 0, bottom: 30, left: 10 }
      : { top: 20, right: 0, bottom: 30, left: 30 };
    if (data && d3svg.current) {
      let svg = d3.select(d3svg.current);
      svg.selectAll('*').remove();

      let categoryScale = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .range(
          horizontal
            ? [margin.top, height - margin.bottom]
            : [margin.left, width - margin.right]
        )
        .padding(0.1);

      let magnitudeScale = d3
        .scaleLinear()
        .domain([
          0,
          isEmpty(data)
            ? defaultMaxMagnitude
            : Math.max(
                d3.max(data, (d) => d[dataDimensions.magnitude]),
                defaultMaxMagnitude
              ),
        ])
        .nice()
        .range(
          horizontal
            ? [margin.left, width - margin.right - margin.left]
            : [height - margin.bottom, margin.top]
        );

      let categoryAxis = (g) =>
        horizontal
          ? labelBars
            ? g.attr('transform', `translate(${margin.left},0)`).call(
                d3
                  .axisLeft(categoryScale)
                  .tickFormat(() => null)
                  .tickSize(0)
              )
            : g
                .attr('transform', `translate(${margin.left},0)`)
                .call(
                  d3
                    .axisLeft(categoryScale)
                    .tickFormat((i) => data[i][dataDimensions.category])
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
                )
          : g
              .attr('transform', `translate(0,${height - margin.bottom})`)
              .call(
                d3
                  .axisBottom(categoryScale)
                  .tickFormat((i) => data[i][dataDimensions.category])
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

      let magnitudeAxis = (g) =>
        horizontal
          ? g
              .attr('transform', `translate(0,${height - margin.bottom})`)
              .call(
                d3
                  .axisBottom(magnitudeScale)
                  .ticks(magnitudeTicks, d3.format('s'))
              )
              .call((g) => g.select('.domain').remove())
              .call((g) =>
                g
                  .select('.tick:last-of-type text')
                  .clone()
                  .attr('x', -width / 2)
                  .attr('y', 20)
                  .attr('text-anchor', 'start')
                  .attr('font-weight', 'bold')
                  .text(yLabel)
              )
          : g
              .attr('transform', `translate(${margin.left},0)`)
              .call(
                d3
                  .axisLeft(magnitudeScale)
                  .ticks(magnitudeTicks, d3.format('s'))
              )
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
        .attr(axes.category, (d, i) => categoryScale(i))
        .attr(axes.magnitude, (d) =>
          horizontal
            ? magnitudeScale(0)
            : magnitudeScale(d[dataDimensions.magnitude])
        )
        .attr(dimensions.magnitude, (d) =>
          horizontal
            ? magnitudeScale(d[dataDimensions.magnitude]) - margin.left
            : magnitudeScale(0) - magnitudeScale(d[dataDimensions.magnitude])
        )
        .attr(dimensions.category, categoryScale.bandwidth());
      if (labelBars) {
        const fontSize = categoryScale.bandwidth() * 0.5;
        const fontOffset = (categoryScale.bandwidth() + fontSize) / 2 - 2;
        svg
          .append('g')
          .selectAll('rect')
          .data(data)
          .join('text')
          .attr(axes.category, (d, i) => categoryScale(i) + fontOffset)
          .attr(axes.magnitude, margin.left + 5)
          .text((d) => d[dataDimensions.category])
          .attr('text-anchor', 'left')
          .attr('font-family', 'sans-serif')
          .attr('font-size', fontSize)
          .attr('fill', '#eee');
      }
      svg.append('g').call(categoryAxis);
      svg.append('g').call(magnitudeAxis);

      if (isEmpty(data)) {
        svg
          .append('text')
          .attr(axes.category, dimensionValues.category / 2)
          .attr(axes.magnitude, dimensionValues.magnitude / 2)
          .text('No data')
          .attr('text-anchor', 'middle')
          .attr('font-family', 'sans-serif')
          .attr('font-size', '20px')
          .attr('fill', '#eee');
      }

      if (average !== undefined) {
        const offset = height - margin.bottom - margin.top + 5;
        svg
          .append('line')
          .attr('x1', margin.left)
          .attr('x2', width - margin.right)
          .attr('y1', magnitudeScale(average))
          .attr('y2', magnitudeScale(average))
          .style('stroke-width', 1)
          .style('stroke', '#ccc')
          .style('fill', 'none');
        svg
          .append('text')
          .attr(axes.category, margin.left)
          .attr(
            axes.magnitude,
            magnitudeScale(average) +
              (magnitudeScale(average) < offset ? 10 : -5)
          )
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
    horizontal,
    labelBars,
    height,
    width,
    xLabel,
    yLabel,
    average,
    dataDimensions,
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
  labelBars: PropTypes.bool,
  horizontal: PropTypes.bool,
};

BarChart.defaultProps = {
  data: [],
  setActiveLayer: () => null,
  color: 'steelblue',
  height: 200,
  width: 300,
  dataDimensions: { category: 'date', magnitude: 'value' },
};

export default BarChart;
