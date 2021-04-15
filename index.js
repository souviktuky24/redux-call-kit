import * as Actions from './src/redux/action/actionCreator';
import * as SocketHelper from './src/util/socket';
import * as PeerHelper from './src/util/rtc';
import * as Middleware from './src/redux/middleWare';
import { rtcReducer as reducer } from './src/redux/reducer/rtcReducer';
import { initSocket as reactInitSocket } from './src/util/init/socket';
import { initRTC as reactInitRtc } from './src/util/init/rtc';
export const actionCreator = Actions ;
export const preserveSocketId = SocketHelper.preserveSocketId ;
export const deleteSocketId = SocketHelper.deleteSocketId ;
export const onDataExchange = SocketHelper.onDataExchange ;
export const sendCandidateToPeer = PeerHelper.sendCandidateToPeer ;
export const sendOfferToPeer = PeerHelper.sendOfferToPeer ;
export const sendAnswerToPeer = PeerHelper.sendAnswerToPeer ;
export const startCall = PeerHelper.startCall ;
export const makePeerAvailableForCall = PeerHelper.makePeerAvailableForCall ;
export const rtcPeerConnection = Middleware.rtcPeerConnection ;
export const socketConnection = Middleware.socketConnection ;
export const rtcNavigator = Middleware.rtcNavigator ;
export const initSocket = reactInitSocket ;
export const initRTC = reactInitRtc ;
export default reducer ;