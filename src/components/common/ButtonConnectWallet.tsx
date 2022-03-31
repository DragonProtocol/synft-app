/*
 * @Author: HuangBoWen
 * @Date: 2022-03-23 10:01:58
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-03-31 18:53:24
 * @Description:
 */
import styled from 'styled-components'
import { ButtonBaseCss } from './ButtonBase'
import { formatAddress } from '../../utils/tools'

interface props {
  context: any
}

const ButtonConnectWallect: React.FC<props> = ({context}) => {
  const { account, loading, connectWallet, disconnectWallet } = context
  
  if (account) {
    return (
      <ButtonConnectWallectWrapper onClick={() => disconnectWallet()}>
        {formatAddress(account)}
      </ButtonConnectWallectWrapper>
    )
  }

  return (
    <ButtonConnectWallectWrapper onClick={() => connectWallet()}>
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </ButtonConnectWallectWrapper>
  )
}
export default ButtonConnectWallect
const ButtonConnectWallectWrapper = styled.div`
  // 重置solana按钮默认样式 - start
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  &:hover {
    background: #3dd606 !important;
  }
  // 重置solana按钮默认样式 - end

  ${ButtonBaseCss}
  width: 204px;
  background: #3dd606 !important;
`
