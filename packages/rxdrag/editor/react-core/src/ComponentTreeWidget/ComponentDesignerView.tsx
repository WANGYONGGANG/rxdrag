/* eslint-disable @typescript-eslint/no-explicit-any */
import { isHTMLElement } from "@rxdrag/shared";
import React, { memo, useCallback, useMemo } from "react";
import { useDesignComponent, useDesignerEngine, useLocked, useTreeNode} from "../hooks";
import { PlaceHolder } from "../PlaceHolder";
import { NodeContext } from "../contexts";
import { Locked } from "./Locked";

export const ComponentDesignerView = memo((props: { nodeId: string }) => {
  const { nodeId } = props;
  const node = useTreeNode(nodeId);
  const Component = useDesignComponent(node?.meta?.componentName);
  const engine = useDesignerEngine()
  const behavior = useMemo(() => engine?.getNodeBehavior(node?.id || ""), [engine, node?.id])
  const locked = useLocked();

  const handleRef = useCallback((element: HTMLElement | undefined) => {
    for (const key of Object.keys(node?.rxProps || {})) {
      if (isHTMLElement(element) && !locked) {
        element?.setAttribute(key, (node?.rxProps as any)[key])
      }
    }
  }, [locked, node?.rxProps])

  const { style, ...other } = node?.meta?.props || {}
  const { dStyle, ...dOther } = node?.designerProps || {}
  const slots = useMemo(() => {
    const slts: { [key: string]: React.ReactElement } = {}
    for (const name of Object.keys(node?.slots || {})) {
      const slotId = node?.slots?.[name]
      if (slotId) {
        slts[name] = <ComponentDesignerView nodeId={slotId} />
      }
    }

    return slts
  }, [node])

  const realProps = useMemo(() => {
    const rxProps = !locked ? (node?.rxProps) : {}
    return {
      style: { ...style||{}, ...dStyle||{} },
      ...other,
      ...rxProps,
      ...dOther,
      ...slots
    }
  }, [dOther, dStyle, locked, node?.rxProps, other, slots, style])

  const hasChildren = useMemo(() => !!node?.children?.length, [node?.children?.length])

  const render = useCallback(() => {
    if (Component && node) {
      if (hasChildren) {
        return <Component ref={!behavior?.isNoRef() ? handleRef : undefined} {...realProps} >
          <Locked node={node}>
            {
              !node.meta?.selfRender && node.children?.map((childId: string) => {
                return <ComponentDesignerView key={childId} nodeId={childId} />;
              })
            }
          </Locked>
        </Component >
      } else if (behavior?.isDroppable() && node.parentId) {
        return <Component ref={!behavior?.isNoRef() ? handleRef : undefined} {...realProps}>
          {!behavior.isNoPlaceholder() && <PlaceHolder />}
        </Component>
      } else {
        return <Component ref={!behavior?.isNoRef() ? handleRef : undefined} {...realProps} />
      }
    }
    return <></>
  }, [Component, behavior, handleRef, hasChildren, node, realProps])

  return (
    <NodeContext.Provider value={node || undefined}>
      {
        render()
      }
    </NodeContext.Provider>
  );
});
