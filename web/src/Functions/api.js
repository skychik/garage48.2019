import axios from 'axios';
import openSocket from 'socket.io-client';

function serverRequest(json = {}) {
    return axios.post('https://tensy48.space/', json);
}

function handlerResult(that, res, handlerSuccess, handlerError) {
    if (res.error) {
        handlerError(that, res);
    } else {
        handlerSuccess(that, res);
    }
}

export function api(that, method, params = {}, handlerSuccess = () => {},
    handlerError = () => {}) {
    const json = {
        method,
        params,
    };

    json.token = JSON.parse(localStorage.getItem('token'));
    // console.log(json);
    serverRequest(json).then((res) => handlerResult(that, res.data, handlerSuccess, handlerError));
}

export function sendImage(that, image, handlerSuccess = () => {},
                                  handlerError = () => {}) {
    // console.log(json);
    axios.post('https://tensy48.space/processImage', image).then((res) => handlerResult(that, res.data, handlerSuccess, handlerError));
}

// online
export let socketIo = openSocket('https://tensy48.space/main', { transport : ['websocket'] });

