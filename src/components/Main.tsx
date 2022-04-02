/*
 * @Author: HuangBoWen
 * @Date: 2022-03-23 10:01:58
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-01 23:18:16
 * @Description: 
 */
import React, { useEffect } from 'react'
import { useRoutes, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Home from '../container/Home'
import Info from '../container/Info'
import { backToTop } from '../utils/tools'

const Main: React.FC = () => {
  const location = useLocation()
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    // contractAddress 和 tokenId 确定唯一 NFT
    { path: '/info/:contractAddress/:tokenId', element: <Info /> },
    { path: '*', element: <div>404</div> },
  ])
  useEffect(() => {
    backToTop()
  }, [location])
  return <MainWrapper>{routes}</MainWrapper>
}
export default Main
const MainWrapper = styled.div``
