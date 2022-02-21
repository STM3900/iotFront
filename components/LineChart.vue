<script>
import { Line } from "vue-chartjs";

export default {
  name: "LineChart",
  mixins: [Line],
  props: ["chartData", "options"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
