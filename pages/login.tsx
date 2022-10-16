import {
  AppShell,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Login = () => {
  const { data: auth, status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/");
  }

  const signInWithGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <AppShell className="app-shell">
      <Container size="xs" style={{ height: "100%" }}>
        <Stack align="center" justify="center" style={{ height: "100%" }}>
          <Card withBorder style={{ width: "450px", textAlign: "center" }}>
            <Title size={20}>Log in</Title>
            <Text>Please sign in with your Google account</Text>
            <Group position="center" mt="xl">
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                leftIcon={<IconBrandGoogle size={18} />}
              >
                Sign In
              </Button>
            </Group>
          </Card>
        </Stack>
      </Container>
    </AppShell>
  );
};

export default Login;
