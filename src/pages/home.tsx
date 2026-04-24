import '../styles/home.css'
import {FaXTwitter} from "react-icons/fa6";
import Register from "../features/register.tsx";
import {Login} from "../features/login.tsx";
import GoogleAuth from "../components/googleAuth.tsx";
import { useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {cacheReader} from "../state/authSlice.tsx";
import {useNavigate} from "react-router";
const Home = ()=>{
    const state = useSelector((state: RootState) => state.auth);
    const dispatch:AppDispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        const id: string | null = localStorage.getItem("id");

        if(id){
            dispatch(cacheReader({
                id: id,
                auth: true
            }))
            navigate('/feed')
        }

    },[dispatch, navigate, state])
    return (
        <>
            <main className="home">
                <div className="home-x-container">
                    <FaXTwitter color={"white"} className={"x-home"} />
                </div>
                <div className="form-container">
                    <div className="form-pre-login">
                        <h2 className="title-home">Lo que está <br /> pasando ahora</h2>
                        <h3 className="text-secondary-home mb-3">Únete Hoy</h3>
                        <GoogleAuth />

                        <div className="separator">
                            <div className="divider"></div> O <div className={"divider"}></div>
                        </div>
                        <Register />
                        <p className="terms-and-conditions">
                            Al registrarte, aceptas los <a href="#" className="link-terms"> Términos de servicio</a> y la <a href="#" className="link-terms"> Política de privacidad</a>, incluida la política de <a href="#" className="link-terms"> Uso de Cookies.</a>
                        </p>
                    </div>
                </div>
                <div>
                </div>
                <div className="login-container">
                    <Login />
                    <button className="button-rounded button-grok">Obten superGrok</button>
                </div>
                <div className="column-2">
                    <p>Información
                        |
                        Descarga la app de X
                        |
                        Grok
                        |
                        Centro de Ayuda
                        |
                        Condiciones de Servicio
                        |
                        Política de Privacidad
                        |
                        Política de cookies
                        |
                        Accesibilidad
                        |
                        Información de anuncios
                        |
                        Blog
                        |
                        Empleos
                        |
                        Recursos para marcas
                        |
                        Publicidad
                        |
                        Marketing
                        |
                        X para empresas
                        |
                        Desarrolladores
                        |
                        Noticias
                        |
                        Configuración
                        |
                        © 2026 X Corp.</p>
                </div>
            </main>
        </>
    )
}

export default Home;