import { Card, Grid, Stack, Text, Title } from "@mantine/core";
import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import ApplicationLayout from "../components/application-layout";
import ProtectedPage from "../components/protected-page";

interface DashboardData {
  open_tasks: number;
  open_requests: number;
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboardData] = useState<DashboardData>();

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get<DashboardData>("/api/dashboard");
      setDashboardData(response.data);
      setLoading(false);
    };

    fetchTasks();
  }, []);

  return (
    <ProtectedPage>
      <ApplicationLayout>
        {loading && <Title>Loading...</Title>}
        {!loading && (
          <>
            <Grid columns={4}>
              <Grid.Col span={1}>
                <Card withBorder style={{ textAlign: "center" }}>
                  <Title>{dashboard?.open_tasks}</Title>
                  <Text>Open Tasks</Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={1}>
                <Card withBorder style={{ textAlign: "center" }}>
                  <Title>{dashboard?.open_requests}</Title>
                  <Text>Open Requests</Text>
                </Card>
              </Grid.Col>
            </Grid>
            <Grid columns={2} mt="lg">
              <Grid.Col span={1}>
                <Title size={20} mb="xs">
                  Finished Today
                </Title>
                <Stack spacing="xs">
                  <Card withBorder p="sm">
                    <Text>Open Tasks</Text>
                  </Card>
                  <Card withBorder p="sm">
                    <Text>Open Tasks</Text>
                  </Card>
                </Stack>
              </Grid.Col>
              <Grid.Col span={1}>
                <Title size={20} mb="xs">
                  Finished Today
                </Title>
                <Stack spacing="xs">
                  <Card withBorder p="sm">
                    <Text>Open Tasks</Text>
                  </Card>
                  <Card withBorder p="sm">
                    <Text>Open Tasks</Text>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>
          </>
        )}
      </ApplicationLayout>
    </ProtectedPage>
  );
};

export default Home;
