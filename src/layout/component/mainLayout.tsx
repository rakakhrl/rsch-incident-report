import { useDisclosure } from "@mantine/hooks";
import useAppRoute from "../../config/appRoute";
import {
  AppShell,
  Avatar,
  Burger,
  Group,
  NavLink,
  Stack,
  Text,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faHouse,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { decryptData } from "../../utils/encryptDecrypt";

function MainLayout() {
  const { location, go, replace } = useAppRoute();

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const user = localStorage.getItem("userID-value");

  useEffect(() => {
    if (user && user !== "") {
      const userData = decryptData(user);

      if (new Date(userData?.expiredDate) < new Date()) {
        localStorage.removeItem("userID-value");
        replace("/login");
      }
    } else {
      replace("/login");
    }
  }, [user]);

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        // disabled={disabled}
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group onClick={() => go("/dashboard")}>
              <Avatar
                variant="transparent"
                radius={84}
                size="md"
                src="/rs-charitas.png"
              />
              <Stack gap={0}>
                <Text fz={10} fw={600} c="green.6">
                  Incident Report System
                </Text>
                <Text fz={16} fw={600} c="green.9" mt={-4}>
                  Rumah Sakit Charitas
                </Text>
              </Stack>
            </Group>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <NavLink
            label="Home"
            leftSection={<FontAwesomeIcon icon={faHouse} />}
            onClick={() => {
              go("/home");
              toggleMobile();
            }}
          />
          <NavLink
            label="Logout"
            leftSection={<FontAwesomeIcon icon={faRightFromBracket} />}
            onClick={() => {
              localStorage.removeItem("userID-value");
              go("/login");
            }}
            variant="subtle"
            active
          />
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default MainLayout;
