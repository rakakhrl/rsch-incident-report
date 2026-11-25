import { Container, ScrollArea, Stack } from "@mantine/core";
import { useDeviceInfo } from "../../../utils/useDeviceInfo";
import { IncidentCard } from "../components/incidentCard";
import useAppRoute from "../../../config/appRoute";

function Home() {
  const info = useDeviceInfo();
  const { go } = useAppRoute();

  return (
    <>
      <ScrollArea h={info.size.height - 60} pt="md">
        <Container size="xs">
          <Stack align="center" gap="md">
            <IncidentCard
              type="patient"
              onClick={() => go("/patient-incident")}
            />
            <IncidentCard
              type="employee"
              onClick={() => go("/employee-incident")}
            />
            <IncidentCard
              type="ncsf"
              onClick={() => go("/non-conformity-safety-culture")}
            />
          </Stack>
        </Container>
      </ScrollArea>
    </>
  );
}

export default Home;
