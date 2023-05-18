import { IActivityDefine } from "@rxdrag/minions-schema";
import { IActivityFactoryOptions } from "../../controllers";
import { IController } from "../../interfaces";
import { AbstractControllerActivity } from "../AbstractControllerActivity";
import { activity } from "@rxdrag/minions-runtime";

export interface IVariableConfig {
  controllerId: string
  variable?: string
}

export const SetVariableActivityName = "system-react.setVariable"
@activity(SetVariableActivityName)
export class SetVariableReaction extends AbstractControllerActivity {
  controller: IController
  constructor(meta: IActivityDefine<IVariableConfig>, options?: IActivityFactoryOptions) {
    super(meta, options)

    if (Object.keys(meta.inPorts || {}).length !== 1) {
      throw new Error("SetVariable inputs count error")
    }
    if (!meta.config?.controllerId) {
      throw new Error("SetVariable not set controller id")
    }
    const controller = options?.controllers?.[meta.config?.controllerId]
    if (!controller) {
      throw new Error("Can not find controller")
    }
    this.controller = controller
  }

  execute = (inputValue: string) => {
    if (this.meta.config?.variable) {
      this.controller?.setVariable(this.meta.config.variable, inputValue)
    }
  }
}
