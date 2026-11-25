import {
  Avatar,
  Box,
  Button,
  Center,
  getGradient,
  Stack,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDeviceInfo } from "../../utils/useDeviceInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faUser } from "@fortawesome/free-solid-svg-icons";
import useAppRoute from "../../config/appRoute";
import { useEffect } from "react";
import { decryptData } from "../../utils/encryptDecrypt";

function Landing() {
  const info = useDeviceInfo();
  const theme = useMantineTheme();
  const { go } = useAppRoute();

  const user = localStorage.getItem("userID-value");

  useEffect(() => {
    if (user && user !== "") {
      const userData = decryptData(user);

      if (userData?.expiredDate < new Date()) {
        localStorage.removeItem("userID-value");
        go("/login");
      }

      go("/home");
    }
  }, [user]);

  return (
    <>
      <Stack justify="space-between" h={info.size.height} w={info.size.width}>
        <Stack>
          <Box
            bg={getGradient({ deg: 90, from: "green.9", to: "green.6" }, theme)}
            w="100%"
            h={info.size.height * 0.3}
            style={{
              WebkitClipPath: "polygon(0 0, 100% 0, 100% 66%, 0 100%)",
              position: "relative",
              top: 0,
              left: 0,
            }}
          ></Box>
          <Center>
            <Avatar
              variant="transparent"
              radius={84}
              size="xl"
              src="/rs-charitas.png"
              style={{
                position: "absolute",
                top: info.size.height * 0.2,
                left: info.size.width * 0.385,
              }}
            />
          </Center>
          <Stack gap={0}>
            <Title ta="center" order={3} c="green.6">
              Incident Report System
            </Title>
            <Title ta="center" order={5} c="green.9">
              Rumah Sakit Charitas
            </Title>
          </Stack>
          <Stack align="center" pt="20%">
            <Button
              leftSection={<FontAwesomeIcon icon={faUser} />}
              w="80%"
              onClick={() => go("/login")}
            >
              Employee Login
            </Button>

            <Title order={6} fw={400} c="dimmed">
              OR
            </Title>

            <Button
              w="80%"
              variant="outline"
              onClick={() => go("whistleblowing")}
              leftSection={<FontAwesomeIcon icon={faBullhorn} />}
            >
              Report Whistleblowing Anonymously
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default Landing;
