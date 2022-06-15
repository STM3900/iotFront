<script>
import { Bar } from "vue-chartjs";

export default {
  name: "LineChart",
  mixins: [Bar],
  props: ["chartData", "options"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
