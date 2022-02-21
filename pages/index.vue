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
          <LineChart
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
import MASTER_JSON from "~/assets/json/dataTest";

export default {
  data() {
    return {
      dataJson: MASTER_JSON,
      allDataTab: [],
      dataIcons: ["temperature-half", "droplet", "wind", "sun"],
      dataMinMax: [
        { min: undefined, max: 30 },
        { min: 0, max: 100 },
        { min: 1020, max: 1028 },
        { min: 200, max: 280 },
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
    // this.setMaxGraphValues();
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
      ];

      const dataColors = [
        "hsl(0, 70%, 75%)",
        "hsl(200, 70%, 75%)",
        "hsl(100, 70%, 75%)",
        "hsl(60, 70%, 75%)",
      ];

      for (let i = 0; i < Object.entries(this.dataJson).length; i++) {
        this.allDataTab.push(
          this.generateGraphObj(
            Object.entries(this.dataJson)[i][1],
            dataLabels[i],
            dataColors[i]
          )
        );
      }
    },
    insertMinMaxY(index) {
      let finalTab = JSON.parse(JSON.stringify(this.chartOptions));

      finalTab.scales.yAxes[0].ticks.min = this.dataMinMax[index].min;
      finalTab.scales.yAxes[0].ticks.max = this.dataMinMax[index].max;

      return finalTab;
    },
    /*
    setMaxGraphValues() {
      for (let i = 0; i < this.dataMinMax.length; i++) {
        const maxValue = Math.max(...this.allDataTab[i].datasets[0].data);
        this.dataMinMax[i].max = maxValue + 10;
      }
    },
    */
  },
};
</script>

<style scoped>
body {
  color: #35bfe9;
}

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
}

.graph-icon {
  margin-right: 5px;
}

.graph-chart {
  height: 250px;
}
</style>
