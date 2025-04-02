'use client';

import React, { useState, useEffect } from "react";
import styles from '../trips/[id]/budget/pieChartStyles.module.css';

const PieChart = ({ data }) => {
  const [chartSegments, setChartSegments] = useState([]);
  
  const colors = [
    "cornflowerblue",
    "olivedrab",
    "orange",
    "tomato",
    "crimson",
    "purple",
    "turquoise",
    "forestgreen",
    "navy"
  ];

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Generate segments for the chart
    const segments = [];
    let cumulativePercent = 0;
    
    data.forEach((item, index) => {
      const percent = item.value / total;
      segments.push({
        color: colors[index % colors.length],
        startPercent: cumulativePercent,
        endPercent: cumulativePercent + percent,
        label: item.label,
        value: item.value,
        percent: percent * 100
      });
      cumulativePercent += percent;
    });
    
    setChartSegments(segments);
  }, [data]);

  // Function to generate conic gradient
  const generateConicGradient = () => {
    if (chartSegments.length === 0) return 'conic-gradient(#eee 0% 100%)';
    
    let gradientString = 'conic-gradient(';
    chartSegments.forEach((segment, index) => {
      gradientString += `${segment.color} ${segment.startPercent * 100}% ${segment.endPercent * 100}%`;
      if (index < chartSegments.length - 1) gradientString += ', ';
    });
    gradientString += ')';
    
    document.documentElement.style.setProperty('--pie-gradient', gradientString);

    return gradientString;
  };

  return (
    <div className={styles['pie-chart--wrapper']}>
      <div className={styles['pie-chart-container']}>
        <div
          className={styles['pie-chart']}
          style={{
            background: generateConicGradient()
          }}
        >
          <div className={styles['pie-hole']}></div>
        </div>
      </div>
      <div className={styles['pie-chart__legend']}>
        {chartSegments.map((segment, index) => (
          <div key={index} className={styles['legend-item']}>
            <span 
              className={styles['legend-color']}
              style={{ backgroundColor: segment.color }}
            />
            <span className={styles['legend-label']}>{segment.label}</span>
            <span className={styles['legend-value']}>
              ${parseFloat(segment.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;