import React, { useEffect, useRef } from "react";


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
  
      // Create tooltip element if it doesn't exist
      if (!tooltipRef.current) {
        const tooltip = document.createElement("div");
        tooltip.className = "pie-chart-tooltip";
        tooltip.style.position = "absolute";
        tooltip.style.display = "none";
        tooltip.style.backgroundColor = "rgba(0,0,0,0.7)";
        tooltip.style.color = "#fff";
        tooltip.style.padding = "5px 10px";
        tooltip.style.borderRadius = "3px";
        tooltip.style.fontSize = "12px";
        tooltip.style.pointerEvents = "none";
        tooltip.style.zIndex = "1000";
        tooltip.style.transition = "opacity 0.3s";
        document.body.appendChild(tooltip);
        tooltipRef.current = tooltip;
      }
  
      let listTotal = data.reduce((sum, item) => sum + item.value, 0);
      let offset = 0;
  

  
      // Clear previous elements
      pieElement.innerHTML = '';
  
      data.forEach((item, index) => {
        const sliceSize = (item.value / listTotal) * 360;
        const sliceID = `slice-${index}`;
        const color = colors[index % colors.length];
  
        // Create Slice Element
        const slice = document.createElement("div");
        slice.className = `slice ${sliceID}`;
        slice.style.position = "absolute";
        slice.style.width = "200px";
        slice.style.height = "200px";
        slice.style.clip = "rect(0px, 200px, 200px, 100px)";
        slice.style.transform = `rotate(${offset}deg) translate3d(0,0,0)`;
        
        // Store data attributes for hover
        slice.dataset.label = item.label;
        slice.dataset.value = item.value;
        slice.dataset.color = color;
  
        const span = document.createElement("span");
        span.style.display = "block";
        span.style.position = "absolute";
        span.style.top = "0";
        span.style.left = "0";
        span.style.backgroundColor = color;
        span.style.width = "200px";
        span.style.height = "200px";
        span.style.borderRadius = "50%";
        span.style.clip = "rect(0px, 200px, 200px, 100px)";
        span.style.transform = `rotate(${sliceSize - 179}deg) translate3d(0,0,0)`;
  
        // Add hover events
        slice.addEventListener('mouseenter', (e) => {
          const tooltip = tooltipRef.current;
          tooltip.innerHTML = `<strong>${slice.dataset.label}</strong>: ${slice.dataset.value}`;
          tooltip.style.display = 'block';
          span.style.opacity = '0.8'; // Highlight effect
        });
  
        slice.addEventListener('mousemove', (e) => {
          const tooltip = tooltipRef.current;
          tooltip.style.top = `${e.pageY - 30}px`;
          tooltip.style.left = `${e.pageX + 10}px`;
        });
  
        slice.addEventListener('mouseleave', () => {
          const tooltip = tooltipRef.current;
          tooltip.style.display = 'none';
          span.style.opacity = '1'; // Remove highlight
        });
  
        slice.appendChild(span);
        pieElement.appendChild(slice);
  
        offset += sliceSize;
      });
  
      // Clean up tooltip on unmount
      return () => {
        if (tooltipRef.current) {
          document.body.removeChild(tooltipRef.current);
          tooltipRef.current = null;
        }
      };
    }, [data]);
  
    return (
      <div className="pie-chart--wrapper">
        <div className="pie-chart" ref={chartRef}></div>
        {/* Optional: Keep the legend but make it minimal
        <div className="pie-chart__legend">
          {data.map((item, index) => (
            <span 
              key={index} 
              style={{ 
                backgroundColor: colors[index % colors.length],
                display: 'inline-block',
                width: '10px',
                height: '10px',
                margin: '0 5px',
                borderRadius: '50%'
              }} 
            />
          ))} */}
        {/* </div> */}
      </div>
    );
  };
  
  export default PieChart;