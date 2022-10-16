import {
  Avatar,
  Button,
  Card,
  Grid,
  Group,
  Select,
  SelectItem,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconExclamationMark } from "@tabler/icons";
import { forwardRef, useEffect, useState } from "react";
import ApplicationLayout from "../../components/application-layout";
import ProtectedPage from "../../components/protected-page";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useRouter } from "next/router";
import { User } from "@prisma/client";

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

const NewRequest = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SelectItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get<User[]>("/api/users");
      setUsers(
        response.data.map((user) => ({
          label: user.name!,
          value: user.id,
        }))
      );
    };

    getUsers();
  }, []);

  const form = useForm({
    initialValues: {
      title: "",
      assignedToUserId: "",
      description: "",
      ticket: "",
      importance: "1",
    },
  });

  const onFormSubmit = async (values: any) => {
    setLoading(true);
    await axios.post("/api/requests", values);
    router.push("/requests");
  };

  return (
    <ProtectedPage>
      <ApplicationLayout>
        <Group position="apart" align="start" mb="lg">
          <div>
            <Title size={20}>Create request</Title>
            <Text>Create a new request</Text>
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
              <Grid.Col span={6}>
                <Grid columns={6}>
                  <Grid.Col span={6}>
                    <Select
                      {...form.getInputProps("assignedToUserId")}
                      label="User"
                      placeholder="Pick one"
                      data={users}
                      searchable
                      maxDropdownHeight={400}
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      {...form.getInputProps("ticket")}
                      label="Ticket"
                    />
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
              </Grid.Col>
            </Grid>
            <Group position="right" spacing="xs" mt="xl">
              <Button
                size="xs"
                variant="default"
                component="a"
                href="/requests"
              >
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

export default NewRequest;
