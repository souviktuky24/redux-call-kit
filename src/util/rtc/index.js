export const sendCandidateToPeer = (candidate, connection, rtcCalleeNumber) => {
    const exchangePayload = {
        to: rtcCalleeNumber,
        type: "candidate",
        candidate
    }
    connection.emit('exchange',exchangePayload)
}

export const sendOfferToPeer = (offer ,connection, rtcCalleeNumber) => {
    const exchangePayload = {
        to: rtcCalleeNumber,
        type: "offer",
        offer
    }
    connection.emit('exchange',exchangePayload)
}

export const sendAnswerToPeer = (answer, connection, rtcCalleeNumber) => {
    const exchangePayload = {
        to: rtcCalleeNumber,
        type: "answer",
        answer
    }
    connection.emit('exchange',exchangePayload)
}

export const startCall = (actions,createOfferCallback) => {
    actions.getSocketConnection().then(connection => {
        actions.getOwnStream().then(stream => {
            const local={enable:true,stream:stream};
            const remote = {enable:true,stream:null}
            actions.initStream(local, remote).then(ok => {
                actions.createOffer(connection).then( (offer, sc)=>{
                    createOfferCallback(offer,sc)
                } )
                .catch( e => {
                    console.error(e)
                } )
            })
            .catch( e => {
                console.error(e)
            } )
        })
        .catch( e => {
            console.error(e)
        } )
    })
}

export const makePeerAvailableForCall = (actions,onConnectCallback, onIceCandidateCallback) => {
    actions.socketConnector(true).then( connection => {
        onConnectCallback(connection)
        actions.onIceCandidate(connection, onIceCandidateCallback).then( (c, s) => {
            
        } )
        .catch( e => {
            console.error(e)
        } )
        const local={enable:false,stream:null};
        const remote = {enable:true,stream:null}
        actions.initStream(local, remote).then(ok => {
        })
    } )
}