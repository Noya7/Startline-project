import Info from '../components/homeSlides/Info';
import Slider from '../components/layout/slider/Slider';
import HOME_SLIDER_TEXT from '../assets/text/home';

const {INFO} = HOME_SLIDER_TEXT;

const Home = () => {
    return(
        <Slider>
            <Info backgroundImage={INFO.backgroundImage} title={INFO.title} description={INFO.description} buttonText={INFO.buttonText} buttonLink={INFO.buttonLink} />
            
        </Slider>
    )
}

export default Home;