import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
          beginAtZero: true,
        },
      },
    ],
  },
};
function LineGraph() {
  const [data, setData] = useState({});
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
      .then((response) => response.json())
      .then((data) => {
        const chartData = bildChartDAta(data);
        console.log(chartData);
        setData(chartData);
      });
  }, []);
  const bildChartDAta = (data, caseType = "cases") => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[caseType][date] - lastDataPoint,
        };

        chartData.push(newDataPoint);
      }
      lastDataPoint = data[caseType][date];
    }
    return chartData;
  };
  console.log(data);
  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
                label: "number of cases",
                fill: {
                  target: "origin",
                  above: "rgba(204, 16, 52, 0.5)", // Area will be red above the origin
                },
              },
            ],
          }}
          options={options}
        ></Line>
      )}
    </div>
  );
}

export default LineGraph;
