import {FaXTwitter} from "react-icons/fa6";
import {useState, type MouseEvent, type ChangeEvent, useEffect} from "react";
import DatePicker from "../components/datePicker.tsx";
import {CgClose} from "react-icons/cg";
import {useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState} from "../state/store.tsx";
import {register} from "../state/authSlice.tsx";
import {useNavigate} from "react-router";
interface form{
    name: string,
    email: string,
    password: string,
}
const Register = ()=>{
    //redux state
    const dispatch = useDispatch<AppDispatch>();
   const post = useSelector((state: RootState) => state.auth)

    //state local
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [year, setYear] = useState("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [next, setNext] = useState<boolean>(false);
    const [form, setForm] = useState<form>({
        name: "",
        email: "",
        password: "",
    })
    const [clicked, setClicked] = useState(false);

    const navigate = useNavigate();
    //redirect
    useEffect(() => {
        if(post.registed === true){
            navigate("/feed");
        }
    }, [navigate, post.registed]);
    //handlers
    function HandleOverlay(event: MouseEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>){
        event.preventDefault()
        setIsOpen(false);
    }
    function HandleModal(event: MouseEvent<HTMLButtonElement>){
        event.preventDefault()
        setIsOpen(true)
    }
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setForm({...form, [e.target.id]: e.target.value});
    }

    //conditionals
    const isActive: boolean = form.email.includes('@') && form.email.includes('.') && form.name.length >4;
    const isDate: boolean= month.length >0 && day.length > 0 && year.length > 0;
    const isPassword: boolean = form.password.length >= 8;
    const passLength: boolean = form.password.length > 0 ;
    return (
    <>
        <button className="button-rounded register-button create-account-button-form" onClick={HandleModal} >
            Crear Cuenta
        </button>
        <div className={isOpen? "modal-overlay": "modal-overlay disabled" } >
            <div className="register-form form-generic-container"  >
                {next? <>
                    <form className="form">
                        <div className="title-register-form title-form">
                            <FaXTwitter className="form-logo" />
                        </div>
                        <button className="close" onClick={HandleOverlay}> <CgClose size={18} /> </button>
                        <h2>Crea una contrasena</h2>
                        <p className="text-grey">Asegurate que tenga 8 caracteres o mas</p>

                        <div className="input-group">
                            <input type="password" className={isPassword? "": "invalid"} value={form.password} id="password" onChange={handleChange} placeholder="" required />
                            <label>Contrasena</label>
                        </div>
                        {
                            passLength? <>
                                {isPassword? <></>:<p className="text-red fw-small">Debe contener 8 caracteres o mas</p>}
                            </>:<></>
                        }
                        <p className="terms-and-conditions w-100 text-grey">Al registrarte, aceptas los Términos de servicio y la Política de privacidad, incluida la política de Uso de cookies. X puede usar tu información de contacto, como tu dirección de correo electrónico y tu número de teléfono, con los fines descritos en nuestra Política de privacidad, por ejemplo, para mantener tu cuenta segura y personalizar nuestros servicios, incluidos los anuncios. Más información. Otras personas podrán encontrarte por tu correo electrónico o número de teléfono, si los proporcionaste, a menos que elijas otra opción aquí.</p>
                        {post.detail? <p className="post-detail text-red fw-small">{post.detail}</p>: <> </> }
                        <button className={isPassword?"button-rounded button-next-form-active button-next-form w-80" :"button-rounded button-next-form w-80"}onClick={(e)=>{
                            e.preventDefault();
                            if (clicked) return; // 🚫 bloquea siguientes clicks

                            setClicked(true);

                            dispatch(register({
                                "email": form.email,
                                "password":form.password,
                                "username": form.name,
                                "date": `${day}/${month}/${year}`
                            }))




                        }} >Crear cuenta</button>
                    </form>
                    </>:
                    <form className="register-form form">

                        <div className="title-register-form title-form">
                            <FaXTwitter className="form-logo" />
                        </div>
                        <button className="close " onClick={HandleOverlay}> <CgClose size={18} /> </button>

                        <h2>Crea tu cuenta</h2>
                        <div className="input-group">
                            <input type="text" value={form.name} id="name"  onChange={handleChange} placeholder="" required />
                            <label>nombre</label>

                        </div>
                        <div className="input-group last-input">
                            <input type="email" value={form.email} id="email" className={isActive?"valid": "invalid"} onChange={handleChange} placeholder="" required />
                            <label>email</label>

                        </div>
                        { form.email.length > 1 && form.name.length >1? <>
                            {isActive ? <></>: <p className="form-advise">El nombre debe tener mas de 4 caracteres o el email que introduciste es invalido</p>}
                        </>: <></>}
                        {/*date picker */}
                        <DatePicker
                            month={month}
                            day={day}
                            year={year}
                            onChange={(field, value) => {
                                if (field === "month") setMonth(value);
                                if (field === "day") setDay(value);
                                if (field === "year") setYear(value);
                            }}
                        />
                        <button className={isActive && isDate?"button-rounded button-next-form-active": "button-rounded button-next-form " } onClick={(e)=>{
                            e.preventDefault();
                            if (isActive&& isDate) {
                                setNext(true)
                            }
                        }} >Siguiente</button>
                    </form>
                }

            </div>
        </div>
    </>
)
}

export default Register;