const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

let id;
let localUser = "";
//------------
const socket = io();

const handleEditBox = () => {
    const editForm = document.getElementById('editForm');
    const editBox = document.getElementById('editBox');
    const channelSelect = document.getElementById('channelSelect');

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if(editBox.value) {            
            const data = {
                message: `${localUser},${editBox.value}`,
                channel: channelSelect.value,
            };

            const name = localUser;
            const postOut = editBox.value;
            const channel = channelSelect.value;
            helper.sendPost(e.target.action, {name, channel, postOut}, loadPostsFromServer);

            socket.emit('chat message', data);
            editBox.value = '';
        }
    });
};

const displayMessage = (msg) => {    
    const messageDiv = document.createElement('div');
    console.log(msg);
    localTemp = msg.split(',');
    messageDiv.innerHTML = `<div id="chatitem"><h1>${localTemp[0]}</h1><p>${localTemp[1]}</p></div>`;
    document.getElementById('messages').appendChild(messageDiv);
}

const handleChannelSelect = () => {
    const channelSelect = document.getElementById('channelSelect');
    const messages = document.getElementById('messages');
    channelSelect.addEventListener('change', () => {
        messages.innerHTML = '';

        switch(channelSelect.value) {
            case 'friends':
                socket.off('public');
                socket.off('personal');
                socket.on('friends', displayMessage);
                break;
        // everything in ublic is visible in both friends an public  
            case 'public':
                socket.off('personal');
                socket.off('friends');
                socket.on('public', displayMessage);
                break;
            default:
                socket.off('public');
                socket.off('friends');
                socket.on('personal', displayMessage);
                break;
        }
    });
}
//------------

const handlePost = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = localUser;
    const postOut = e.target.querySelector('#postBackstory').value;

    if(!name || !postOut)
    {
        helper.handleError('All fields are required');
        return false;
    }
    console.log("point 1");

    helper.sendPost(e.target.action, {name, postOut}, loadPostsFromServer);

    return false;
};

// // delete function 
// const deletePost = (e) => {
//     e.preventDefault();
//     helper.hideError();

//     // empty string check
//     if(id) {
//         // go to the helper to send an update 
//         helper.sendDelete(e.target.action, {id}, loadPostsFromServer);
//     }

//     return false;
//   };

const PostOutForm = (props) => {
    return (
        <form id = "postForm"
            onSubmit = {handlePost}
            name = "postForm"
            action = "/maker"
            method = "POST"
            className = "postForm"
            >
                {/* <lable id = "postNameLabel" htmlFor = "name">Name: </lable>
                <input id = "postName" type="text" name = "name" placeholder = "post Name" />
                <br /> */}
                {/* <lable id = "postBackstoryLabel" htmlFor = "backstory">Backstory: </lable> */}
                <textarea id = "postBackstory" rows="6" cols="30"  name = "postOut" >
                    Tell us your story
                </textarea>
                <br />
                <input id = "submitButton" className = "makePostSubmit" type="submit" value = "Make Post" />
            </form>
    );
};

const PostOutList = (props) => {
    if(props.posts.length === 0) {
        return (
            <div className = "postList">
                <h3 className = "emptyPost">No Posts Yet!</h3>
            </div>
        )
    };
    const postNodes = props.posts.map(post => {
        console.log(post);
        return (
            <div key = {post._id} className = "post">
                <div>
                    <img src = "/assets/img/placeHold2.jpeg" alt = "face" className = "postFace" />
                    <h3 className = "postName">Name: {post.name} </h3>
                </div>

                <div>
                    <h3 className = "postBackstory">text{post.postOut}</h3>
                </div>
                {/* <div>
                <form
                    // call the delete function
                    onSubmit = {deletePost}
                    action = "/delete"
                    >
                        <input id = "submitButton" onClick = {()=>{id=post._id}} type="submit" value = "Delete" />
                    </form>
                </div> */}
            </div>
        );
    });
    return (
        <div className = "postList">{postNodes}</div>
    )
};

const loadPostsFromServer = async () => {
    const response = await fetch('/getPosts');
    const data = await response.json();
    ReactDOM.render(<PostOutList posts = {data.posts} />, document.getElementById('posts'));
};

const init = () => {
    ReactDOM.render(<PostOutForm />, document.getElementById('makePost'));
    ReactDOM.render(<PostOutList posts = {[]} />, document.getElementById('posts'));
    loadPostsFromServer();
    //---------
    handleEditBox();
    socket.on('general', displayMessage);
    handleChannelSelect();
    localUser = window.localStorage.getItem("jk9927-UserName")
    //---------
};

window.onload = init;