<template>
  <div class="container">
    <h1>Iot Temp Graph</h1>
    <article class="graphs">
      <section v-for="(graph, index) in allDataTab" :key="index">
        <h2>
          <fa
            class="graph-icon"
            :icon="dataIcons[index]"
            :style="{ color: graph.datasets[0].backgroundColor }"
          />
          {{ graph.datasets[0].label }}
        </h2>
        <client-only>
          <BarChart
            v-if="graph.datasets[0].label == 'Historique alerte surchauffe'"
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
          display: false,
        },
        scales: {
          yAxes: [
            {
              display: true,
              stacked: true,
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
    this.createDataListTab();
  },
  methods: {
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
      });

      chartData.labels = dataLabels;
      chartData.datasets = datasets;

      return chartData;
    },
    createDataListTab() {
      const dataLabels = [
        "Température",
        "Humidité",
        "Pression de l'air",
        "Niveau de lumière",
        "Niveau de batterie",
        "Historique alerte surchauffe",
      ];

      const dataColors = [
        "hsl(0, 70%, 75%)",
        "hsl(200, 70%, 75%)",
        "hsl(100, 70%, 75%)",
        "hsl(60, 70%, 75%)",
        "hsl(40, 70%, 75%)",
        "hsl(10, 70%, 75%)",
      ];

      const data = Object.entries(this.dataJson.allData[0].deviceData);
      const dataLength = data.length;

      for (let i = 0; i < dataLength; i++) {
        this.allDataTab.push(
          this.generateGraphObj(data[i][1], dataLabels[i], dataColors[i])
        );
      }

      //console.log(this.allDataTab);
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
  height: 250px;
}
</style>
