/*
 * @Author: HuangBoWen
 * @Date: 2022-03-23 10:01:58
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-03-27 10:52:04
 * @Description: 
 */
// eslint-disable-next-line import/prefer-default-export
export const backToTop = () => {
  document.getElementById('layoutMainScroll')?.scrollTo({ top: 0, behavior: 'smooth' })
}

export const formatAddress = (address: string): string => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
