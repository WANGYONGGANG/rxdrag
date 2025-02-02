import { IBindParams } from "@rxdrag/react-runner";
import { INodeSchema } from "@rxdrag/schema";
import { SchemaOptions, createSchema, createSlotsSchema, withFormItem } from "../../shared";
import { IFieldMeta } from "@rxdrag/fieldy-schema"

const options: SchemaOptions<IFieldMeta<IBindParams>> = {
  propsSchemas: [
    {
      componentName: "Input",
      "x-field": {
        name: "title",
        label: "$title",
      },
    },
    {
      componentName: "Select",
      "x-field": {
        name: "type",
        label: "$type",
        defaultValue:"primary",
      },
      props: {
        options: [
          {
            value: 'primary',
            label: 'Primary',
          },
          {
            value: 'ghost',
            label: 'Ghost',
          },
          {
            value: 'dashed',
            label: 'Dashed',
          },
          {
            value: 'link',
            label: 'Link',
          },
          {
            value: 'text',
            label: 'Text',
          },
          {
            value: 'default',
            label: 'Default',
          },
        ]
      }
    },
    {
      componentName: "Switch",
      "x-field": {
        name: "disabled",
        label: "$disabled",
        params: {
          valuePropName: "checked",
        }
      },
    },
    {
      componentName: "Switch",
      "x-field": {
        name: "block",
        label: "$block",
        params: {
          valuePropName: "checked",
        }
      },
    },
    {
      componentName: "Switch",
      "x-field": {
        name: "danger",
        label: "$danger",
        params: {
          valuePropName: "checked",
        }
      },
    },
    {
      componentName: "Switch",
      "x-field": {
        name: "ghost",
        label: "$ghost",
        params: {
          valuePropName: "checked",
        }
      },
    },
    {
      componentName: "Radio.Group",
      "x-field": {
        name: "shape",
        label: "$shape",
      },
      props: {
        optionType: "button",
        size: "small",
        options: [
          {
            label: "$default",
            value: "default"
          },
          {
            label: "$circle",
            value: "circle"
          },
          {
            label: "$round",
            value: "round"
          },
        ],
        defaultValue: "default",
      }
    },
    {
      componentName: "Radio.Group",
      "x-field": {
        name: "size",
        label: "$size",
      },
      props: {
        optionType: "button",
        size: "small",
        options: [
          {
            label: "$large",
            value: "large"
          },
          {
            label: "$middle",
            value: "middle"
          },
          {
            label: "$small",
            value: "small"
          },
        ],
        defaultValue: "middle",
      }
    },
  ],
  slotsSchemas: createSlotsSchema(
    {
      name: "icon",
      label: "$icon"
    }
  ),
  events: [
    {
      name: "onClick",
      label: "$onClick",
    }
  ],
}

export const buttonSchema: INodeSchema = createSchema(withFormItem(options))