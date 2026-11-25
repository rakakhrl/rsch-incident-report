import {
  Accordion,
  ActionIcon,
  Button,
  Divider,
  Fieldset,
  Group,
  NumberInput,
  Paper,
  Radio,
  ScrollArea,
  Select,
  Stack,
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
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "../../../components/confirmModal/confirmModal";
import { useWhistleblowingForm } from "../states/whistleblowing.local.state";
import type { IEmployeeResponse } from "../../employee/types";
import { usegetEmployeeList } from "../../employee/api/getEmployeeList";
import useDebounce from "../../../hooks/useDebounce";
import type { IPositionResponse } from "../../postition/types";
import { useGetPositionList } from "../../postition/api/getPositionList";
import type { IStandardReferenceResponse } from "../../standardReference/types/standardReference.type";
import { useGetStandardReference } from "../../standardReference/api/getStandardReference";
import { useCreateWhistleblowing } from "../api/createWhistleblowing";
import type { IWhistleblowingPayload } from "../types";
import dayjs from "dayjs";
import { showNotification } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faFile,
  faTrash,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useApproveWhistleblowing } from "../api/approveWhistleblowing";
import useAppRoute from "../../../config/appRoute";
import { Dropzone } from "@mantine/dropzone";
import { fileToBase64 } from "../../../utils/fileToBase64";
import { useEvidenceUpload } from "../api/evidenceUpload";
import { AltchaWidget, type AltchaWidgetRef } from "../../../components/captcha";
import { verifyCaptcha } from "../../../services/captcha.service";

