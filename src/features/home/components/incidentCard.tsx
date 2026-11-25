import { Card, Text, Group, ThemeIcon } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserInjured,
  faUserTie,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

type IncidentType = "patient" | "employee" | "ncsf";

interface IncidentCardProps {
  type: IncidentType;
  onClick?: () => void;
}

const CONFIG = {
  patient: {
    title: "Patient Incident",
    description: "Incidents related to patient safety",
    icon: faUserInjured,
    color: "blue",
  },
  employee: {
    title: "Employee Incident",
    description: "Incidents experienced by employees",
    icon: faUserTie,
    color: "cyan",
  },
  ncsf: {
    title: "NCSF",
    description: "Safety culture violations",
    icon: faTriangleExclamation,
    color: "yellow",
  },
};

export function IncidentCard({ type, onClick }: IncidentCardProps) {
  const data = CONFIG[type];

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={onClick}
      style={{ cursor: "pointer" }}
      w="90vW"
    >
      <Group>
        <ThemeIcon size={50} radius="md" color={data.color} variant="light">
          <FontAwesomeIcon icon={data.icon} size="lg" />
        </ThemeIcon>

        <div>
          <Text fw={600}>{data.title}</Text>
          <Text size="sm" c="dimmed">
            {data.description}
          </Text>
        </div>
      </Group>
    </Card>
  );
}
