import TextBox from '../components/TextBox';
import classes from './Home.module.css';

const Home = () => {
    return(
        <div className={classes.layout}>
            <div className={classes.grid}>
                <TextBox />
            </div>
        </div>
    )
}

export default Home;