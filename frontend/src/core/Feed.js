import Post from './Post';
import Share from './Share';
import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../auth/apihelper/authcalls';
import { fetchPosts } from './apihelper/coreCalls';

const Feed = () => {

    const [posts, setPosts] = useState();
    useEffect(() => {
        const { user, token } = isAuthenticated();
        const getposts = async () => {
            try {
                const data = await fetchPosts(user._id, token);
                if(data.err){console.log(data.err)}
                else{setPosts(data)}
            } catch (error) { console.log(error); }
        }
        getposts();
    }, [])
    
    //console.log(posts);

    return (
        <div className='mx-3'>
            <div className='mt-4'>
            <Share />
            </div>
            {posts &&
                posts.map((item) => {
                    return (
                        <div key={item._id} className='mt-3'>
                        <Post post={item} />
                        </div>
                    )
                })
            }
        </div>


    )
}

export default Feed;