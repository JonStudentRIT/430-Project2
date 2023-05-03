const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

let localUser = "";
//------------
const socket = io();

const handlePostBox = () => {
    // const postForm = document.getElementById('postForm');
    const postBox = document.getElementById('postBox');
    const channelSelect = document.getElementById('channelSelect');

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if(postBox.value) {            
            const data = {
                message: `${localUser},${postBox.value}`,
                channel: channelSelect.value,
            };

            const name = localUser;
            const postOut = postBox.value;
            const channel = channelSelect.value;
            
            //socket.emit('chat message', data);
            helper.sendPost(e.target.action, {name, channel, postOut}, loadPostsFromServer);
            postBox.value = '';
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
    // const messages = document.getElementById('messages');
    channelSelect.addEventListener('change', () => {
        loadPostsFromServer();

        switch(channelSelect.value) {
            case 'friends':
                socket.off('public');
                socket.off('personal');
                socket.on('friends', displayMessage);
                break;
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
    // ReactDOM.render(<PostOutForm />, document.getElementById('makePost'));
    ReactDOM.render(<PostOutList posts = {[]} />, document.getElementById('posts'));
    loadPostsFromServer();
    //---------
    handlePostBox();
    socket.on('general', displayMessage);
    handleChannelSelect();
    localUser = window.localStorage.getItem("jk9927-UserName")
    //---------
};

window.onload = init;