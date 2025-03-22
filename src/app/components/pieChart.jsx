'use client';

import React, { useEffect, useRef } from "react";
import styles from '../trips/[id]/budget/pieChartStyles.module.css';

//adapted from https://codepen.io/MaciejCaputa/pen/VjVpRe

// export default PieChart;
const PieChart = ({ data }) => {
    const chartRef = useRef(null);
    const tooltipRef = useRef(null);
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
  
      const pieElement = chartRef.current;
      if (!pieElement) return;
  
      let listTotal = data.reduce((sum, item) => sum + item.value, 0);
      console.log('Total value:', listTotal);
      let offset = 0;
  
      // clear previous elements
      pieElement.innerHTML = '';
  
      data.forEach((item, index) => {
        const sliceSize = (item.value / listTotal) * 360;
        console.log(`Creating slice ${index}:`, {
          label: item.label,
          value: item.value,
          sliceSize: sliceSize,
          offset: offset
        });
        const sliceID = `slice-${index}`;
        const color = colors[index % colors.length];
  
        // Create Slice Element
        const slice = document.createElement("div");
        slice.className = `${styles.slice} ${sliceID}`;
        slice.style.transform = `rotate(${offset}deg)`;
  
        const span = document.createElement("span");
        span.className = styles['slice-span'];
        span.style.backgroundColor = color;
        span.style.transform = `rotate(${sliceSize}deg)`;
        span.style.clip = `rect(0px, 100px, 200px, 0px)`;
  
        slice.appendChild(span);
        pieElement.appendChild(slice);
  
        offset += sliceSize;
      });
    }, [data]);
  
    return (
      <div className={styles['pie-chart--wrapper']}>
        <div className={styles['pie-chart']} ref={chartRef}></div>
        <div className={styles['pie-chart__legend']}>
          {data.map((item, index) => (
            <div key={index} className={styles['legend-item']}>
              <span 
                className={styles['legend-color']}
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className={styles['legend-label']}>{item.label}</span>
              <span className={styles['legend-value']}>${parseFloat(item.value).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
};
  
export default PieChart;