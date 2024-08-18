import Info from '../components/homeSlides/Info';
import HOME_SLIDER_TEXT from '../assets/text/home';
import { Outlet, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import useResponseToast from '../hooks/useResponseToast';
import BootModal from '../components/boot/BootModal';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'

const {INFO} = HOME_SLIDER_TEXT;

const Home = () => {
    const [serverIsUp, setServerIsUp] = useState(true)
    const errorData = useLoaderData();

    useEffect(() => {
        const serverCheck = async () => {
            try {
                let response = await fetch(import.meta.env.VITE_API_URL + '/boot');
                Cookies.set("isServerUp", response.ok, {expires: 0.25});
                setServerIsUp(true);
            } catch (error) {
                toast.error('Ocurrió un error al intentar alcanzar el servidor. Por favor, reporta este error a mi correo electronico.');
                Cookies.set("isServerUp", false, {expires: 0.25})
            }
        }; 
        if (Cookies.get('isServerUp') !== 'true') setServerIsUp(false); serverCheck();
    }, []);

    useResponseToast({error: {message: errorData}})
    return(
        <>
            {<Outlet />}
            {!serverIsUp && <BootModal/>}
            <Info backgroundImage={INFO.backgroundImage} title={INFO.title} description={INFO.description} buttonText={INFO.buttonText} buttonLink={INFO.buttonLink} />
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