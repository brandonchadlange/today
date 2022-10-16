import {
  Avatar,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Task } from "@prisma/client";
import { IconExclamationMark } from "@tabler/icons";
import { useEffect, useState } from "react";
import ApplicationLayout from "../../components/application-layout";
import ProtectedPage from "../../components/protected-page";
import axios from "axios";
import { useSession } from "next-auth/react";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get<Task[]>("/api/tasks");
      setTasks(response.data);
    };

    fetchTasks();
  }, []);

  const avatarColor = (importance: any) => {
    if (importance === "1") return "gray";
    if (importance === "2") return "orange";
    if (importance === "3") return "red";
  };

  return (
    <ProtectedPage>
      <ApplicationLayout>
        <Group position="apart" align="start" mb="lg">
          <div>
            <Title size={20}>Your open tasks</Title>
            <Text>Manage or create tasks for yourself</Text>
          </div>
          <Button size="xs" color="dark" component="a" href="/tasks/new">
            Create Task
          </Button>
        </Group>
        <Stack mt="lg" spacing="xs">
          {tasks.map((task) => (
            <Card
              withBorder
              key={task.id}
              component="a"
              href={`/tasks/${task.id}`}
            >
              <Group>
                <Avatar color={avatarColor(task.importance)}>
                  <IconExclamationMark />
                </Avatar>
                <div>
                  <Text size="sm">{task.created_at!.toString()}</Text>
                  <Text>{task.title}</Text>
                </div>
              </Group>
            </Card>
          ))}
        </Stack>
      </ApplicationLayout>
    </ProtectedPage>
  );
};

export default Tasks;
