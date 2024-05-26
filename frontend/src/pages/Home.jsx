import Info from '../components/homeSlides/Info';
import HOME_SLIDER_TEXT from '../assets/text/home';
import { Outlet, useLoaderData } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useResponseToast from '../hooks/useResponseToast';

const {INFO} = HOME_SLIDER_TEXT;

const Home = () => {
    const errorData = useLoaderData();
    useResponseToast({error: {message: errorData}})
    return(
        <>
            <Outlet />
            <Info backgroundImage={INFO.backgroundImage} title={INFO.title} description={INFO.description} buttonText={INFO.buttonText} buttonLink={INFO.buttonLink} />
            <ToastContainer />
        </>
    )
}

export default Home;

export const HomeLoader = ({request}) => {
    const url = new URL(request.url);
    const err = url.searchParams.get('err')
    if (err) return err;
    return null;
}