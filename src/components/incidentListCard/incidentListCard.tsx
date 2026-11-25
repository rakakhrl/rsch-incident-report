import { Card, Text, Group, Stack, Badge } from "@mantine/core";

interface IncidentCardItemProps {
  title: string;
  subtitle?: string;
  date: string;
  status?: boolean;
  onClick?: () => void;
}

export function IncidentListCard({
  title,
  subtitle,
  date,
  status,
  onClick,
}: IncidentCardItemProps) {
  return (
    <Card
      withBorder
      radius="md"
      p="md"
      onClick={onClick}
      style={{
        cursor: "pointer",
        width: "100%",
        maxWidth: 500,
      }}
    >
      <Stack gap={4}>
        <Group justify="space-between">
          <Text fw={600}>{title}</Text>
          {status !== undefined && (
            <Badge color={status ? "green" : "yellow"}>
              {status ? "Approved" : "Pending"}
            </Badge>
          )}
        </Group>
        {subtitle && (
          <Text size="sm" c="dimmed">
            {subtitle}
          </Text>
        )}
      </Stack>

      <Text size="xs" c="dimmed" mt="sm">
        {date}
      </Text>
    </Card>
  );
}
