import '../styles/home.css'
import {FaXTwitter} from "react-icons/fa6";
import {GrApple} from "react-icons/gr";
import Register from "../features/register.tsx";
import {Login} from "../features/login.tsx";
import {GoogleLogin} from "@react-oauth/google";
import {useNavigate} from "react-router";
const Home = ()=>{

    const navigate = useNavigate();
    return (
        <>
            <main className="home">
                <div className="home-x-container">
                    <FaXTwitter color={"white"} className={"x-home"} />
                </div>
                <div className="form-container">
                    <div className="form-pre-login">
                        <h2 className="title-home">Lo que está <br /> pasando ahora</h2>
                        <h3 className="text-secondary-home">Únete Hoy</h3>
                            <GoogleLogin width={300} shape={"circle"} onSuccess={(s)=>{
                                fetch('https://x-backend-ruddy.vercel.app/auth/google', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        token: s.credential
                                    })
                                }).then(r => r.json()).then(m => console.log(m))

                                navigate('/feed')
                                console.log(s)
                            }}  onError={()=> console.log('err')} />

                        <button className="button-rounded register-button apple-button">
                            <GrApple className=" register-icon" />
                            Registrarse Con Apple
                        </button>
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