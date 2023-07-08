import { useCallback, useEffect } from "react"
import { INodeData } from "../../interfaces/interfaces"
import { Node } from "@antv/x6";
import { useBackup } from "./useBackup";
import { useMarkChange } from "./useMarkChange";
import { useDispatch } from "../useDispatch";
import { useGraph } from "../useGraph";
import { ActionType } from "../../actions";
import { getParentSize } from "./getParentSize";

export function useMovedNode() {
  const dispatch = useDispatch()
  const graph = useGraph()

  const backup = useBackup()
  const markeChange = useMarkChange()
  const handleNodeMoved = useCallback(({ node }: { x: number, y: number, node: Node, index: number, options: unknown }) => {
    backup()

    //父节点跟随移动
    const parent = node.getParent()
    if (parent && parent.isNode()) {
      const { meta } = parent.getData() as INodeData
      dispatch?.({
        type: ActionType.CHANGE_NODE,
        payload: {
          ...meta,
          id: parent.id,
          x6Node: {
            x: parent.getPosition().x,
            y: parent.getPosition().y,
            width: parent.getSize().width,
            height: parent.getSize().height,
          }
        }
      })
    }

    const { meta } = node.getData() as INodeData
    dispatch?.({
      type: ActionType.CHANGE_NODE,
      payload: {
        ...meta,
        id: node.id,
        x6Node: {
          x: node.getPosition().x,
          y: node.getPosition().y,
          width: node.getSize().width,
          height: node.getSize().height,
        }
      }
    })

    //子节点跟随移动
    const children = node.getChildren()
    for (const child of children||[]){
      const childNode = child as Node
      const { meta } = child.getData() as INodeData
      dispatch?.({
        type: ActionType.CHANGE_NODE,
        payload: {
          ...meta,
          id: childNode.id,
          x6Node: {
            x: childNode.getPosition().x,
            y: childNode.getPosition().y,
            width: childNode.getSize().width,
            height: childNode.getSize().height,
          }
        }
      })
    }

    graph?.select(node.id)
    markeChange()
  }, [backup, dispatch, graph, markeChange])

  useEffect(() => {
    graph?.on('node:moved', handleNodeMoved)

    return () => {
      graph?.off('node:moved', handleNodeMoved)
    }
  }, [graph, handleNodeMoved])
}