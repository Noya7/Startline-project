import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import classes from './StatsWidget.module.css';

const chartData = {
  labels: ['pacientes', 'Compañeros'],
  datasets: [
    {
      backgroundColor: ['#0088A3','#990033'],
    },
  ],
};

const StatsWidget = ({ data, options }) => {
  chartData.datasets[0].data = data;

  return (
    <div className={classes.main}>
      <span className={classes.text}>
        <h2>Revisiones del ultimo mes:</h2>
      </span>
      <div className={classes.chart}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StatsWidget;