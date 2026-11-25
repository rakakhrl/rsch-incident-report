import {
  Container,
  Stack,
  Group,
  Button,
  Text,
  Card,
  UnstyledButton,
  useMantineTheme,
  ThemeIcon,
  LoadingOverlay,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { IncidentListCard } from "../incidentListCard/incidentListCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import type { ICardItem } from "./incidentListPageCard.type";

interface Props {
  title: string;
  data: ICardItem[];
  onCreate?: () => void;
  onClickBack: () => void;
  onFilter?: (from: string | null, to: string | null) => void;
  loading: boolean;
}

export function IncidentListPageCard({
  title,
  data,
  onCreate,
  onFilter,
  onClickBack,
  loading,
}: Props) {
  const theme = useMantineTheme();
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  return (
    <Container size="sm" py="md">
      <Stack gap="md">
        <Group mb={8}></Group>
        {/* Header */}
        <Group justify="space-between">
          <UnstyledButton
            style={{
              borderBottomStyle: "solid",
              borderWidth: 2,
              borderColor: theme.colors.gray[6],
              cursor: "pointer",
            }}
            onClick={onClickBack}
          >
            <Group gap={2} pr={2}>
              <ThemeIcon variant="transparent" color="gray">
                <FontAwesomeIcon icon={faArrowLeft} />
              </ThemeIcon>
              <Text fz={12} c="gray">
                Back
              </Text>
            </Group>
          </UnstyledButton>
          <Text fw={600} size="lg" w="50%" ta="center">
            {title}
          </Text>
          <Button onClick={onCreate} size="xs">
            + Add
          </Button>
        </Group>

        {/* Filter */}
        <Card withBorder radius="md" p="md">
          <Group>
            <DateInput
              value={from}
              onChange={setFrom}
              placeholder="From"
              size="xs"
              w="35%"
            />
            <DateInput
              value={to}
              onChange={setTo}
              placeholder="To"
              size="xs"
              w="35%"
            />
            <Button
              onClick={() => onFilter?.(from, to)}
              variant="light"
              size="xs"
            >
              Filter
            </Button>
          </Group>
        </Card>

        {/* List */}
        <Stack align="center">
          <LoadingOverlay visible={loading} />
          {data.map((item) => (
            <IncidentListCard
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              date={item.date}
              status={item.status}
            />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
