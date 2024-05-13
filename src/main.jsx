import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Provider} from 'react-redux';
import {createStore} from 'redux'
import {reducer} from "./store/reducer"
export const store = createStore(reducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
    </Provider>,
     {/* </React.StrictMode> */}
   
)
