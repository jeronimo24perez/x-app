import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../state/store";
import { getUser } from "../state/userSlice";
import { followAction, getMyFollows, unfollowAction } from "../state/follows";
import type User from "../models/user";

interface stateProps {
    setInfo?: React.Dispatch<React.SetStateAction<User | null>>
    idToFollow: string
}
const FollowButton = ({setInfo, idToFollow}: stateProps)=>{
    const targetId = idToFollow  || ""
    const dispatch:AppDispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const follows = useSelector((state: RootState) => state.follows);
    const [effectFollow, setEffectFollow] = useState<string>("Siguiendo")
    useEffect(()=>{
       if(auth.id){
                  dispatch(getUser({id: auth.id}))
                  dispatch(getMyFollows(auth.id))
              }
    }, [auth.id, dispatch])
    return(
        <>
         {follows.followeds.find(e => e.followedId === targetId && e.followerId === auth.id)?
        <button className="button-rounded follow-profile unfollow-button following" onMouseOver={()=>{
            setEffectFollow("Dejar de seguir")
        }} onMouseOut={()=>{
            setEffectFollow("siguiendo")
        }}
        onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            dispatch(unfollowAction({
                followerId: auth.id || "",
                followedId: targetId
            })).unwrap().then(() => {
                dispatch(getUser({id: auth.id}))
            })
            if(setInfo){
                setInfo(prev => prev? {...prev, followers: prev.followers - 1} : prev)
            }
        }}
        >{effectFollow}</button> :
        <button className="button-rounded follow-profile" onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            dispatch(followAction({
                followerId: auth.id || "",
                followedId:  targetId
            })).unwrap().then(() => {
                dispatch(getUser({id: auth.id}))
            })
            if(setInfo){
                setInfo(prev => prev? {...prev, followers: prev.followers + 1} : prev)
            }
        }}>Seguir</button>}
        </>
    )
}

export default FollowButton