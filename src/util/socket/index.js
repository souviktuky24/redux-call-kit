
import { sendAnswerToPeer } from '../rtc/index'

export const onDataExchange = (connection, data, actions, rtcCalleeNumber) => {
    if (actions === null || actions === undefined) {
        return new Error("unrecognised actions parameter provided please provile action creator here "+ JSON.stringify(actions))
    }else if (data !== undefined && data.type !== undefined) {
        if (data.type === "offer" || data.type === "answer" || data.type === "candidate") {
            switch(data.type){
                case "offer" :
                    const p = new Promise( ( resolve, reject ) => {
                        actions.onAnswer(data.offer, connection).then( answer => {
                            const tempPromise = new Promise( (res, rej) => {
                                try {
                                    sendAnswerToPeer(answer, connection, rtcCalleeNumber)
                                    res(answer)
                                } catch (error) {
                                    rej(error)
                                }
                            } )
                            tempPromise.then( a => {
                                resolve(connection)
                            } ).catch( e => {
                                reject(e)
                            } )
                        } )
                        .catch(e => {
                            reject(e)
                        })
                    } )
                    return p;
                case "answer" :
                    const pr = new Promise( (resolve, reject) => {
                        actions.setRemoteDescription(data.answer).then( c => {
                            resolve(c)
                        } )
                        .catch(e => {
                            reject(e)
                        })
                    } )
                    return pr;
                case "candidate" :
                    const pro = new Promise( (resolve, reject) => {
                        actions.addIceCandidate(data.candidate).then( c => {
                            resolve(c)
                        } ).catch( e => {
                            reject(e)
                        } )
                    } )
                    return pro;
                default :
                    return new Error("worng data recieved from server in exchange socket event "+ JSON.stringify(data))
            }
        } else {
            return new Error("worng data recieved from server in exchange socket event "+ JSON.stringify(data))
        }
    }else{
        return new Error("worng data recieved from server in exchange socket event "+ JSON.stringify(data))
    }
}


export const preserveSocketId = (payload, connection) => {
    connection.emit('user_connect', payload)
}


export const deleteSocketId = (payload, connection) => {
    connection.emit('leave', payload)
}