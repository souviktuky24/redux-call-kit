export const initRTC = (actions, 
    reconnect = true, 
    local = {enable:false,stream:null}, 
    remote = {enable:true,stream:null}) => {
    actions.socketConnector(reconnect).then( connection => {
        this.onConnectCallback(connection)
        actions.onIceCandidate(connection, this.onIceCandidateCallback).then( (c, s) => {
            
        } )
        .catch( e => {
            console.error(e)
        } )
        actions.initStream(local, remote).then(ok => {
        })
    } )
}