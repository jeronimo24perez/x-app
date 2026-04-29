import {CgClose} from "react-icons/cg";
import {useNavigate} from "react-router";
import {type ChangeEvent, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../state/store.tsx";
import '../styles/modalCompose.css';
import '../styles/editModal.css';
import {editUser} from "../state/userSlice.ts";
const EditProfileModal = () => {
    const navigate = useNavigate();
    const profile = useSelector((state: RootState) => state.profile.user);
    const auth = useSelector((state:RootState)=> state.auth)
    const dispatch:AppDispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        dispatch(editUser({
            _id: auth.id,
            username: formData.username,
            bio: formData.bio,
            website: formData.website,
            location: formData.location,
            date: "",
            email: "",
            followers: 0,
            follows: 0

        }))
        navigate(-1);
    };

    return (
        <div className={"modal-compose-background "} onClick={() => navigate(-1)}>
            <div className="modal-compose" onClick={(e) => e.stopPropagation()}>
                <div className="modal-compose-header edit-header" >
                    <div className="modal-compose-close">
                        <button className="close" onClick={() => navigate(-1)}>
                            <CgClose size={18} />
                        </button>
                    </div>
                    <h4>Editar perfil</h4>
                    <button 
                        className="button-rounded post-button edit-button"
                        onClick={handleSubmit}
                    >
                        Guardar
                    </button>
                </div>
                
                <div className="modal-compose-content edit-modal" >
                    <form >
                        <div className="input-group" >
                            <input
                                type="text" 
                                name="username"
                                placeholder="Nombre"
                                value={formData.username} 
                                onChange={handleChange}

                            />
                        </div>

                        <div className="input-group" >
                            <textarea
                                placeholder="Bio"
                                name="bio" 
                                value={formData.bio} 
                                className={"bio-edit"} onChange={handleChange}
                            />
                        </div>

                        <div className="input-group" >
                            <input
                                type="text" 
                                name="location"
                                placeholder="Ubicacion"
                                value={formData.location} 
                                onChange={handleChange}

                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="text" 
                                name="website"
                                placeholder="Sitio web"
                                value={formData.website} 
                                onChange={handleChange}

                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
