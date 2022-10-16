import {
  AppShell,
  Avatar,
  Button,
  Container,
  Group,
  Header,
  Menu,
  Navbar,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import { useSession, signOut } from "next-auth/react";
import { ReactNode } from "react";

interface ApplicationLayoutProps {
  children: ReactNode;
}

const ApplicationHeader = () => {
  const session = useSession();

  const logOut = () => {
    signOut();
  };

  return (
    <Header height={55}>
      <Container size="md" pt={5}>
        <Group position="apart">
          <Title>
            TOD<span style={{ color: "#339af1" }}>AY</span>
          </Title>
          <Group spacing="lg">
            <Group spacing="xs">
              <Button variant="subtle" size="xs" component="a" href="/">
                Home
              </Button>
              <Button variant="subtle" size="xs" component="a" href="/tasks">
                Tasks
              </Button>
              <Button variant="subtle" size="xs" component="a" href="/requests">
                Requests
              </Button>
            </Group>
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton>
                  <Avatar
                    size={35}
                    radius="xl"
                    src={session.data?.user?.image}
                  ></Avatar>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={logOut} icon={<IconLogout size={14} />}>
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Container>
    </Header>
  );
};

const ApplicationLayout = ({ children }: ApplicationLayoutProps) => {
  return (
    <AppShell header={<ApplicationHeader />}>
      <Container size="md">{children}</Container>
    </AppShell>
  );
};

export default ApplicationLayout;
