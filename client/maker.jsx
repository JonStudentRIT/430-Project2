const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// the user on this browser
let localUser = "";
// local variable of this socket
const socket = io();

// take information in from the text box
const handlePostBox = () => {
    const postForm = document.getElementById('postForm');
    const postBox = document.getElementById('postBox');
    const channelSelect = document.getElementById('channelSelect');

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if(postBox.value) {            
            const data = {
                message: `${localUser},${postBox.value}`,
                channel: channelSelect.value,
            };

            const name = localUser;
            const postOut = postBox.value;
            const channel = channelSelect.value;
            // sent the post to the screen
            socket.emit('post list', data);
            // sent the contents of the post to be saved in mongo
            helper.sendPost(e.target.action, {name, channel, postOut}, loadPostsFromServer);
            // empty the box
            postBox.value = '';
        }
    });
};

// layout for the message on screen
const displayMessage = (msg) => {    
    const messageDiv = document.createElement('div');
    console.log(msg);
    localTemp = msg.split(',');
    messageDiv.innerHTML = `<div id="chatitem"><h1>${localTemp[0]}</h1><p>${localTemp[1]}</p></div>`;
    document.getElementById('messages').appendChild(messageDiv);
}

// manage the channel switch and who can access what channel
const handleChannelSelect = () => {
    const channelSelect = document.getElementById('channelSelect');
    const messages = document.getElementById('messages');
    channelSelect.addEventListener('change', () => {
        // pull the posts and filter what ones to display
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
// filter and show the posts
const PostOutList = (props) => {
    // if there is nothing in the posts collection
    if(props.posts.length === 0) {
        return (
            <div className = "postList">
                <h3 className = "emptyPost">No Posts Yet!</h3>
            </div>
        )
    };
    // output the posts with the users Icon, the user name, and the post content
    const postNodes = props.posts.map(post => {
        console.log(post);
        return (
            <div key = {post._id} className = "post">
                <div>
                    <img src = "/assets/img/placeHold2.jpeg" alt = "userIcon" className = "postIcon" />
                    <h3 className = "postName">User: {post.name} </h3>
                </div>

                <div>
                    <h3 className = "postContent">{post.postOut}</h3>
                </div>
            </div>
        );
    });
    return (
        <div className = "postList">{postNodes}</div>
    )
};

// pull all the posts from mongo
const loadPostsFromServer = async () => {
    const response = await fetch('/getPosts');
    const data = await response.json();
    // sent the posts to the app page
    ReactDOM.render(<PostOutList posts = {data.posts} />, document.getElementById('posts'));
};

// initially populate the public posts and save the user name to the client to be stored on the post schema
const init = () => {
    ReactDOM.render(<PostOutList posts = {[]} />, document.getElementById('posts'));
    loadPostsFromServer();
    handlePostBox();
    socket.on('general', displayMessage);
    handleChannelSelect();
    localUser = window.localStorage.getItem("jk9927-UserName")
};

window.onload = init;