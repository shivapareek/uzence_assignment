import type { Meta, StoryObj } from "@storybook/react";
import DataTable from "./DataTable";

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    data: [
      { id: 1, name: "Shiva" },
      { id: 2, name: "Rimi" },
    ],
  },
};
