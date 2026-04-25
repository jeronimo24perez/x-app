import {RxAvatar} from "react-icons/rx";
import { FaSearch} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import {CgClose, CgMoreO} from "react-icons/cg";
import {  MdHomeFilled, MdPerson, MdPersonAdd } from "react-icons/md";

import {logoutChain} from "../state/authSlice.tsx";
import { logout} from "../state/userSlice.ts";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {useNavigate} from "react-router";
const Nav = ()=>{
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const profile = useSelector((state: RootState) => state.profile);
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    return(
        <nav>

            <ul>

                <div className="logo-nav">
                    <FaXTwitter className={'x-navigation-logo'} />
                </div>
                <li><MdHomeFilled /> Inicio</li>
                <li> <FaSearch /> Explorar</li>
                <li><MdPersonAdd /> seguir</li>
                <li><MdPerson /> perfil</li>
                <li> <CgMoreO /> mas</li>
                <button className={"button-rounded fw-bold"}>Post</button>
                <div className="logout-container" onClick={()=>{
                    setIsOpen(true);
                }}>
                    <div className="avatar-nav">
                        <RxAvatar className="avatar-icon" />
                    </div>
                    <p className="username-nav">{profile.user.username}</p>
                    <p className="email-nav">@{profile.user.email?.split('@')[0]}</p>

                </div>
                <div className={isOpen? "logout-submenu ": "logout-submenu submenu-disabled"}  >
                    <p className={"cursor-pointer"} onClick={()=>{
                        dispatch(logout())
                        dispatch(logoutChain())
                        navigate('/')
                    }}>Cerrar Sesion</p><div className="session-alert-close" onClick={()=> setIsOpen(false)}><CgClose /></div>
                </div>
            </ul>
        </nav>
    )
}

export default Nav;