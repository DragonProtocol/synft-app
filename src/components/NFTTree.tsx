import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Graphin, { Behaviors, Utils, GraphinData, IG6GraphEvent, IUserNode, IUserEdge } from '@antv/graphin'
import { Contract, Node } from '../synft'
import { useNavigate } from 'react-router-dom'
import { NftDataItem } from './NFTList'
import { PublicKey } from '@solana/web3.js'
interface TreeNodeCustomData extends Node, NftDataItem {
  image: string
  name: string
}
interface TreeNode {
  id: string
  label?: any
  style?: any
  type: string
  customData: TreeNodeCustomData
}

// 注册自定义元素
Graphin.registerNode(
  'nft-node',
  {
    options: {
      style: {},
      stateStyles: {
        hover: {},
        selected: {},
      },
    },
    draw(
      cfg: any,
      group: {
        addShape: (
          arg0: string,
          arg1: {
            attrs: {
              x?: number
              y?: number
              width?: number
              height?: number
              fill?: string
              img?: string
              fontSize?: number
              text?: any
            }
            name: string
          },
        ) => void
      },
    ) {
      console.log('cfg', cfg)
      const keyshape = group.addShape('image', {
        attrs: {
          x: 0,
          y: 0,
          width: 50,
          height: 50,
          fill: '#ccc',
          img: cfg.customData?.curr?.image,
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: 'image-shape',
      })
      group.addShape('text', {
        attrs: {
          fontSize: 12,
          x: 0,
          y: 0,
          text: cfg.customData.curr?.name,
          fill: '#ddd',
        },
        name: 'text',
      })
      return keyshape
    },
  },
  'single-node',
)
interface GraphinDagreTree extends GraphinData {
  nodes: TreeNode[]
  edges: IUserEdge[]
}
const injectTreeToGraphinDagreTree = (injectTree: Node): GraphinDagreTree => {
  const nodes: TreeNode[] = []
  const edges: IUserEdge[] = []
  const pushNodeEdge = (injectNode: any) => {
    const {
      curr: { mint, children },
    } = injectNode
    if (!mint) return
    // 追加节点数据
    nodes.push({
      customData: injectNode,
      id: mint,
      label: mint,
      type: 'nft-node',
    })
    // 如果有子集，追加连线数据
    if (children.length) {
      for (const child of children) {
        if (!child.curr.mint) continue
        edges.push({
          source: mint,
          target: child.curr.mint,
        })
        pushNodeEdge(child)
      }
    }
  }
  pushNodeEdge(injectTree)
  return { nodes, edges }
}
interface Props {
  data: Node
}
const NFTTree: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate()
  const { data: injectTree } = props
  const { nodes, edges } = injectTreeToGraphinDagreTree(injectTree)
  const graphinRef = React.createRef<Graphin>()
  const [treeData, setTreeData] = useState({ nodes, edges })
  const contract = Contract.getInstance()

  // 通过节点中源数据获取nft数据
  useEffect(() => {
    ;(async () => {
      const promises = nodes.map(async (item: TreeNode) => {
        const { mint } = item.customData.curr
        const mintKey = new PublicKey(mint as string)
        const data = await contract.getMetadataWithMint(mintKey)
        const customData = { ...item.customData, curr: { ...item.customData.curr, ...data?.externalMetadata } }
        return { ...item, customData }
      })
      const nodesRes = await Promise.allSettled(promises)
      const newNodes = nodesRes.map((v: any) => ({...v.value,label:v.value.customData.curr.name}))
      console.log('nodesRes',nodesRes);
      
      setTreeData({ nodes: newNodes, edges })
    })()
  }, [])
  console.log('treeData', treeData)

  // 节点数据变化
  useEffect(() => {
    const handleClick = (evt: IG6GraphEvent) => {
      const node = evt.item
      const customData = node?._cfg?.model?.customData as TreeNodeCustomData
      navigate(`/info/${customData.curr.mint}`)
    }
    // 监听节点点击事件
    if (graphinRef.current) {
      graphinRef.current.graph.on('node:click', handleClick)
    }
    return () => {
      if (graphinRef.current) {
        graphinRef.current.graph.off('node:click', handleClick)
      }
    }
  }, [treeData])
  return (
    <NFTTreeWrapper>
      <Graphin data={treeData} layout={{ type: 'dagre' }} ref={graphinRef}>
        {/** 树图的FitView 有BUG，网图的可以 */}
        {/* <FitView /> */}
      </Graphin>
    </NFTTreeWrapper>
  )
}
export default NFTTree
const NFTTreeWrapper = styled.div`
  width: 100%;
`