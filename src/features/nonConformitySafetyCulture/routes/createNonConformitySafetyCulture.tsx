import {
  Accordion,
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Fieldset,
  Group,
  Modal,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDeviceInfo } from "../../../utils/useDeviceInfo";
import { useEffect, useRef, useState } from "react";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import useAppRoute from "../../../config/appRoute";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faFile,
  faPen,
  faTrash,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useDisclosure } from "@mantine/hooks";
import { useNonConformityForm } from "../states/nonConformity.local.state";
import type { IStandardReferenceResponse } from "../../standardReference/types/standardReference.type";
import { useGetStandardReference } from "../../standardReference/api/getStandardReference";
import { useGetServiceUnitList } from "../../serviceUnit/api/getServiceUnitList";
import useDebounce from "../../../hooks/useDebounce";
import type { IEmployeeResponse } from "../../employee/types";
import { usegetEmployeeList } from "../../employee/api/getEmployeeList";
import type { IPositionResponse } from "../../postition/types";
import { useGetPositionList } from "../../postition/api/getPositionList";
import { useCreateNonConformity } from "../api/createNonConfirmity";
import type { INonConformityPayload } from "../types";
import type { IServiceUnitResponse } from "../../serviceUnit/types";
import { showNotification } from "@mantine/notifications";
import { useApproveNonConformity } from "../api/approveNonConformity";
import ConfirmModal from "../../../components/confirmModal/confirmModal";
import { Dropzone } from "@mantine/dropzone";
import { fileToBase64 } from "../../../utils/fileToBase64";
import { useEvidenceUpload } from "../../whistleblowing/api/evidenceUpload";
import { AltchaWidget, type AltchaWidgetRef } from "../../../components/captcha";
import { verifyCaptcha } from "../../../services/captcha.service";

