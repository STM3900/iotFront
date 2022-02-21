<template>
  <div class="container">
    <h1>Iot Temp Graph</h1>
    <client-only>
      <LineChart :chartData="chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartData: {
        labels: [
          "21/02/2022",
          "22/02/2022",
          "23/02/2022",
          "24/02/2022",
          "25/02/2022",
          "26/02/2022",
          "27/02/2022",
        ],
        datasets: [
          {
            label: "Température",
            backgroundColor: "#35bfe9",
            data: [25, 24, 23, 32, 18, 13, 20],
          },
        ],
      },
      chartOptions: {
        maintainAspectRatio: false,
        responsive: true,
      },
    };
  },
};
</script>

<style scoped>
body {
  color: #35bfe9;
}
</style>
