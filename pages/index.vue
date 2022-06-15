<template>
  <div class="container">
    <h1 class="disable-select">Iot Temp Graph</h1>
    <article class="graphs">
      <section v-for="(graph, index) in allDataTab" :key="index">
        <h2 class="disable-select">
          <fa
            class="graph-icon"
            :icon="dataIcons[index]"
            :style="{ color: graph.datasets[0].backgroundColor }"
          />
          {{ dataTitles[index] }}
        </h2>
        <client-only>
          <BarChart
            v-if="dataTitles[index] == 'Alerte Surchauffe'"
            class="graph-chart"
            :chartData="graph"
            :options="insertMinMaxY(index)"
          />
          <LineChart
            v-else
            class="graph-chart"
            :chartData="graph"
            :options="insertMinMaxY(index)"
          />
        </client-only>
      </section>
    </article>
  </div>
</template>

<script>
import MASTER_JSON from "~/assets/json/dataTestIot";

export default {
  data() {
    return {
      dataJson: MASTER_JSON,
      allDataTab: [],

      dataIcons: [
        "temperature-half",
        "droplet",
        "wind",
        "sun",
        "battery-three-quarters",
        "triangle-exclamation",
      ],
      dataTitles: [
        "Température",
        "Humidité",
        "Pression de l'air",
        "Niveau de lumière",
        "Niveau de batterie",
        "Alerte Surchauffe",
      ],
      dataMinMax: [
        { min: undefined, max: 30 },
        { min: 0, max: 100 },
        { min: 1020, max: 1028 },
        { min: 200, max: 280 },
        { min: 0, max: 100 },
        { min: 0, max: 1 },
      ],

      chartOptions: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          align: "start",
          labels: {
            usePointStyle: true,
          },
        },
        scales: {
          yAxes: [
            {
              display: true,
              stacked: false,
              ticks: {
                suggestedMin: 0,
                min: 0,
                max: 1,
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    Chart.Legend.prototype.afterFit = function () {
      this.height = this.height + 10;
    };

    this.createDataListTab();
  },
  methods: {
    createDataListTab() {
      const dataColors = [
        ["hsl(0, 70%, 75%)", "hsl(10, 70%, 75%)", "hsl(20, 70%, 75%)"],
        ["hsl(200, 70%, 75%)", "hsl(210, 70%, 75%)", "hsl(220, 70%, 75%)"],
        ["hsl(100, 70%, 75%)", "hsl(110, 70%, 75%)", "hsl(120, 70%, 75%)"],
        ["hsl(60, 70%, 75%)", "hsl(70, 70%, 75%)", "hsl(80, 70%, 75%)"],
        ["hsl(40, 70%, 75%)", "hsl(50, 70%, 75%)", "hsl(60, 70%, 75%)"],
        ["hsl(10, 70%, 75%)", "hsl(20, 70%, 75%)", "hsl(30, 70%, 75%)"],
      ];

      const dataItemFinal = [];
      const dataItemLength = Object.entries(
        this.dataJson.allData[0].deviceData
      ).length;

      for (let i = 0; i < dataItemLength; i++) {
        dataItemFinal.push([]);
      }

      for (let i = 0; i < this.dataJson.allData.length; i++) {
        const item = this.dataJson.allData[i];
        const dataItem = Object.entries(item.deviceData);

        for (let j = 0; j < dataItem.length; j++) {
          dataItemFinal[j].push(
            this.generateGraphObj(
              dataItem[j][1],
              item.deviceName,
              dataColors[j][i]
            )
          );
        }
      }

      for (let i = 0; i < dataItemFinal.length; i++) {
        let datasetTab = dataItemFinal[i][0];

        for (let j = 1; j < dataItemFinal[i].length; j++) {
          datasetTab.datasets.push(dataItemFinal[i][j].datasets[0]);
        }

        dataItemFinal[i] = datasetTab;
      }

      this.allDataTab = dataItemFinal;
    },
    generateGraphObj(jsonData, label, color) {
      const chartData = {};
      const datasets = [];

      const dataLabels = [];
      const dataValues = [];

      for (let i = 0; i < jsonData.length; i++) {
        dataLabels.push(jsonData[i].date);
        dataValues.push(jsonData[i].value);
      }

      datasets.push({
        label: label,
        backgroundColor: color,
        data: dataValues,
        // fill: false,
      });

      chartData.labels = dataLabels;
      chartData.datasets = datasets;

      return chartData;
    },
    insertMinMaxY(index) {
      let finalTab = JSON.parse(JSON.stringify(this.chartOptions));

      finalTab.scales.yAxes[0].ticks.min = this.dataMinMax[index].min;
      finalTab.scales.yAxes[0].ticks.max = this.dataMinMax[index].max;

      return finalTab;
    },
  },
};
</script>

<style scoped>
.graphs {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;

  flex-wrap: wrap;
  width: 100%;
  gap: 10px;
}

.graphs section {
  width: 49%;
}

.graphs h2 {
  font-size: 22px;
  color: rgb(50, 50, 50);
}

.graph-icon {
  margin-right: 5px;
}

.graph-chart {
  height: 275px;
}
</style>