function CreateNonConformitySafetyCulture() {
  const info = useDeviceInfo();
  const theme = useMantineTheme();
  const { go } = useAppRoute();

  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: "smooth",
    });

  // States
  const [opened, setOpened] = useState(false);
  const form = useNonConformityForm();
  const [classification, setClassification] = useState<
    IStandardReferenceResponse[]
  >([]);
  const [units, setUnits] = useState<IServiceUnitResponse[]>([]);
  const [searchUnit, setSearchUnit] = useState("");
  const [employee, setEmployee] = useState<IEmployeeResponse[]>([]);
  const [searchEmp, setSearchEmp] = useState("");
  const [positions, setPositions] = useState<IPositionResponse[]>([]);
  const [searchPosition, setSearchPosition] = useState("");
  const [profession, setProfession] = useState<IStandardReferenceResponse[]>(
    [],
  );
  const [subjectUnits, setSubjectUnits] = useState<IServiceUnitResponse[]>([]);
  const [searchSubjectUnit, setSearchSubjectUnit] = useState("");
  const [reporter, setReporter] = useState<IEmployeeResponse[]>([]);
  const [searchRpt, setSearchRpt] = useState("");
  const [rptId, setRptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State & Ref CAPTCHA
  const captchaRef = useRef<AltchaWidgetRef>(null);
  const [captchaPayload, setCaptchaPayload] = useState<string | null>(null);

  const getReporter = usegetEmployeeList({ TextToSearch: searchRpt });

  const fetchReporter = useDebounce(getReporter.refetch);

  useEffect(() => {
    fetchReporter();
  }, [searchRpt]);

  useEffect(() => {
    if (getReporter.data) {
      const res = getReporter.data.data.data;
      setReporter(res);
    }
  }, [getReporter.data]);

  const getSubjectUnit = useGetServiceUnitList({
    TextToSearch: searchSubjectUnit,
  });

  const fetchSubjectUnit = useDebounce(getSubjectUnit.refetch);

  useEffect(() => {
    fetchSubjectUnit();
  }, [searchSubjectUnit]);

  useEffect(() => {
    if (getSubjectUnit.data) {
      const res = getSubjectUnit.data.data.data;
      setSubjectUnits(res);
    }
  }, [getSubjectUnit.data]);

  const getPosition = useGetPositionList({ TextToSearch: searchPosition });

  const fetchPosition = useDebounce(getPosition.refetch);

  useEffect(() => {
    if (getPosition.data) {
      const res = getPosition.data.data.data;
      setPositions(res);
    }
  }, [getPosition.data]);

  useEffect(() => {
    fetchPosition();
  }, [searchPosition]);

  const getEmployee = usegetEmployeeList({ TextToSearch: searchEmp });

  const fetchEmployee = useDebounce(getEmployee.refetch);

  useEffect(() => {
    fetchEmployee();
  }, [searchEmp]);

  useEffect(() => {
    if (getEmployee.data) {
      const res = getEmployee.data.data.data;
      setEmployee(res);
    }
  }, [getEmployee.data]);

  const getUnit = useGetServiceUnitList({ TextToSearch: searchUnit });

  const fetchUnit = useDebounce(getUnit.refetch);

  useEffect(() => {
    fetchUnit();
  }, [searchUnit]);

  useEffect(() => {
    if (getUnit.data) {
      const res = getUnit.data.data.data;
      setUnits(res);
    }
  }, [getUnit.data]);

  const getProfession = useGetStandardReference({
    StandardReferenceID: "ProfessionGroup",
    NcComplaintClassification: "",
  });

  const getClassification = useGetStandardReference({
    StandardReferenceID: "NcComplaintClassification",
    NcComplaintClassification: "",
  });

  useEffect(() => {
    if (getProfession.data) {
      const res = getProfession.data.data.data;
      setProfession(res);
    }
  }, [getProfession.data]);

  useEffect(() => {
    if (getClassification.data) {
      const res = getClassification.data.data.data;
      setClassification(res);
    }
  }, [getClassification.data]);

  useEffect(() => {
    getClassification.refetch();
    getProfession.refetch();
  }, []);

  const rows =
    form.createForm.values.EmployeeNonConformitySafetyCultureSubject?.map(
      (element, index) => (
        <Table.Tr key={element.SubjectPersonID}>
          <Table.Td>
            <Text fz={10}>{element.SubjectName}</Text>
          </Table.Td>
          <Table.Td>
            <Text fz={10}>{element.PositionName}</Text>
          </Table.Td>
          <Table.Td>
            <Text fz={10}>{element.ProfessionName}</Text>
          </Table.Td>
          <Table.Td>
            <Text fz={10}>{element.UnitName}</Text>
          </Table.Td>
          <Table.Td>
            <Checkbox size="xs" checked={element.IsMainSubject} />
          </Table.Td>
          <Table.Td>
            <Group gap={4} w={45}>
              <ActionIcon
                size={"xs"}
                variant="white"
                onClick={() => {
                  form.subject.setValues(element);
                  setSearchPosition(element.SubjectPositionID!);
                  setSearchSubjectUnit(element.SubjectServiceUnitID!);
                  form.createForm.removeListItem(
                    `EmployeeNonConformitySafetyCultureSubject`,
                    index,
                  );
                }}
              >
                <FontAwesomeIcon icon={faPen} />
              </ActionIcon>
              <ActionIcon
                size={"xs"}
                variant="white"
                color="gray.3"
                onClick={() => {
                  form.createForm.removeListItem(
                    `EmployeeNonConformitySafetyCultureSubject`,
                    index,
                  );
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </ActionIcon>
            </Group>
          </Table.Td>
        </Table.Tr>
      ),
    );

  const onAdd = () => {
    if (
      form.subject.values.SubjectPersonID &&
      form.subject.values.SubjectPositionID &&
      form.subject.values.SubjectServiceUnitID &&
      form.subject.values.SRSubjectProfessionGroup
    ) {
      const pos =
        positions.find(
          (f) =>
            f.PositionID.toString() === form.subject.values.SubjectPositionID,
        )?.PositionName ?? "";
      const prof =
        profession.find(
          (f) => f.ItemID === form.subject.values.SRSubjectProfessionGroup,
        )?.ItemName ?? "";
      const sUnit =
        subjectUnits.find(
          (f) =>
            f.OrganizationUnitID.toString() ===
            form.subject.values.SubjectServiceUnitID,
        )?.OrganizationUnitName ?? "";
      form.createForm.insertListItem(
        "EmployeeNonConformitySafetyCultureSubject",
        {
          ...form.subject.values,
          PositionName: pos,
          ProfessionName: prof,
          UnitName: sUnit,
        },
      );

      form.subject.reset();
    }
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    const results = await Promise.all(
      acceptedFiles.map(async (file) => {
        const base64 = await fileToBase64(file);
        return { file, base64 };
      }),
    );

    results.map((res) => {
      const data = {
        TransactionNo: "",
        IncidentType: null,
        DocumentName: "",
        DocumentDate: dayjs(res.file.lastModified).format("YYYY-MM-DD"),
        Notes: "",
        OriFileName: res.file.name,
        Base64File: res.base64 as string,
      };
      form.fileStore.insertListItem(`store`, data);
    });
  };

  const create = useCreateNonConformity({});

  const onCreate = async () => {
    const fields = [
      "ReporterServiceUnitID",
      "ReporterPhoneNo",
      "ReportingRelationship",
    ];
    const validations = fields.map((f) => {
      const val = (form.createForm.values as any)[f] !== null;

      if (!val) {
        form.createForm.setFieldError(f, "Isi bagian ini");
      }
      return val;
    });
    const isValid = validations.find((f) => f === false) ? false : true;

    const docNames = form.fileStore.values.store.map(
      (d) => d.DocumentName !== "",
    );
    const isNameValid = docNames.find((val) => val === false) ? false : true;

    if (!(isValid && isNameValid)) return;

    if (!captchaPayload) {
      showNotification({
        title: <Title order={5}>Verifikasi Diperlukan</Title>,
        message: (
          <Text c="dark">
            Silakan selesaikan verifikasi CAPTCHA terlebih dahulu.
          </Text>
        ),
        icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
        color: "red",
      });
      return;
    }

    setIsLoading(true);

    const captchaRes = await verifyCaptcha(captchaPayload);
    if (!captchaRes.verified) {
      setIsLoading(false);
      showNotification({
        title: <Title order={5}>Verifikasi CAPTCHA Gagal</Title>,
        message: (
          <Text c="dark">
            {captchaRes.error ||
              "Tantangan keamanan kedaluwarsa atau tidak valid. Silakan coba lagi."}
          </Text>
        ),
        icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
        color: "red",
      });
      setCaptchaPayload(null);
      captchaRef.current?.reset();
      return;
    }

    const payload: INonConformityPayload = {
      ...form.createForm.values,
      ReportingDateTime: dayjs(form.createForm.values.ReportingDateTime).format(
        "YYYY-MM-DD HH:mm",
      ),
      EmployeeNonConformitySafetyCultureSubject:
        form.createForm.values.EmployeeNonConformitySafetyCultureSubject.map(
          (d) => ({
            SubjectPersonID: d.SubjectPersonID!,
            SubjectPositionID: d.SubjectPositionID!,
            SRSubjectProfessionGroup: d.SRSubjectProfessionGroup!,
            SubjectServiceUnitID: d.SubjectServiceUnitID!,
            IsMainSubject: d.IsMainSubject,
          }),
        ),
    };

    let transactionNo = "";
    setIsLoading(true);

    try {
      const createRes = await create.mutateAsync({ payload });

      transactionNo = createRes.data.data.NonConformityNo;

      showNotification({
        title: <Title order={5}>Report Created Successfully</Title>,
        message: (
          <Text c="dark">Non conformity report successfully created</Text>
        ),
        icon: <FontAwesomeIcon icon={faCheckCircle} size="xl" />,
        color: "green",
      });
    } catch (error: any) {
      setIsLoading(false);

      showNotification({
        title: <Title order={5}>Create Report Failed</Title>,
        message: <Text c="dark">{error.message}</Text>,
        icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
        color: "red",
      });

      return;
    }

    try {
      await onUploadEvidence(transactionNo);

      showNotification({
        title: <Title order={5}>Upload Success</Title>,
        message: <Text c="dark">Evidence uploaded successfully</Text>,
        icon: <FontAwesomeIcon icon={faCheckCircle} size="xl" />,
        color: "green",
      });
    } catch (error: any) {
      setIsLoading(false);

      showNotification({
        title: <Title order={5}>Upload Failed</Title>,
        message: <Text c="dark">{error.message}</Text>,
        icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
        color: "red",
      });

      return;
    }

    try {
      await onApprove(transactionNo);

      showNotification({
        title: <Title order={5}>Report Approved</Title>,
        message: <Text c="dark">Your report will be processed</Text>,
        icon: <FontAwesomeIcon icon={faCheckCircle} size="xl" />,
        color: "green",
      });
      go("/non-conformity-safety-culture");
    } catch (error: any) {
      setIsLoading(false);

      showNotification({
        title: <Title order={5}>Approve Failed</Title>,
        message: <Text c="dark">{error.message}</Text>,
        icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
        color: "red",
      });
    }
  };

  const approve = useApproveNonConformity({});

  const onApprove = async (incidentNo: string) => {
    await approve.mutateAsync({ payload: { NonConformityNo: incidentNo } });
  };

  const upload = useEvidenceUpload({});

  const onUploadEvidence = async (transactionNo: string) => {
    const uploadPromises = form.fileStore.values.store.map((data) => {
      const payload = {
        ...data,
        TransactionNo: transactionNo,
        IncidentType: "nc",
      };

      return upload.mutateAsync({ payload });
    });

    await Promise.all(uploadPromises);
  };

  return (
    <>
      <ScrollArea h={info.size.height} viewportRef={viewport}>
        <Stack
          justify="space-between"
          h={info.size.height}
          w={info.size.width}
          align="center"
          display={opened ? "none" : ""}
        >
          <Paper shadow="md" p="xl" w={info.size.width * 0.9} mt="xs">
            <Group mb={8}>
              <UnstyledButton
                style={{
                  borderBottomStyle: "solid",
                  borderWidth: 2,
                  borderColor: theme.colors.gray[6],
                  cursor: "pointer",
                }}
                onClick={() => go("/non-conformity-safety-culture")}
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
            </Group>
            <Stack>
              <Stack gap={4}>
                <Title order={3}>Non Conformity Safety Culture Report</Title>
                <Divider />
              </Stack>
              <Stack gap={4}>
                <TextInput
                  size="xs"
                  label={
                    <Text fz={12} fw={600}>
                      Report No
                    </Text>
                  }
                  placeholder="WB/202511-0002"
                  disabled
                  {...form.createForm.getInputProps("NonConformityNo")}
                />
                <DateTimePicker
                  size="xs"
                  label={
                    <Text fz={12} fw={600}>
                      Reporting Date
                    </Text>
                  }
                  placeholder="Select date and time"
                  {...form.createForm.getInputProps("ReportingDateTime")}
                />
              </Stack>

              <Fieldset legend="">
                <Stack gap={4}>
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Complaint Classification
                      </Text>
                    }
                    placeholder="Classification"
                    withAsterisk
                    searchable
                    clearable
                    data={classification.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    {...form.createForm.getInputProps(
                      "SRNcComplaintClassification",
                    )}
                  />
                  <Textarea
                    size="xs"
                    label="Complaint Description"
                    placeholder="Description..."
                    autosize
                    minRows={2}
                    {...form.createForm.getInputProps("ComplaintDescription")}
                  />
                </Stack>
              </Fieldset>

              <Fieldset legend="REPORTER DATA">
                <Stack gap={4}>
                  <Text fz={10} c="dimmed">
                    This information is confidential and is only for further
                    investigation if needed.
                  </Text>
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Reporter Name
                      </Text>
                    }
                    placeholder="Name"
                    withAsterisk
                    clearable
                    data={reporter.map((data) => ({
                      value: data.PersonID.toString(),
                      label: data.EmployeeName,
                    }))}
                    value={rptId}
                    onChange={(val) => {
                      if (val) {
                        const find = reporter.find(
                          (f) => f.PersonID.toString() === val,
                        );
                        if (find) {
                          form.createForm.setFieldValue(
                            "ReporterServiceUnitID",
                            find.ServiceUnitID,
                          );
                        }
                        setRptId(val);
                      }
                    }}
                    searchable
                    onSearchChange={(val) => setSearchRpt(val)}
                    searchValue={searchRpt}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Work Unit
                      </Text>
                    }
                    placeholder="Unit"
                    withAsterisk
                    clearable
                    data={units.map((data) => ({
                      value: data.OrganizationUnitID.toString(),
                      label: data.OrganizationUnitName,
                    }))}
                    searchable
                    onSearchChange={(val) => setSearchUnit(val)}
                    searchValue={searchUnit}
                    {...form.createForm.getInputProps("ReporterServiceUnitID")}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Phone No
                      </Text>
                    }
                    withAsterisk
                    placeholder="08xxxxxxx"
                    {...form.createForm.getInputProps("ReporterPhoneNo")}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Relationship With The Subject
                      </Text>
                    }
                    withAsterisk
                    placeholder="Relationship"
                    {...form.createForm.getInputProps("ReportingRelationship")}
                  />
                </Stack>
              </Fieldset>

              <Fieldset legend="SUBJECT DATA">
                <Stack>
                  <Text fz={10} c="dimmed">
                    This information is confidential and is needed for
                    follow-up.
                  </Text>

                  <Fieldset legend="">
                    <Stack gap={4}>
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Subject Name
                          </Text>
                        }
                        placeholder="Name"
                        data={employee.map((data) => ({
                          value: data.EmployeeName,
                          label: data.EmployeeName,
                        }))}
                        searchable
                        clearable
                        onSearchChange={setSearchEmp}
                        searchValue={searchEmp}
                        value={form.subject.values.SubjectName}
                        onChange={(val) => {
                          if (val) {
                            const find = employee.find(
                              (f) => f.EmployeeName === val,
                            );
                            if (find) {
                              form.subject.setFieldValue(
                                "SubjectPersonID",
                                find.PersonID.toString(),
                              );
                              form.subject.setFieldValue(
                                "SubjectPositionID",
                                find.PositionID.toString(),
                              );
                              form.subject.setFieldValue(
                                "SubjectServiceUnitID",
                                find.ServiceUnitID,
                              );
                              form.subject.setFieldValue(
                                `SRSubjectProfessionGroup`,
                                find.SRProfessionGroup.ItemID
                                  ? find.SRProfessionGroup.ItemID.toString()
                                  : find.SRProfessionGroup.ItemID,
                              );
                              setSearchPosition(find.PositionID.toString());
                              setSearchSubjectUnit(find.ServiceUnitID);
                            }
                          } else {
                            form.subject.setFieldValue("SubjectPersonID", null);
                            form.subject.setFieldValue(
                              "SubjectPositionID",
                              null,
                            );
                            form.subject.setFieldValue(
                              "SubjectServiceUnitID",
                              null,
                            );
                            form.subject.setFieldValue(
                              `SRSubjectProfessionGroup`,
                              null,
                            );
                            setSearchPosition("");
                            setSearchSubjectUnit("");
                          }
                          form.subject.setFieldValue("SubjectName", val);
                        }}
                      />
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Position
                          </Text>
                        }
                        placeholder="Manager"
                        data={positions.map((data) => ({
                          value: data.PositionID.toString(),
                          label: data.PositionName,
                        }))}
                        disabled
                        searchable
                        clearable
                        onSearchChange={(val) => setSearchPosition(val)}
                        searchValue={searchPosition}
                        {...form.subject.getInputProps("SubjectPositionID")}
                      />
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Profession Type
                          </Text>
                        }
                        placeholder="Profession"
                        data={profession.map((data) => ({
                          value: data.ItemID,
                          label: `${data.Note} - ${data.ItemName}`,
                        }))}
                        searchable
                        clearable
                        {...form.subject.getInputProps(
                          "SRSubjectProfessionGroup",
                        )}
                      />
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Work Unit
                          </Text>
                        }
                        placeholder="Unit"
                        withAsterisk
                        data={subjectUnits.map((data) => ({
                          value: data.OrganizationUnitID.toString(),
                          label: data.OrganizationUnitName,
                        }))}
                        disabled
                        searchable
                        clearable
                        onSearchChange={(val) => setSearchSubjectUnit(val)}
                        searchValue={searchSubjectUnit}
                        {...form.subject.getInputProps("SubjectServiceUnitID")}
                      />
                      <Checkbox
                        size="xs"
                        label="Main Subject"
                        mt={"xs"}
                        checked={form.subject.values.IsMainSubject}
                        {...form.subject.getInputProps("IsMainSubject")}
                      />
                      <Group gap={4} justify="flex-end">
                        <Button size="xs" onClick={onAdd}>
                          Add
                        </Button>
                      </Group>
                    </Stack>
                  </Fieldset>

                  <Divider />

                  <Table.ScrollContainer minWidth={info.size.width}>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>
                            <Text fz={10} fw={600}>
                              Subject Name
                            </Text>
                          </Table.Th>
                          <Table.Th>
                            <Text fz={10} fw={600}>
                              Position
                            </Text>
                          </Table.Th>
                          <Table.Th>
                            <Text fz={10} fw={600}>
                              Profession Type
                            </Text>
                          </Table.Th>
                          <Table.Th>
                            <Text fz={10} fw={600}>
                              Work Unit
                            </Text>
                          </Table.Th>
                          <Table.Th>
                            <Text fz={10} fw={600}>
                              Main Subject
                            </Text>
                          </Table.Th>
                          <Table.Th>
                            <Text fz={10} fw={600}></Text>
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Stack>
              </Fieldset>

              <Fieldset legend="EVIDENCE">
                <Stack>
                  <Dropzone
                    onDrop={(files) => {
                      handleDrop(files);
                    }}
                    onReject={(files) => {
                      showNotification({
                        title: <Title order={5}>Files Rejected</Title>,
                        message: <Text c="dark"></Text>,
                        icon: (
                          <FontAwesomeIcon icon={faCheckCircle} size="xl" />
                        ),
                        color: "green",
                      });
                    }}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      mih={220}
                      style={{ pointerEvents: "none" }}
                    >
                      <Dropzone.Accept>
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <FontAwesomeIcon icon={faXmarkCircle} />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <FontAwesomeIcon icon={faFile} size="2xl" />
                      </Dropzone.Idle>

                      <div>
                        <Text size="xl" inline>
                          Click to select files
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Attach as many files as you need, file can be image,
                          document, audio, or video.
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                  <Stack gap={4}>
                    <Text fz={12}>Evidence List</Text>
                    <Divider />
                  </Stack>
                  <Accordion order={3} multiple>
                    {form.fileStore.values.store.map((v, index) => (
                      <Accordion.Item key={index} value={v.OriFileName}>
                        <Accordion.Control>{v.OriFileName}</Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap={4}>
                            <Group gap={4}>
                              <Text fz={12}>Evidence #{index + 1}</Text>
                              <Tooltip label="Delete" withArrow>
                                <ActionIcon
                                  variant="transparent"
                                  color="gray"
                                  onClick={() =>
                                    form.fileStore.removeListItem(
                                      `store`,
                                      index,
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrash} size="xs" />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                            <TextInput
                              size="xs"
                              label="Document Name"
                              withAsterisk
                              {...form.fileStore.getInputProps(
                                `store.${index}.DocumentName`,
                              )}
                            />
                            <DatePickerInput
                              size="xs"
                              label="Document Date"
                              {...form.fileStore.getInputProps(
                                `store.${index}.DocumentDate`,
                              )}
                            />
                            <Textarea
                              size="xs"
                              autosize
                              minRows={2}
                              maxRows={4}
                              label="Notes"
                              {...form.fileStore.getInputProps(
                                `store.${index}.Notes`,
                              )}
                            />
                            <Divider mt={12} />
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Stack>
              </Fieldset>

              <Fieldset legend="VERIFIKASI KEAMANAN (CAPTCHA)">
                <AltchaWidget
                  ref={captchaRef}
                  onVerified={(p) => setCaptchaPayload(p)}
                  onStateChange={(state) => {
                    if (state !== "verified") setCaptchaPayload(null);
                  }}
                />
              </Fieldset>

              <Button
                size="xs"
                onClick={() => {
                  if (!captchaPayload) {
                    showNotification({
                      title: <Title order={5}>Verifikasi Diperlukan</Title>,
                      message: (
                        <Text c="dark">
                          Silakan selesaikan verifikasi CAPTCHA terlebih dahulu
                          sebelum mengirim laporan.
                        </Text>
                      ),
                      icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
                      color: "red",
                    });
                    return;
                  }
                  setOpened(true);
                }}
                loading={isLoading}
              >
                Submit
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </ScrollArea>

      <ConfirmModal
        opened={opened}
        onClose={() => setOpened(false)}
        onConfirm={() => {
          setOpened(false);
          scrollToBottom();
          onCreate();
        }}
        title="Are you sure you want to submit this report?"
        subTitle="Make sure the data you entered is correct before proceeding to submit."
      />
    </>
  );
}

export default CreateNonConformitySafetyCulture;
