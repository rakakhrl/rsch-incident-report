import { Button, Group, Modal, Stack, Text } from "@mantine/core";

interface IProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subTitle: React.ReactNode;
  onConfirm: () => void;
}

function ConfirmModal(props: IProps) {
  const { onClose, opened, subTitle, title, onConfirm } = props;

  const Title = () => {
    if (typeof title === "string") return <Text fz={16}>{title}</Text>;

    return title;
  };

  const SubTitle = () => {
    if (typeof subTitle === "string") return <Text fz={14}>{subTitle}</Text>;

    return subTitle;
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        size="md"
        title={<Title />}
        centered
      >
        <Stack>
          <SubTitle />
          <Group justify="flex-end">
            <Button variant="default">Cancel</Button>
            <Button onClick={onConfirm}>Confirm</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default ConfirmModal;
