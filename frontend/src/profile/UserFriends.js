import { useEffect, useState } from "react";
import { isAuthenticated } from "../auth/apihelper/authcalls";
import { getUserWithFrnds } from "../core/apihelper/coreCalls";
import FriendCard from "./FriendCard";

const UserFriends = (props) => {

    const { token } = isAuthenticated();
    const userId = props.userId;

    const [details, setDetails] = useState();

    useEffect(() => {
        const getDetails = async () => {
            try {
                const data = await getUserWithFrnds(userId, token);
                if(data.err){console.log(data.err)}
                else{ setDetails(data)}
            } catch (error) {
                console.log(error);
            }
        }
        getDetails();

    }, [userId])

    return (
        <div className="d-flex flex-wrap">
            {details && details.following.map((item) => {
                return (
                    <div key={item._id}>
                        <FriendCard friend={item} />
                    </div>
                )
            })}
        </div>
    )
}

export default UserFriends;