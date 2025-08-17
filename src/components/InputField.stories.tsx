import type { Meta, StoryObj } from "@storybook/react";
import InputField from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    label: "Name",
    placeholder: "Enter your name",
    value: "",
    onChange: (val: string) => console.log(val),
  },
};
