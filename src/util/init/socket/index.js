export const initSocket = (acttions, defaultInitArgs = {
    preserveIdPayload: {
        payload: {event:"user_connected",useArgs:true},
        callback: this.preserveUserIdToSignalServer
    },
    deleteIdPayload: {
        payload: {event:"user_deleted",useArgs:true},
        callback: this.deleteUserIdFromSignalServer
    },
    exchangePayload: {
        payload: {event:"exchange",useArgs:true},
        callback: this.exchangePeerDataWithSignalServer
    }
}) => {
    actions.addSocketListener(defaultInitArgs.preserveIdPayload.payload, defaultInitArgs.preserveIdPayload.callback).then( (connection, data) => {
    } )
    .catch( e => {
        console.error(e)
    } )
    actions.addSocketListener(defaultInitArgs.deleteIdPayload.payload, defaultInitArgs.deleteIdPayload.callback).then( (connection, data) => {
    } )
    .catch( e => {
        console.error(e)
    } )
    actions.addSocketListener(defaultInitArgs.exchangePayload.payload, defaultInitArgs.exchangePayload.callback).then( (connection, data) => {
    } )
    .catch( e => {
        console.error(e)
    } )
}