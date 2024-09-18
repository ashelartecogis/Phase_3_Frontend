import React from 'react'
import Main from './Main';
import router from './Router';
import "./App.css";
import { store } from './store'
import { Provider } from 'react-redux'
import {
  RouterProvider
} from "react-router-dom";
import {SocketContext, socket} from './services/socket';
export default function App() {
  return (
    // <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <RouterProvider router={router} />
       {/* <Main /> */}
      </SocketContext.Provider>
     
    // </Provider>
  )
}