
let socket  = io();
    

window.onload = function() {
    let input   = document.getElementById('test'),
        timer;
    input.addEventListener("keyup", event => {
       
        if(timer) {
            clearTimeout(timer);
        }

        timer = setTimeout( () => {
            if(event.keyCode == 13) {
                console.log(event.target.value);
                event.preventDefault();
                send();
            }
        }, 200);

    })
};



socket.on('connect', () => {
    
    let name = prompt('Hello', '');

    if(!name) {
        name = '익명'
    }

    socket.emit('newUser', name);

});

socket.on('update', data => {
    console.log( `${data.name}: ${data.message}`);
})

socket.on('update', data => {
    let chat    = document.getElementById('chat-container'),
        message = document.createElement('div'),
        node    = document.createTextNode(`${data.name}: ${data.message}`),
        className = '';

        switch(data.type) {
            case 'message':
                className = 'other';
                break;
            case 'connect':
                className = 'connect';
                break;
            case 'disconnect':
                className = 'disconnect';
                break;
        }

        message.classList.add(className);
        message.appendChild(node);

        chat.appendChild(message);
})



function send() {
    let message = document.getElementById('test').value;

    document.getElementById('test').value = '';

    let chat    = document.getElementById('chat-container'),
        msg     = document.createElement('div'),
        node    = document.createTextNode(message);

        msg.classList.add('me');
        msg.appendChild(node);
        chat.appendChild(msg);


    socket.emit('message', { type: 'message', message: message });
}