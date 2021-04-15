import { 
    SOCKET_CONNECT,
    UPDATE_CALLEE,
    UPDATE_CALLER,
    LOCAL_VIDEO_STREAM,
    REMOTE_VIDEO_STREAM,
    IS_NEGOTIATING } from './actionTypes';


/**
 * this is the default behaviour of redux below is action creators 
 * that will return the redux action with types
 * @param {*} type 
 */

export const UPDATE_CALLEE_NUMBER = rtcCalleeNumber => {
    return {
        type: UPDATE_CALLEE,
        rtcCalleeNumber
    }
}

export const UPDATE_CALLER_NUMBER = rtcCallerNumber => {
    return {
        type: UPDATE_CALLER,
        rtcCallerNumber
    }
}

export const LOCAL_VIDEO_STREAM_UPDATE = localVideoStream => {
    return {
        type: LOCAL_VIDEO_STREAM,
        localVideoStream
    }
}

export const REMOTE_VIDEO_STREAM_UPDATE = remoteVideoStream => {
    return {
        type: REMOTE_VIDEO_STREAM,
        remoteVideoStream
    }
}

export const IS_NEGOTIATING_UPDATE = isNegotiating => {
    return {
        type: IS_NEGOTIATING,
        isNegotiating
    }
}

/**
 * below is psudo action creators that will let you create and manage all video
 * calling session
 * @param {*} type 
 */

export const addSocketListener = (type, callback) => {
    return {
        socket: (connection, ...rest) => {
            const p=new Promise((resolve, reject) => {
                try {
                    if (type.useArgs) {
                        connection.on(type.event,(data)=>{
                            callback(connection, data)
                            resolve(connection,data)
                        })
                    } else {
                        connection.on(type.event,()=>{
                            callback(connection)
                            resolve(connection)
                        })
                    }
                } catch (error) {
                    reject(error)
                }
            })
            return p;
        }
    }
}

export const SOCKET_CONNECT_DISPATCH = isSocketConnected => {
    return {
        type: SOCKET_CONNECT,
        isSocketConnected
    }
}


export const socketConnector = (reconnect)=>{
    return {
        socket: (connection, dispatch, getState) => {
            const p = new Promise( (resolve, reject)=>{
                try {
                    if (!connection.connected) {
                        connection.connect();
                    }
                    if (reconnect) {
                        connection.on('disconnect',()=>{
                            connection.connect();
                            dispatch(SOCKET_CONNECT_DISPATCH(true))
                        })
                    }
                    dispatch(SOCKET_CONNECT_DISPATCH(true))
                    resolve(connection)
                } catch (error) {
                    reject(error)
                }
            } )
            return p;
        }
    }
}

export const onIceCandidate = (socket, callback) => {
    return {
        rtcPeerConnection:(connection, ...rest) =>{
            const p = new Promise( (resolve, reject) => {
                try {
                    connection.onicecandidate = (e) => {
                        if (e.candidate) { 
                            const candidate = e.candidate;
                            callback(candidate, socket)
                        } 
                    }
                    resolve(true, true)
                } catch (error) {
                    reject(error)
                }
            } )
            return p;
        }
    }
}



export const addIceCandidate = candidate => {
    return {
        rtcPeerConnection:(connection, ...rest) =>{
            const p = new Promise( (resolve, reject) => {
                try {
                    connection.addIceCandidate(new RTCIceCandidate(candidate)); 
                    resolve(connection)
                } catch (error) {
                    reject(error)
                }
            } )
            return p;
        }
    }
}

export const setRemoteDescription = answer => {
    return {
        rtcPeerConnection:(connection, ...rest) =>{
            const p = new Promise( (resolve, reject) => {
                try {
                    connection.setRemoteDescription(new RTCSessionDescription(answer)); 
                    resolve(connection)
                } catch (error) {
                    reject(error)
                }
            } )
            return p;
        }
    }
}

export const onAnswer = (offer, socket) => {
    return {
        rtcPeerConnection:(connection, ...rest) =>{
            const p = new Promise( (resolve, reject) => {
                try {
                    connection.setRemoteDescription(new RTCSessionDescription(offer)).then( ()=>{
                        connection.createAnswer( (answer) => { 
                            connection.setLocalDescription(answer); 
                            resolve(answer)
                        }, (error) => { 
                            reject(error)
                        }); 
                    } ) 
                } catch (error) {
                    reject(error)
                }
            } ) 
            return p;
        }
    }
}

export const createOffer = (socket) => {
    return {
        rtcPeerConnection:(connection, ...rest) =>{
            const p = new Promise( (resolve, reject) => {
                try {
                    connection.createOffer(function (offer) { 
                        connection.setLocalDescription(offer); 
                        resolve(offer, socket)
                    }, (error) => { 
                        reject(error)
                    });
                } catch (error) {
                    reject(error)
                }
            } )
            return p;
        }
    }
}

export const onNigotiationNeeded = (callback) => {
    return {
        rtcPeerConnection:(connection, ...rest) =>{
            const p = new Promise( (resolve, reject) => {
                try {
                    connection.onnegotiationneeded = callback
                    resolve(connection)
                } catch (error) {
                    reject(error)
                }
            } )
            return p;
        }
    }
}

export const getSocketConnection = ()=>{
    return {
        socket: (connection, dispatch, getState) => {
            const p = new Promise( (resolve,reject)=>{
                if (!connection.connected) {
                    connection.connect();
                    dispatch(SOCKET_CONNECT_DISPATCH(true))
                }
                resolve(connection)
            } );
            return p
        }
    }
}

export const getRTCPeerConnection = () =>{
    return {
        rtcPeerConnection:(connection, ...rest) =>{
            const p = new Promise( (resolve,reject)=>{
                resolve(connection)
            } );
            return p
        }
    }
}

export const initStream = (local,remote) => {
    return {
        rtcPeerConnection:(connection, dispatch, getState) =>{
            const p = new Promise( (resolve,reject) => {
                try {
                    if (local.enable) {
                        connection.addStream(local.stream)
                        dispatch(LOCAL_VIDEO_STREAM_UPDATE(local.stream))
                    }
                    if (remote.enable) {
                        connection.onaddstream = (e) => { 
                            dispatch(REMOTE_VIDEO_STREAM_UPDATE(e.stream)) 
                        };
                    }
                    resolve(connection)
                } catch (error) {
                    reject(error)
                }
            } )
            return p;
        }
    }
}

export const getOwnStream = () => {
    return {
        rtcNavigator: (navigator, ...rest) =>{
            const p = new Promise( (resolve,reject) => {
                navigator.getUserMedia = ( navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia);
                navigator.getUserMedia({ video: true, audio: true }, (stream) => { 
                    resolve(stream)
                },error => {
                    reject(error)
                })
            } )
            return p;
        }
    }
}

export const onAddTrack = () => {
    return {
        rtcPeerConnection:(connection, dispatch, getState) =>{
            const p = new Promise( (resolve,reject) => {
                try {
                    connection.onsignalingstatechange = e => {
                        const isNegotiating = (connection.signalingState !== "stable");
                        dispatch(IS_NEGOTIATING_UPDATE(isNegotiating))
                        resolve(isNegotiating)
                    }
                } catch (error) {
                    reject(error)
                }
            } )
            return p;
        }
    }
}