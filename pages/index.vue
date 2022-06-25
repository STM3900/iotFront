<template>
  <div>
    <h1 class="disable-select">Iot Graph</h1>
    <article v-if="getStatus == 'ok'" class="graphs">
      <section
        v-for="(graph, index) in createDataListTab(getApiData)"
        :key="index"
        :style="{ animationDelay: `${0.1 * index + 0.5}s` }"
      >
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
            :options="insertMinMaxY(index, graph)"
          />
          <LineChart
            v-else
            class="graph-chart"
            :chartData="graph"
            :options="insertMinMaxY(index, graph)"
          />
        </client-only>
      </section>
    </article>
    <article class="container loading" v-if="getStatus == 'loading'">
      <img src="~/assets/img/loading.gif" />
      <p v-if="!getApiResponse">Chargement des données</p>
    </article>
    <article class="container error" v-if="getStatus == 'error'">
      <fa class="error-icon" :icon="['fas', 'xmark']" />
      <p>Erreur : La connexion à l'API n'a pu être établie</p>
    </article>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
  computed: {
    ...mapGetters(["getApiResponse", "getStatus", "getApiData"]),
  },
  mounted() {
    Chart.Legend.prototype.afterFit = function () {
      this.height = this.height + 10;
    };

    this.getAllData();
  },
  methods: {
    ...mapActions(["getAllData"]),
    createDataListTab(jsonData) {
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
        jsonData.allData[0].deviceData
      ).length;

      for (let i = 0; i < dataItemLength; i++) {
        dataItemFinal.push([]);
      }

      for (let i = 0; i < jsonData.allData.length; i++) {
        const item = jsonData.allData[i];
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

      return dataItemFinal;
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
      });

      chartData.labels = dataLabels;
      chartData.datasets = datasets;

      return chartData;
    },
    insertMinMaxY(index, graph) {
      let finalTab = JSON.parse(JSON.stringify(this.chartOptions));
      let dataTab = [];

      for (let i = 0; i < graph.datasets.length; i++) {
        for (let j = 0; j < graph.datasets[i].data.length; j++) {
          dataTab.push(graph.datasets[i].data[j]);
        }
      }

      if (typeof graph.datasets[0].data[0] == "boolean") {
        finalTab.scales.yAxes[0].ticks.display = false;
      } else {
        finalTab.scales.yAxes[0].ticks.min = Math.round(Math.min(...dataTab));
        finalTab.scales.yAxes[0].ticks.max =
          Math.ceil(Math.max(...dataTab) / 10) * 10;
      }

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

  transition: 0.3s;
  transform: translateY(-5px);
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
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

.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  gap: 10px 10px;

  transition: 0.3s;
  transform: translateY(-5px);
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

.container p {
  margin: 0;
  font-size: 16px;
  color: rgb(100, 100, 100);
}

.loading img {
  width: 75px;
}

.loading p {
  transition: 0.3s;
  opacity: 0;
  animation: loading 1.5s ease infinite;
  margin-top: -15px;
}

.error .error-icon {
  margin-top: 15px;
  color: #f94144;
  font-size: 25px;
}

@keyframes fadeIn {
  0% {
    transform: translateY(-5px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}

@keyframes loading {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
