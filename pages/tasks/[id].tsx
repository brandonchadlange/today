import {
  Anchor,
  Avatar,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Task } from "@prisma/client";
import { IconExclamationMark } from "@tabler/icons";
import { useEffect, useState } from "react";
import ApplicationLayout from "../../components/application-layout";
import ProtectedPage from "../../components/protected-page";
import axios from "axios";
import { useRouter } from "next/router";

const Request = () => {
  const [task, setTask] = useState<Task>();
  const router = useRouter();
  const task_id = router.query.id as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      if (task_id == undefined) return;

      const response = await axios.get<Task>("/api/tasks?task=" + task_id);
      setTask(response.data);
      setLoading(false);
    };

    fetchTask();
  }, [task_id]);

  const avatarColor = (importance: any) => {
    if (importance === "1") return "gray";
    if (importance === "2") return "orange";
    if (importance === "3") return "red";
  };

  const setTaskComplete = async () => {
    await axios.put("/api/tasks?task=" + task_id);
    router.push("/tasks");
  };

  return (
    <ProtectedPage>
      <ApplicationLayout>
        {loading && <Title>Loading...</Title>}
        {!loading && (
          <>
            <Card withBorder>
              <Group position="apart">
                <Title size={20}>{task!.title}</Title>
                <Avatar color={avatarColor(task?.importance)}>
                  <IconExclamationMark></IconExclamationMark>
                </Avatar>
              </Group>
              <Text weight="bold" mt="lg">
                Description
              </Text>
              <Text mb="lg">{task!.description}</Text>
              <Text weight="bold" mt="lg">
                Ticket
              </Text>
              <Anchor
                mt="lg"
                href={`https://aboutyou.atlassian.net/browse/${task?.ticket}`}
              >
                {task!.ticket}
              </Anchor>
              <Group mt="xl" position="apart">
                <Button variant="default" component="a" href="/tasks">
                  Cancel
                </Button>
                <Group spacing="xs">
                  <Button onClick={setTaskComplete}>Complete</Button>
                </Group>
              </Group>
            </Card>
          </>
        )}
      </ApplicationLayout>
    </ProtectedPage>
  );
};

export default Request;
