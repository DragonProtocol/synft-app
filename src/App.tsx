/*
 * @Author: HuangBoWen
 * @Date: 2022-03-29 21:17:33
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-03-31 18:04:13
 * @Description: 
 */
import React, { FC } from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import log from 'loglevel'

import GlobalStyle from './GlobalStyle'
import Layout from './components/Layout'
import { ConnectedWeb3 } from './components/ConnectedWeb3'

import { isProd, logIsProd } from './utils'
import { store } from './store/store'

log.setLevel(logIsProd ? 'warn' : 'trace')

const App: FC = () => (
  <Provider store={store}>
    <GlobalStyle />
    <HashRouter>
      <ConnectedWeb3>
        <Layout />
      </ConnectedWeb3>
    </HashRouter>
  </Provider>
)

export default App
