import { RxAvatar } from "react-icons/rx";
import type User from "../models/user";
import FollowButton from "../features/followButton";
import {useSelector} from "react-redux";
import type {RootState} from "../state/store.tsx";
import {useNavigate} from "react-router";

const UserListed = ({ item }: { item: User  }) => {
    const auth = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate();
    return(
    <div className="following-list" >
        <div onClick={()=>{

            if(item._id === auth.id){
                navigate(`/profile/${item._id}`)
            }else{
                navigate(`/${item._id}`)
            }
        }} className="following-item">
            <div className="following-header-list">
                <div className="avatar avatar-list">
                    <RxAvatar className="avatar-icon" />
                </div>
                <p>{item.username}</p>
                 <FollowButton idToFollow={item._id || ""}  />
                <p className="email-following text-grey fw-small">@{item.email.split('@')[0]}</p>
                <div></div>
                <div></div>

                <p>{item.bio}</p>

            </div>

        </div>
    </div>
    )
}
export default UserListed;