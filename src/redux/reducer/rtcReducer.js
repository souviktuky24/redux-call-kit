export const rtcReducer = (state = [], action)=>{
    switch (action.type) {
        case 'SOCKET_CONNECT':
          return {
              ...state,
              isSocketConnected:action.isSocketConnected
          }
        case 'UPDATE_CALLEE':
          return {
              ...state,
              rtcCalleeNumber:action.rtcCalleeNumber
          }
        case 'UPDATE_CALLER':
          return {
              ...state,
              rtcCallerNumber:action.rtcCallerNumber
          }
        case 'LOCAL_VIDEO_STREAM':
          return {
              ...state,
              localVideoStream:action.localVideoStream
          }
        case 'REMOTE_VIDEO_STREAM':
          return {
              ...state,
              remoteVideoStream:action.remoteVideoStream
          }
        case 'IS_NEGOTIATING':
          return {
              ...state,
              isNegotiating:action.isNegotiating
          }
        default: 
          return state
    }
}