function Whistleblowing() {
  const info = useDeviceInfo();
  const { go } = useAppRoute();
  const theme = useMantineTheme();

  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: "smooth",
    });

  // States
  const [opened, setOpened] = useState(false);
  const form = useWhistleblowingForm();
  const [employee, setEmployee] = useState<IEmployeeResponse[]>([]);
  const [searchEmp, setSearchEmp] = useState("");
  const [position, setPosition] = useState<IPositionResponse[]>([]);
  const [searchPosition, setSearchPosition] = useState("");
  const [type, setType] = useState<IStandardReferenceResponse[]>([]);
  const [isPositionDisabled, setIsPositionDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // State & Ref CAPTCHA
  const captchaRef = useRef<AltchaWidgetRef>(null);
  const [captchaPayload, setCaptchaPayload] = useState<string | null>(null);

  const getType = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "WhistleblowingType",
  });

  useEffect(() => {
    if (getType.data) {
      const res = getType.data.data.data;
      setType(res);
    }
  }, [getType.data]);

  useEffect(() => {
    getType.refetch();
  }, []);

  const getPosition = useGetPositionList({ TextToSearch: searchPosition });

  const fetchPosition = useDebounce(getPosition.refetch);

  useEffect(() => {
    fetchPosition();
  }, [searchPosition]);

  useEffect(() => {
    if (getPosition.data) {
      const res = getPosition.data.data.data;
      setPosition(res);
    }
  }, [getPosition.data]);

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

  const create = useCreateWhistleblowing({});

  const onCreate = async () => {
    const fields = [
      "ReporterEmailAddress",
      "SubjectPersonID",
      "SubjectPositionID",
      "SRWhistleblowingType",
      "DateOfIncident",
      "IncidentLocation",
      "Chronology",
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
              "Tantangan keamanan kedaluwarsa atau tidak valid. Silakan ulangi."}
          </Text>
        ),
        icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
        color: "red",
      });
      setCaptchaPayload(null);
      captchaRef.current?.reset();
      return;
    }

    const payload: IWhistleblowingPayload = {
      ...form.createForm.values,
      ReportingDateTime: dayjs(
        form.createForm.values.ReportingDateTime!,
      ).format("YYYY-MM-DD HH:mm"),
      SRWhistleblowingType: form.createForm.values.SRWhistleblowingType!,
      DateOfIncident: dayjs(form.createForm.values.DateOfIncident!).format(
        "YYYY-MM-DD HH:mm",
      ),
      SubjectPersonID: Number(form.createForm.values.SubjectPersonID),
      SubjectPositionID: Number(form.createForm.values.SubjectPositionID),
    };

    let whistleblowingNo = "";
    setIsLoading(true);

    try {
      const createRes = await create.mutateAsync({ payload });

      whistleblowingNo = createRes.data.data.WhistleblowingNo;

      showNotification({
        title: <Title order={5}>Report Created Successfully</Title>,
        message: <Text c="dark">Whistleblowing successfully created</Text>,
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
      await onUploadEvidence(whistleblowingNo);

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
      await onApprove(whistleblowingNo);

      showNotification({
        title: <Title order={5}>Report Approved</Title>,
        message: <Text c="dark">Your report will be processed</Text>,
        icon: <FontAwesomeIcon icon={faCheckCircle} size="xl" />,
        color: "green",
      });

      go("/");
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

  const approve = useApproveWhistleblowing({});

  const onApprove = async (whistleblowingNo: string) => {
    await approve.mutateAsync({
      payload: { WhistleblowingNo: whistleblowingNo },
    });
  };

  const upload = useEvidenceUpload({});

  const onUploadEvidence = async (transactionNo: string) => {
    const uploadPromises = form.fileStore.values.store.map((data) => {
      const payload = {
        ...data,
        TransactionNo: transactionNo,
        IncidentType: "wb",
      };

      return upload.mutateAsync({ payload });
    });

    await Promise.all(uploadPromises);
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
                onClick={() => go("/")}
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
                <Title order={3}>Whisleblowing Report</Title>
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
                  {...form.createForm.getInputProps("WhistleblowingNo")}
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

              <Fieldset legend="REPORTER DATA">
                <Stack gap={4}>
                  <Text fz={10} c="dimmed">
                    This information is confidential and is only for
                    confirmation purposes.
                  </Text>
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Reporter Name
                      </Text>
                    }
                    placeholder="Name"
                    {...form.createForm.getInputProps("ReporterName")}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Phone No
                      </Text>
                    }
                    placeholder="0812xxxxxxxx"
                    {...form.createForm.getInputProps("ReporterPhoneNo")}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Email
                      </Text>
                    }
                    placeholder="youremail@mail.com"
                    withAsterisk
                    {...form.createForm.getInputProps("ReporterEmailAddress")}
                  />
                </Stack>
              </Fieldset>

              <Fieldset legend="SUBJECT DATA">
                <Stack gap={4}>
                  <Text fz={10} c="dimmed">
                    This information is confidential and is needed for
                    follow-up.
                  </Text>
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Subject Name
                      </Text>
                    }
                    placeholder="Name"
                    withAsterisk
                    searchable
                    searchValue={searchEmp}
                    onSearchChange={(val) => {
                      setSearchEmp(val);
                    }}
                    data={employee.map((data) => ({
                      value: data.PersonID.toString(),
                      label: data.EmployeeName,
                    }))}
                    value={form.createForm.values.SubjectPersonID}
                    onChange={(val) => {
                      if (val) {
                        const find = employee.find(
                          (f) => f.PersonID.toString() === val,
                        );
                        if (find) {
                          if (find.PositionID === -1) {
                            setIsPositionDisabled(false);
                          } else {
                            form.createForm.setFieldValue(
                              "SubjectPositionID",
                              find.PositionID.toString()!,
                            );
                            setSearchPosition(find.PositionID.toString()!);
                            setIsPositionDisabled(true);
                          }
                        }
                      } else {
                        form.createForm.setFieldValue(
                          "SubjectPositionID",
                          null,
                        );
                        setSearchPosition("");
                        setIsPositionDisabled(true);
                      }
                      form.createForm.setFieldValue("SubjectPersonID", val);
                    }}
                    clearable
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Position
                      </Text>
                    }
                    placeholder="Manager"
                    withAsterisk
                    searchable
                    clearable
                    onSearchChange={setSearchPosition}
                    searchValue={searchPosition}
                    data={position.map((data) => ({
                      value: data.PositionID.toString(),
                      label: data.PositionName,
                    }))}
                    disabled={isPositionDisabled}
                    {...form.createForm.getInputProps("SubjectPositionID")}
                  />
                </Stack>
              </Fieldset>

              <Fieldset legend="INCIDENT DETAIL">
                <Stack gap={4}>
                  <Radio.Group
                    label="Type of Action / Deed Reported"
                    withAsterisk
                    size="xs"
                    {...form.createForm.getInputProps("SRWhistleblowingType")}
                  >
                    <Stack gap={6} mt="xs">
                      {type.map((data) => (
                        <Radio
                          size="xs"
                          value={data.ItemID}
                          label={data.ItemName}
                        />
                      ))}
                    </Stack>
                  </Radio.Group>
                  <DatePickerInput
                    size="xs"
                    label="Date of Incident"
                    placeholder="11-11-2025"
                    withAsterisk
                    {...form.createForm.getInputProps("DateOfIncident")}
                  />
                  <TextInput
                    size="xs"
                    label="Location"
                    placeholder="Location..."
                    withAsterisk
                    {...form.createForm.getInputProps("IncidentLocation")}
                  />
                  <Textarea
                    size="xs"
                    label="Chronology"
                    placeholder="Chronology..."
                    withAsterisk
                    autosize
                    minRows={2}
                    {...form.createForm.getInputProps("Chronology")}
                  />
                  <NumberInput
                    size="xs"
                    label="Nominal Amount"
                    hideControls
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                    placeholder="0.00"
                    {...form.createForm.getInputProps("NominalAmount")}
                  />
                </Stack>
              </Fieldset>

              <Fieldset legend="EVIDENCE">
                <Stack>
                  <Dropzone
                    accept={["image/*", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt"]}
                    maxSize={8 * 1024 * 1024}
                    onDrop={(files) => {
                      handleDrop(files);
                    }}
                    onReject={(files) => {
                      const reasons = files.map((file) => {
                        const ext = file.name
                          .slice(file.name.lastIndexOf("."))
                          .toLowerCase();
                        const allowedExtensions = [
                          ".pdf",
                          ".doc",
                          ".docx",
                          ".xls",
                          ".xlsx",
                          ".txt",
                        ];
                        const isImage = file.type.startsWith("image/");
                        const isAllowedDoc = allowedExtensions.includes(ext);

                        if (!isImage && !isAllowedDoc) {
                          return `${file.name}: tipe file tidak diizinkan (hanya gambar dan dokumen)`;
                        }
                        if (file.size > 8 * 1024 * 1024) {
                          return `${file.name}: melebihi batas ukuran 8 MB`;
                        }
                        return `${file.name}: file ditolak`;
                      }).join("\n");
                      showNotification({
                        title: <Title order={5}>File Ditolak</Title>,
                        message: <Text c="dark">{reasons}</Text>,
                        icon: (
                          <FontAwesomeIcon icon={faXmarkCircle} size="xl" />
                        ),
                        color: "red",
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
                          Hanya file gambar dan dokumen yang diizinkan (maks. 8 MB per file). Jika ingin mengunggah file video atau audio, silakan unggah ke layanan penyimpanan file (mis. Google Drive) lalu masukkan tautannya pada kolom Notes.
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
        title="Are you sure you want to send this whistleblowing report?"
        subTitle="Please double-check the information you entered before submitting. Once submitted, the report cannot be changed. Your identity will remain confidential."
      />
    </>
  );
}

export default Whistleblowing;
