import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import classes from './StatsWidget.module.css';
import { useSelector } from 'react-redux';

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'right', },
    layout: { paddingLeft: 10 },
    title: {
      display: true,
      font: { size: 20 },
      text: 'Revisiones del ultimo mes',
    }
  },
};

const StatsWidget = () => {
  let data = useSelector(state => state.medic.statistics);
  data = !!data?.length && Object.values(data);

  const chartData = {
    labels: ["1 estrella","2 estrella","3 estrella","4 estrella","5 estrella"],
    datasets: [
      {
        data,
        backgroundColor: ['#5F021F','#005566','#003066','#0088A3','#990033'],
      },
    ],
  };

  return (
    <div className={classes.main}>
      {data && data.length > 0 ? (
        <Pie options={chartOptions} data={chartData} redraw />
      ) : (
        <h2>No hay suficientes datos para generar un grafico de estadisticas.</h2>
      )}
    </div>
  );
};

export default StatsWidget;