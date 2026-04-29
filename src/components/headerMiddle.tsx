import { useNavigate } from "react-router";
import {IoArrowBackOutline} from "react-icons/io5";
interface HeaderProps{
    headerText: string,
    subheaderText?: string
}
const HeaderMiddle = ({headerText,  subheaderText}:HeaderProps)=>{
    const navigate = useNavigate();

    const handleBack = () => {
            navigate(-1);

    };

    return(
        <div className="header go-back ">
            <button className="p-1" onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IoArrowBackOutline className="arrow-icon" />
            </button>
            <h3>{headerText}</h3>
            {subheaderText? <div></div>: null}
            <p className="text-grey fw-small">{subheaderText}</p>
        </div>
    )
}

export default HeaderMiddle;