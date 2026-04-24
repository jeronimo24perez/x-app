import {type ChangeEvent, type MouseEvent, useEffect, useRef, useState} from "react";
import {FaRegEyeSlash, FaXTwitter} from "react-icons/fa6";
import {CgClose} from "react-icons/cg";
import {FaRegEye} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {loginStepOne} from "../state/authSlice.tsx";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {useNavigate} from "react-router";
import GoogleAuth from "../components/googleAuth.tsx";
interface loginForm{
    email: string,
    password: string,
}

export const Login = ()=>{

    const dispatch = useDispatch<AppDispatch>();
    const [isOpen ,setIsOpen] = useState<boolean>(false)
    const [showPassword,setShowPassword] = useState<boolean>(false)
    const [form, setForm] = useState<loginForm>({
        email: "",
        password: ""
    })
    const user = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate();
    function HandleModal(event: MouseEvent<HTMLButtonElement>){
        event.preventDefault()
        setIsOpen(true)
    }
    function HandleOverlay(event: MouseEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>){
        event.preventDefault()
        setIsOpen(false);
    }
    function handleChange(event: ChangeEvent<HTMLInputElement>){
        setForm({...form, [event.target.id]: event.target.value})
    }
    function handleSubmit(event: MouseEvent<HTMLButtonElement>){
        event.preventDefault()
        dispatch(loginStepOne({
            email: form.email,
            password: form.password
        }))
        //   navigate('/feed')
    }
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if(user.auth === true){
            navigate('/feed')
            localStorage.setItem("id", user.id?? "" )
        }
    }, [navigate, user]);
    const emailValid:boolean = form.email.length > 8 && form.email.includes('@') && form.email.includes('.');
    const passwordValid: boolean = form.password.length >= 8;
    return (
        <>
            <button className="button-rounded  button-account" onClick={HandleModal}>Iniciar Sesion</button>
            <div className={isOpen? "modal-overlay": "modal-overlay disabled" } >
                <div className="login-form form-generic-container"  >
                    <form className="form  login-form-x">
                        <div className="title-register-formtitle-form">
                            <FaXTwitter className="form-logo" />
                        </div>
                        <button className="close" onClick={HandleOverlay}> <CgClose size={18} /> </button>
                        <h2>Inicia Sesion en X</h2>
                        <GoogleAuth />

                        <div className="separator separator-login">
                            <div className="divider"></div> O <div className={"divider"}></div>
                        </div>
                        <div className="input-group">
                            <input type="email" value={form.email} id="email" onChange={handleChange} className={""} placeholder="" required/>
                            <label>Email</label>
                        </div>
                        <div className="input-group">
                            {showPassword? <input type="text" value={form.password} onChange={handleChange} id="password" className={""} placeholder="" required/>:  <input type="password" value={form.password} onChange={handleChange} id="password" className={""} placeholder="" required/> }
                            <label >Contrasena </label>
                            {showPassword? <FaRegEyeSlash className="password-changer cursor-pointer" onClick={()=> setShowPassword(false)} /> : <FaRegEye className="password-changer cursor-pointer" onClick={()=> setShowPassword(true)} />}
                        </div>
                        {form.password.length > 0 && form.email.length > 0? <>
                            { emailValid && passwordValid? <></>: <p className="text-red fw-small">Completa bien los campos</p>  }
                        </>:<> </>}

                        <button className={emailValid && passwordValid?"button-rounded bg-white button-next-form-active": "button-rounded bg-white button-next-form"} onClick={handleSubmit}>Iniciar Sesion</button>
                        <p className="change-form fw-small">Ya tienes Cuenta? <a className="link-terms cursor-pointer">Registrate</a></p>
                    </form>
                </div>
            </div>
        </>
    )
}

