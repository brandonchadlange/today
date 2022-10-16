import {
  Avatar,
  Button,
  Card,
  Grid,
  Group,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconExclamationMark } from "@tabler/icons";
import { forwardRef, useState } from "react";
import ApplicationLayout from "../../components/application-layout";
import ProtectedPage from "../../components/protected-page";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useRouter } from "next/router";

const data = [
  {
    label: "Low",
    value: "1",
    color: "gray",
  },
  {
    label: "Medium",
    value: "2",
    color: "orange",
  },
  {
    label: "High",
    value: "3",
    color: "red",
  },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  color: string;
  description: string;
}

// const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
//   ({ image, label, color, description, ...others }: ItemProps, ref) => (
//     <div ref={ref} {...others}>
//       <Group noWrap>
//         <Avatar size={24} color={color}>
//           <IconExclamationMark size={16} />
//         </Avatar>

//         <div>
//           <Text size="sm">{label}</Text>
//           <Text size="xs" color="dimmed">
//             {description}
//           </Text>
//         </div>
//       </Group>
//     </div>
//   )
// );

const NewTask = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      ticket: "",
      importance: "1",
    },
  });

  const onFormSubmit = async (values: any) => {
    setLoading(true);
    await axios.post("/api/tasks", values);
    router.push("/tasks");
  };

  return (
    <ProtectedPage>
      <ApplicationLayout>
        <Group position="apart" align="start" mb="lg">
          <div>
            <Title size={20}>Your open tasks</Title>
            <Text>Manage or create tasks for yourself</Text>
          </div>
        </Group>
        <Card withBorder style={{ overflow: "visible" }}>
          <form onSubmit={form.onSubmit(onFormSubmit)}>
            <Grid columns={12}>
              <Grid.Col span={6}>
                <TextInput
                  {...form.getInputProps("title")}
                  withAsterisk
                  label="Title"
                />
                <Textarea
                  {...form.getInputProps("description")}
                  label="Description"
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput {...form.getInputProps("ticket")} label="Ticket" />
              </Grid.Col>
              <Grid.Col span={3}>
                <Select
                  {...form.getInputProps("importance")}
                  label="Importance"
                  placeholder="Pick one"
                  // itemComponent={SelectItem}
                  data={data}
                  maxDropdownHeight={400}
                />
              </Grid.Col>
            </Grid>
            <Group position="right" spacing="xs">
              <Button size="xs" variant="default" component="a" href="/tasks">
                Cancel
              </Button>
              <Button loading={loading} size="xs" color="dark" type="submit">
                Save
              </Button>
            </Group>
          </form>
        </Card>
      </ApplicationLayout>
    </ProtectedPage>
  );
};

export default NewTask;
