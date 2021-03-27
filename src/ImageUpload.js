import { Button, Input } from '@material-ui/core'
import React, { useState } from 'react'
import { storage,db } from './firebase'
import firebase from 'firebase'
import './ImageUpload.css';


function ImageUpload(props) {
    const[caption,setCaption]=useState("")
    const[progress,setProgress]=useState(0)
    const[image,setImage]=useState(null)


    const handleChange= (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }

    }


    const handleUpload= () => {
        const uploadTask = storage.ref(`image/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",(snapshot) => {
                //prorgess function...
                const progress = Math.round((snapshot.bytesTransferred /snapshot.totalBytes) *100);
                setProgress(progress)
            },
            (error) => {
                console.log(error.message)
                alert(error.message)
            },
            () => {
                //complete function
                storage
                .ref("image")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        userName:props.userName

                    })
                    setProgress(0)
                    setCaption("")
                    setImage(null)
                })
            }
        )

    }

    return (
        <div class="imageupload">
            <progress className="imageupload_progress" value={progress} max="100"></progress>
            <Input type="text" placeholder="Enter a cation" onChange={event => setCaption(event.target.value)}></Input>
            <Input type="file" onChange={handleChange}></Input>
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
