import React, { useState,useEffect } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db  } from './firebase'
import firebase from 'firebase'

function Post(props) {
    const[comments,setComments] = useState ([]);
    const[comment,setComment] = useState ("");

    useEffect( () => {
        let unsubscribe;
        if (props.postId){
            unsubscribe = db
            .collection("posts")
            .doc(props.postId)
            .collection("comments")
            .orderBy("timestamp","asc")
            .onSnapshot(snapshot =>
                setComments(snapshot.docs.map(doc => doc.data())));
        }
        return() => {
            unsubscribe();
        };

    },[props.postId])

    function postComment(event){
        event.preventDefault();
        db.collection("posts").doc(props.postId).collection("comments").add({
            userName:props.user.displayName,
            text:comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
            
        })
        setComment("")

    }

    return (
        <div className='post'>
            <div className='post_header'>
                <Avatar className="post_avator" alt="userName" src="https://yt3.ggpht.com/yti/ANoDKi7p5jxg27jzSc0Dd8Q1pZOVLAzETxCKBPc8ewx0Ew=s88-c-k-c0x00ffffff-no-rj-mo" />
                {/* header =>avator + username */}
            <h3>{props.data.userName}</h3>
            </div>
            {/* image */}
            <img className='post_img' 
            src={props.data.imageUrl}
            alt=""></img>
            {/*username+caption*/}
            <h4 className='post_text'><strong>{props.data.userName}</strong>:{props.data.caption}</h4>
            
            <div className="post_comments">
            {comments.map((comment) => {
                return <p>
                    <strong>{comment.userName}</strong> {comment.text}
                </p>
            })}
            </div>
            {props.user && (
            <form className="post_commentBox">
                <input className="post_input" type="text" placeholder="Add a comment..." value={comment} onChange={event => setComment(event.target.value)}></input>
                <button className="post_button" disabled={!comment} onClick={postComment}>Post</button>
            </form>
            )}
   
        </div>
    )
}

export default Post
// header =>avator + username
// image
