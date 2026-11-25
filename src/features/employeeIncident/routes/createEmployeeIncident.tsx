import {
  Accordion,
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Fieldset,
  Group,
  Loader,
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
import { useEffect, useRef, useState } from "react";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import useAppRoute from "../../../config/appRoute";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faFile,
  faTrash,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useEmployeeIncidentForm } from "../states/employeeIncident.state";
import { useGetStandardReference } from "../../standardReference/api/getStandardReference";
import type { IStandardReferenceResponse } from "../../standardReference/types/standardReference.type";
import type { IRegistrationResponse } from "../../registration/types";
import { useGetRegistrationList } from "../../registration/api/getRegistrationList";
import useDebounce from "../../../hooks/useDebounce";
import { usegetEmployeeList } from "../../employee/api/getEmployeeList";
import type { IEmployeeResponse } from "../../employee/types";
import type { IServiceUnitResponse } from "../../serviceUnit/types";
import { useGetServiceUnitList } from "../../serviceUnit/api/getServiceUnitList";
import { useGetPositionList } from "../../postition/api/getPositionList";
import type { IPositionResponse } from "../../postition/types";
import { useGetRiskGradingList } from "../../riskGrading/api/getRiskGrading";
import { modals } from "@mantine/modals";
import { useCreateEmployeeIncident } from "../api/createEmployeeIncident";
import type { IEmployeeIncidentPayload } from "../types";
import ConfirmModal from "../../../components/confirmModal/confirmModal";
import { useApproveEmployeeIncident } from "../api/approveEmployeeIncident";
import { showNotification } from "@mantine/notifications";
import type {
  IEmployeeIncidentPayload01,
  IEmployeeIncidentPayload02,
  IEmployeeIncidentPayload03,
  IEmployeeIncidentPayload04,
} from "../types/employeeIncident.type";
import { Dropzone } from "@mantine/dropzone";
import { fileToBase64 } from "../../../utils/fileToBase64";
import { useEvidenceUpload } from "../../whistleblowing/api/evidenceUpload";
import { AltchaWidget, type AltchaWidgetRef } from "../../../components/captcha";
import { verifyCaptcha } from "../../../services/captcha.service";

function CreateEmployeeIncident() {
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
  const form = useEmployeeIncidentForm();
  const [aid, setAid] = useState<IStandardReferenceResponse[]>([]);
  const [reg, setReg] = useState<IRegistrationResponse[]>([]);
  const [searchReg, setSearchReg] = useState("");
  const [gender, setGender] = useState<IStandardReferenceResponse[]>([]);
  const [employee, setEmployee] = useState<IEmployeeResponse[]>([]);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [units, setUnits] = useState<IServiceUnitResponse[]>([]);
  const [searchUnit, setSearchUnit] = useState("");
  const [positions, setPositions] = useState<IPositionResponse[]>([]);
  const [searchPosition, setSearchPosition] = useState("");
  const [empType, setEmpType] = useState<IStandardReferenceResponse[]>([]);
  const [incidentTypeList, setIncidentTypeList] = useState<
    IStandardReferenceResponse[]
  >([]);
  const [consequences, setConsequences] = useState<
    IStandardReferenceResponse[]
  >([]);
  const [outTreatment, setOutTreatment] = useState<
    IStandardReferenceResponse[]
  >([]);
  const [treatIn, setTreatIn] = useState<IStandardReferenceResponse[]>([]);
  const [isPositionDisabled, setIsPositionDisabled] = useState(true);
  const [PPType, setPPType] = useState<IStandardReferenceResponse[]>([]);
  const [searchPPType, setSearchPPType] = useState("");
  const [PPClass, setPPClass] = useState<IStandardReferenceResponse[]>([]);
  const [searchPPClass, setSearchPPClass] = useState("");
  const [PPItem, setPPItem] = useState<IStandardReferenceResponse[]>([]);
  const [searchPPItem, setSearchPPItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State & Ref CAPTCHA
  const captchaRef = useRef<AltchaWidgetRef>(null);
  const [captchaPayload, setCaptchaPayload] = useState<string | null>(null);

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

  const getEmployee = usegetEmployeeList({ TextToSearch: searchEmployee });

  const fetchEmployee = useDebounce(getEmployee.refetch);

  useEffect(() => {
    fetchEmployee();
  }, [searchEmployee]);

  useEffect(() => {
    if (getEmployee.data) {
      const res = getEmployee.data.data.data;
      setEmployee(res);
    }
  }, [getEmployee.data]);

  const getRegistration = useGetRegistrationList({ TextToSearch: searchReg });

  const fetchRegistration = useDebounce(getRegistration.refetch);

  useEffect(() => {
    fetchRegistration();
  }, [searchReg]);

  useEffect(() => {
    if (getRegistration.data) {
      const res = getRegistration.data.data.data;
      setReg(res);
    }
  }, [getRegistration.data]);

  const getPPItem = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "PakPahkClassificationItem",
  });

  const getPPClass = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "PakPahkClassification",
  });

  const getPPType = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "PakPahkType",
  });

  const getOutTreatment = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "OutpatientTreatment",
  });

  const getTreatIn = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "BeingTreatedIn",
  });

  const getConsequence = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "ConsequencesSuffered",
  });

  const getEmploymentType = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "EmploymentType",
  });

  const getGender = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "GenderType",
  });

  const getAid = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "FirstAidCenter",
  });

  const getIncidentType = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "EmployeeIncidentType",
  });

  useEffect(() => {
    if (getPPItem.data) {
      const res = getPPItem.data.data.data;
      setPPItem(res);
    }
  }, [getPPItem.data]);

  useEffect(() => {
    if (getPPClass.data) {
      const res = getPPClass.data.data.data;
      setPPClass(res);
    }
  }, [getPPClass.data]);

  useEffect(() => {
    if (getPPType.data) {
      const res = getPPType.data.data.data;
      setPPType(res);
    }
  }, [getPPType.data]);

  useEffect(() => {
    if (getTreatIn.data) {
      const res = getTreatIn.data.data.data;
      setTreatIn(res);
    }
  }, [getTreatIn.data]);

  useEffect(() => {
    if (getOutTreatment.data) {
      const res = getOutTreatment.data.data.data;
      setOutTreatment(res);
    }
  }, [getOutTreatment.data]);

  useEffect(() => {
    if (getConsequence.data) {
      const res = getConsequence.data.data.data;
      setConsequences(res);
    }
  }, [getConsequence.data]);

  useEffect(() => {
    if (getIncidentType.data) {
      const res = getIncidentType.data.data.data;
      setIncidentTypeList(res);
    }
  }, [getIncidentType.data]);

  useEffect(() => {
    if (getEmploymentType.data) {
      const res = getEmploymentType.data.data.data;
      setEmpType(res);
    }
  }, [getEmploymentType.data]);

  useEffect(() => {
    if (getGender.data) {
      const res = getGender.data.data.data;
      setGender(res);
    }
  }, [getGender.data]);

  useEffect(() => {
    if (getAid.data) {
      const res = getAid.data.data.data;
      setAid(res);
    }
  }, [getAid.data]);

  const getRisk = useGetRiskGradingList({});

  useEffect(() => {
    getAid.refetch();
    getGender.refetch();
    getRisk.refetch();
    getEmploymentType.refetch();
    getIncidentType.refetch();
    getConsequence.refetch();
    getOutTreatment.refetch();
    getTreatIn.refetch();
    getPPType.refetch();
    getPPClass.refetch();
    getPPItem.refetch();
  }, []);

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

  const create = useCreateEmployeeIncident({});

  const onCreate = async () => {
    let createPayload: any = {};
    let transactionNo = "";

    const docNames = form.fileStore.values.store.map(
      (d) => d.DocumentName !== "",
    );
    const isNameValid = docNames.find((val) => val === false) ? false : true;

    if (!isNameValid) return;

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

    if (form.employeeForm.values.SREmployeeIncidentType === "01") {
      createPayload = {
        ...form.employeeForm.values,
        ...form.type01Form.values,
        ReportingDateTime: form.employeeForm.values.ReportingDateTime!,
        SRFirstAidCenter: form.employeeForm.values.SRFirstAidCenter!,
        RegistrationNo: form.employeeForm.values.RegistrationNo!,
        PersonID: Number(form.employeeForm.values.PersonID!),
        BirthDate: dayjs(form.employeeForm.values.BirthDate!).format(
          "YYYY-MM-DD",
        ),
        SRGenderType: form.employeeForm.values.SRGenderType!,
        ServiceUnitID: form.employeeForm.values.ServiceUnitID!,
        PositionID: Number(form.employeeForm.values.PositionID!),
        SREmploymentType: form.employeeForm.values.SREmploymentType!,
        SREmployeeIncidentType:
          form.employeeForm.values.SREmployeeIncidentType!,
        DateOfAccident: form.type01Form.values.DateOfAccident!,
        SRConsequencesSuffered: form.type01Form.values.SRConsequencesSuffered!,
        SROutpatientTreatment: form.type01Form.values.SROutpatientTreatment!,
        SRBeingTreatedIn: form.type01Form.values.SRBeingTreatedIn!,
      };
    } else if (form.employeeForm.values.SREmployeeIncidentType === "02") {
      createPayload = {
        ...form.employeeForm.values,
        ...form.type02Form.values,
        ReportingDateTime: form.employeeForm.values.ReportingDateTime!,
        SRFirstAidCenter: form.employeeForm.values.SRFirstAidCenter!,
        RegistrationNo: form.employeeForm.values.RegistrationNo!,
        PersonID: Number(form.employeeForm.values.PersonID!),
        BirthDate: dayjs(form.employeeForm.values.BirthDate!).format(
          "YYYY-MM-DD",
        ),
        SRGenderType: form.employeeForm.values.SRGenderType!,
        ServiceUnitID: form.employeeForm.values.ServiceUnitID!,
        PositionID: Number(form.employeeForm.values.PositionID!),
        SREmploymentType: form.employeeForm.values.SREmploymentType!,
        SREmployeeIncidentType:
          form.employeeForm.values.SREmployeeIncidentType!,
        DateOfIncident: form.type02Form.values.DateOfIncident!,
        B3BL3Type: form.type02Form.values.B3BL3Type!,
        SRConsequencesSuffered: form.type02Form.values.SRConsequencesSuffered!,
        SROutpatientTreatment: form.type02Form.values.SROutpatientTreatment!,
        SRBeingTreatedIn: form.type02Form.values.SRBeingTreatedIn!,
      };
    } else if (form.employeeForm.values.SREmployeeIncidentType === "03") {
      createPayload = {
        ...form.employeeForm.values,
        ...form.type03Form.values,
        ReportingDateTime: form.employeeForm.values.ReportingDateTime!,
        SRFirstAidCenter: form.employeeForm.values.SRFirstAidCenter!,
        RegistrationNo: form.employeeForm.values.RegistrationNo!,
        PersonID: Number(form.employeeForm.values.PersonID!),
        BirthDate: dayjs(form.employeeForm.values.BirthDate!).format(
          "YYYY-MM-DD",
        ),
        SRGenderType: form.employeeForm.values.SRGenderType!,
        ServiceUnitID: form.employeeForm.values.ServiceUnitID!,
        PositionID: Number(form.employeeForm.values.PositionID!),
        SREmploymentType: form.employeeForm.values.SREmploymentType!,
        SREmployeeIncidentType:
          form.employeeForm.values.SREmployeeIncidentType!,
        DateOfIncident: form.type03Form.values.DateOfIncident!,
        ApdType: form.type03Form.values.ApdType!,
        IsUsedApd: form.type03Form.values.IsUsedApd === "Used" ? true : false,
      };
    } else if (form.employeeForm.values.SREmployeeIncidentType === "04") {
      createPayload = {
        ...form.employeeForm.values,
        ...form.type04Form.values,
        ReportingDateTime: form.employeeForm.values.ReportingDateTime!,
        SRFirstAidCenter: form.employeeForm.values.SRFirstAidCenter!,
        RegistrationNo: form.employeeForm.values.RegistrationNo!,
        PersonID: Number(form.employeeForm.values.PersonID!),
        BirthDate: dayjs(form.employeeForm.values.BirthDate!).format(
          "YYYY-MM-DD",
        ),
        SRGenderType: form.employeeForm.values.SRGenderType!,
        ServiceUnitID: form.employeeForm.values.ServiceUnitID!,
        PositionID: Number(form.employeeForm.values.PositionID!),
        SREmploymentType: form.employeeForm.values.SREmploymentType!,
        SREmployeeIncidentType:
          form.employeeForm.values.SREmployeeIncidentType!,
        SRPakPahkType: form.type04Form.values.SRPakPahkType!,
        SRPakPahkClassification:
          form.type04Form.values.SRPakPahkClassification!,
        SRPakPahkClassificationItem:
          form.type04Form.values.SRPakPahkClassificationItem!,
        PakPahkTypesOfExposure: form.type04Form.values.PakPahkTypesOfExposure!,
        SRConsequencesSuffered: form.type04Form.values.SRConsequencesSuffered!,
        SROutpatientTreatment: form.type04Form.values.SROutpatientTreatment!,
        SRBeingTreatedIn: form.type04Form.values.SRBeingTreatedIn!,
      };
    }
    setIsLoading(true);

    try {
      const createRes = await create.mutateAsync({ payload: createPayload });

      transactionNo = createRes.data.data.EmployeeIncidentNo;

      showNotification({
        title: <Title order={5}>Report Created Successfully</Title>,
        message: (
          <Text c="dark">Employee incident report successfully created</Text>
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
      go("/employee-incident");
    } catch (error: any) {
      setIsLoading(false);

      showNotification({
        title: <Title order={5}>Approve Failed</Title>,
        message: <Text c="dark">{error.message}</Text>,
        icon: <FontAwesomeIcon icon={faXmarkCircle} size="xl" />,
        color: "red",
      });
    }
    setIsLoading(false);
  };

  const approve = useApproveEmployeeIncident({});

  const onApprove = async (incidentNo: string) => {
    await approve.mutateAsync({ payload: { EmployeeIncidentNo: incidentNo } });
  };

  const upload = useEvidenceUpload({});

  const onUploadEvidence = async (transactionNo: string) => {
    const uploadPromises = form.fileStore.values.store.map((data) => {
      const payload = {
        ...data,
        TransactionNo: transactionNo,
        IncidentType: "ei",
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
                onClick={() => go("/employee-incident")}
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
                <Title order={3}>Employee Incident Report</Title>
                <Divider />
              </Stack>
              <Stack gap={4}>
                <TextInput
                  size="xs"
                  label={
                    <Text fz={12} fw={600}>
                      Incident No
                    </Text>
                  }
                  placeholder="WB/202511-0002"
                  disabled
                  {...form.employeeForm.getInputProps("EmployeeIncidentNo")}
                />
                <DateTimePicker
                  size="xs"
                  label={
                    <Text fz={12} fw={600}>
                      Reporting Date
                    </Text>
                  }
                  placeholder="Select date and time"
                  {...form.employeeForm.getInputProps("ReportingDateTime")}
                />
                <Radio.Group
                  size="xs"
                  label="First Aid Center"
                  {...form.employeeForm.getInputProps("SRFirstAidCenter")}
                >
                  <Group mt="xs">
                    {aid.map((data) => (
                      <Radio
                        value={data.ItemID}
                        label={data.ItemName}
                        size="xs"
                      />
                    ))}
                  </Group>
                </Radio.Group>
                <Select
                  size="xs"
                  label={
                    <Text fz={12} fw={600} span>
                      Registration No
                    </Text>
                  }
                  placeholder="REG/OP/190309-0009"
                  withAsterisk
                  data={reg.map((data) => data.RegistrationNo)}
                  searchable
                  onSearchChange={(val) => setSearchReg(val)}
                  searchValue={searchReg}
                  clearable
                  rightSection={
                    getRegistration.isLoading ? <Loader size="xs" /> : undefined
                  }
                  {...form.employeeForm.getInputProps("RegistrationNo")}
                />
              </Stack>

              <Fieldset
                legend="EMPLOYEE IDENTITY"
                display={form.employeeForm.values.IsOutsourcing ? "none" : ""}
              >
                <Stack gap={4}>
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Employee No
                      </Text>
                    }
                    placeholder="0000xxxxxx"
                    clearable
                    searchable
                    onSearchChange={(val) => setSearchEmployee(val)}
                    searchValue={searchEmployee}
                    data={employee.map((data) => ({
                      value: data.PersonID.toString(),
                      label: data.EmployeeNumber,
                    }))}
                    value={form.employeeForm.values.PersonID}
                    onChange={(val) => {
                      if (val) {
                        const find = employee.find(
                          (f) => f.PersonID.toString() === val,
                        );
                        if (find) {
                          form.employeeForm.setFieldValue(
                            "EmployeeName",
                            find.EmployeeName,
                          );

                          form.employeeForm.setFieldValue(
                            "ServiceUnitID",
                            find.ServiceUnitID,
                          );
                          setSearchUnit(find.ServiceUnitID);

                          form.employeeForm.setFieldValue(
                            `SREmploymentType`,
                            find.SREmploymentType.ItemID,
                          );

                          if (find.PositionID === -1) {
                            setIsPositionDisabled(false);
                          } else {
                            form.employeeForm.setFieldValue(
                              "PositionID",
                              find.PositionID.toString(),
                            );
                            setSearchPosition(find.PositionID.toString());
                            setIsPositionDisabled(true);
                          }
                        }
                      } else {
                        form.employeeForm.setFieldValue("PositionID", null);
                        setSearchPosition("");
                        setIsPositionDisabled(true);

                        form.employeeForm.setFieldValue("ServiceUnitID", null);
                        setSearchUnit("");
                      }
                      form.employeeForm.setFieldValue("PersonID", val);
                    }}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Employee Name
                      </Text>
                    }
                    placeholder="Employee Name"
                    {...form.employeeForm.getInputProps("EmployeeName")}
                  />
                  <Group gap={4}>
                    <TextInput
                      size="xs"
                      label={
                        <Text fz={12} fw={600} span>
                          Place of Birth
                        </Text>
                      }
                      placeholder="Place"
                      w="49%"
                      disabled
                      {...form.employeeForm.getInputProps("PlaceOfBirth")}
                    />
                    <DatePickerInput
                      size="xs"
                      label="Date of Birth"
                      placeholder={dayjs().format("DD-MM-YYYY")}
                      w="49%"
                      disabled
                      {...form.employeeForm.getInputProps("BirthDate")}
                    />
                  </Group>
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Sex
                      </Text>
                    }
                    placeholder="Male"
                    data={gender.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    clearable
                    disabled
                    {...form.employeeForm.getInputProps("SRGenderType")}
                  />
                  <Textarea
                    size="xs"
                    label="Address"
                    placeholder="Address..."
                    autosize
                    minRows={2}
                    disabled
                    {...form.employeeForm.getInputProps("Address")}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Phone No
                      </Text>
                    }
                    placeholder="Place"
                    disabled
                    {...form.employeeForm.getInputProps("PhoneNo")}
                  />
                </Stack>
              </Fieldset>

              <Fieldset legend="WORKING INFORMATION">
                <Stack gap={4}>
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Service Unit
                      </Text>
                    }
                    placeholder="Unit"
                    data={units.map((data) => ({
                      value: data.OrganizationUnitID.toString(),
                      label: data.OrganizationUnitName,
                    }))}
                    searchable
                    clearable
                    disabled
                    searchValue={searchUnit}
                    onSearchChange={(val) => setSearchUnit(val)}
                    {...form.employeeForm.getInputProps("ServiceUnitID")}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Position
                      </Text>
                    }
                    placeholder="Perawat"
                    data={positions.map((data) => ({
                      value: data.PositionID.toString(),
                      label: data.PositionName,
                    }))}
                    searchable
                    clearable
                    disabled={isPositionDisabled}
                    searchValue={searchPosition}
                    onSearchChange={(val) => setSearchPosition(val)}
                    rightSection={
                      getPosition.isLoading ? <Loader size="xs" /> : undefined
                    }
                    {...form.employeeForm.getInputProps("PositionID")}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Employment Type
                      </Text>
                    }
                    placeholder="Tetap"
                    data={empType.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    searchable
                    clearable
                    {...form.employeeForm.getInputProps("SREmploymentType")}
                  />
                </Stack>
              </Fieldset>

              <Fieldset legend="INCIDENT DETAIL">
                <Stack gap={4}>
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Incident Type
                      </Text>
                    }
                    placeholder="Incident Type"
                    clearable
                    data={incidentTypeList.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    {...form.employeeForm.getInputProps(
                      "SREmployeeIncidentType",
                    )}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Reported To
                      </Text>
                    }
                    placeholder="Komite Mutu"
                    data={[]}
                    disabled
                  />
                </Stack>

                <Stack
                  gap={4}
                  display={
                    form.employeeForm.values.SREmployeeIncidentType === "01"
                      ? ""
                      : "none"
                  }
                  mt={6}
                >
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Accident Scene
                      </Text>
                    }
                    placeholder="Accident Scene"
                    {...form.type01Form.getInputProps("AccidentScene")}
                  />
                  <DateTimePicker
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Date & Time of Accident
                      </Text>
                    }
                    placeholder="Select date and time"
                    {...form.type01Form.getInputProps("DateOfAccident")}
                  />

                  <Fieldset legend="Accident Incident Description">
                    <Stack gap={4}>
                      <Textarea
                        size="xs"
                        label="Chronology of The Accident"
                        placeholder="Chronology..."
                        autosize
                        minRows={2}
                        {...form.type01Form.getInputProps("Chronology")}
                      />
                      <Textarea
                        size="xs"
                        label="State how the machine, installation, material or environment caused the injury - death"
                        placeholder="Chronology..."
                        autosize
                        minRows={2}
                        {...form.type01Form.getInputProps(
                          "ExplanationOfHowThingsCausedInjuryOrDeath",
                        )}
                      />
                      <TextInput
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Accident Witness
                          </Text>
                        }
                        placeholder="Witness"
                        {...form.type01Form.getInputProps("AccidentWitness")}
                      />
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Consequences suffered by the victim
                          </Text>
                        }
                        placeholder="Consequences"
                        searchable
                        clearable
                        data={consequences.map((data) => ({
                          value: data.ItemID,
                          label: data.ItemName,
                        }))}
                        {...form.type01Form.getInputProps(
                          "SRConsequencesSuffered",
                        )}
                      />
                      <Textarea
                        size="xs"
                        label="Describe the part of the body that is sick / injured"
                        placeholder="Description..."
                        autosize
                        minRows={2}
                        {...form.type01Form.getInputProps(
                          "ExplanationOfInjuredBodyParts",
                        )}
                      />
                      <Textarea
                        size="xs"
                        label="Loss (of equipment used at the time of the accident)"
                        placeholder="Description..."
                        autosize
                        minRows={2}
                        {...form.type01Form.getInputProps("LossesIncurred")}
                      />
                    </Stack>
                  </Fieldset>

                  <Fieldset legend="Patient's Condition After The First Examination">
                    <Stack gap={4}>
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Outpatient Treatment
                          </Text>
                        }
                        placeholder="Treatment"
                        searchable
                        clearable
                        data={outTreatment.map((data) => ({
                          value: data.ItemID,
                          label: data.ItemName,
                        }))}
                        {...form.type01Form.getInputProps(
                          "SROutpatientTreatment",
                        )}
                      />
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Treated In
                          </Text>
                        }
                        searchable
                        clearable
                        placeholder="Treated In"
                        data={treatIn.map((data) => ({
                          value: data.ItemID,
                          label: data.ItemName,
                        }))}
                        {...form.type01Form.getInputProps("SRBeingTreatedIn")}
                      />
                    </Stack>
                  </Fieldset>
                </Stack>

                <Stack
                  gap={4}
                  display={
                    form.employeeForm.values.SREmployeeIncidentType === "02"
                      ? ""
                      : "none"
                  }
                  mt={6}
                >
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Incident Scene
                      </Text>
                    }
                    placeholder="Incident"
                    {...form.type02Form.getInputProps("AccidentScene")}
                  />
                  <DateTimePicker
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Date & Time of Incident
                      </Text>
                    }
                    placeholder="Select date and time"
                    {...form.type02Form.getInputProps("DateOfIncident")}
                  />

                  <Fieldset legend="Accident Incident Description">
                    <Stack gap={4}>
                      <Textarea
                        size="xs"
                        label="Chronology Of Incidents"
                        placeholder="Chronology..."
                        autosize
                        minRows={2}
                        {...form.type02Form.getInputProps("Chronology")}
                      />
                      <TextInput
                        size="xs"
                        label={
                          <Text fz={12} fw={600}>
                            B3 / LB3 Type
                          </Text>
                        }
                        placeholder="Type"
                        {...form.type02Form.getInputProps("B3BL3Type")}
                      />
                      <TextInput
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Incident Witness
                          </Text>
                        }
                        placeholder="Witness"
                        {...form.type02Form.getInputProps("IncidentWitness")}
                      />
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Consequences suffered by the victim
                          </Text>
                        }
                        searchable
                        clearable
                        placeholder="Consequences"
                        data={consequences.map((data) => ({
                          value: data.ItemID,
                          label: data.ItemName,
                        }))}
                        {...form.type02Form.getInputProps(
                          "SRConsequencesSuffered",
                        )}
                      />
                      <Textarea
                        size="xs"
                        label="Describe the part of the body that is sick / injured"
                        placeholder="Description..."
                        autosize
                        minRows={2}
                        {...form.type02Form.getInputProps(
                          "ExplanationOfInjuredBodyParts",
                        )}
                      />
                      <Textarea
                        size="xs"
                        label="Loss (of equipment used at the time of the accident)"
                        placeholder="Description..."
                        autosize
                        minRows={2}
                        {...form.type02Form.getInputProps("LossesIncurred")}
                      />
                    </Stack>
                  </Fieldset>

                  <Fieldset legend="Patient's Condition After The First Examination">
                    <Stack gap={4}>
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Outpatient Treatment
                          </Text>
                        }
                        searchable
                        clearable
                        placeholder="Treatment"
                        data={outTreatment.map((data) => ({
                          value: data.ItemID,
                          label: data.ItemName,
                        }))}
                        {...form.type02Form.getInputProps(
                          "SROutpatientTreatment",
                        )}
                      />
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Treated In
                          </Text>
                        }
                        searchable
                        clearable
                        placeholder="Treated In"
                        data={treatIn.map((data) => ({
                          value: data.ItemID,
                          label: data.ItemName,
                        }))}
                        {...form.type02Form.getInputProps("SRBeingTreatedIn")}
                      />
                    </Stack>
                  </Fieldset>
                </Stack>

                <Stack
                  gap={4}
                  display={
                    form.employeeForm.values.SREmployeeIncidentType === "03"
                      ? ""
                      : "none"
                  }
                  mt={6}
                >
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Incident Scene
                      </Text>
                    }
                    placeholder="Incident"
                    {...form.type03Form.getInputProps("IncidentScene")}
                  />
                  <DateTimePicker
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Date & Time of Incident
                      </Text>
                    }
                    placeholder="Select date and time"
                    {...form.type03Form.getInputProps("DateOfIncident")}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Exposed Body Parts
                      </Text>
                    }
                    placeholder="Body Parts"
                    {...form.type03Form.getInputProps(
                      "ExplanationOfInjuredBodyParts",
                    )}
                  />
                  <Textarea
                    size="xs"
                    label="Chronology Of Incidents"
                    placeholder="Chronology..."
                    autosize
                    minRows={2}
                    {...form.type03Form.getInputProps("Chronology")}
                  />
                  <Radio.Group
                    label="Personal Protective Equipment (APD)"
                    size="xs"
                    {...form.type03Form.getInputProps("IsUsedApd")}
                  >
                    <Group mt="xs">
                      <Radio size="xs" value="Used" label="Used" />
                      <Radio size="xs" value="NotUsed" label="Not Used" />
                    </Group>
                  </Radio.Group>
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Personal Protective Equipment (APD) Type
                      </Text>
                    }
                    placeholder="Type"
                    {...form.type03Form.getInputProps("ApdType")}
                  />

                  <Fieldset legend="">
                    <Stack gap={4}>
                      <Checkbox.Group
                        size="xs"
                        label="Management that has been carried out (less than 4 hours after exposure)"
                      >
                        <Stack gap={4} mt="xs">
                          <Checkbox
                            label="Hand Hygiene"
                            size="xs"
                            {...form.type03Form.getInputProps("IsHandHygiene")}
                          />
                          <Checkbox value="Gargle" label="Gargle" size="xs" />
                          <Checkbox
                            label="Eye Irrigation"
                            size="xs"
                            {...form.type03Form.getInputProps(
                              "IsEyeIrrigation",
                            )}
                          />
                          <Checkbox
                            label="Nassal Irrigation"
                            size="xs"
                            {...form.type03Form.getInputProps(
                              "IsNassalIrrigation",
                            )}
                          />
                          <Checkbox
                            label="Other"
                            size="xs"
                            {...form.type03Form.getInputProps(
                              "IsOtherManagement",
                            )}
                          />
                          <Textarea
                            size="xs"
                            label="Other Management Description"
                            placeholder="Description..."
                            autosize
                            minRows={2}
                            {...form.type03Form.getInputProps(
                              "OtherManagementDesc",
                            )}
                          />
                        </Stack>
                      </Checkbox.Group>
                    </Stack>
                  </Fieldset>
                </Stack>

                <Stack
                  gap={4}
                  display={
                    form.employeeForm.values.SREmployeeIncidentType === "04"
                      ? ""
                      : "none"
                  }
                  mt={6}
                >
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        PAK / PAHK Type
                      </Text>
                    }
                    placeholder="Type"
                    searchable
                    searchValue={searchPPType}
                    onSearchChange={setSearchPPType}
                    clearable
                    data={PPType.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    {...form.type04Form.getInputProps("SRPakPahkType")}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        PAK / PAHK Classification
                      </Text>
                    }
                    placeholder="Classification"
                    searchable
                    searchValue={searchPPClass}
                    onSearchChange={setSearchPPClass}
                    clearable
                    data={PPClass.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    {...form.type04Form.getInputProps(
                      "SRPakPahkClassification",
                    )}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        PAK / PAHK Classification Detail
                      </Text>
                    }
                    searchable
                    searchValue={searchPPItem}
                    onSearchChange={setSearchPPItem}
                    clearable
                    placeholder="Detail"
                    data={PPItem.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    {...form.type04Form.getInputProps(
                      "SRPakPahkClassificationItem",
                    )}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Types of Exposure That Cause PAK / PAHK
                      </Text>
                    }
                    placeholder="Types"
                    {...form.type04Form.getInputProps("PakPahkTypesOfExposure")}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Consequences suffered by the victim
                      </Text>
                    }
                    searchable
                    clearable
                    placeholder="Consequences"
                    data={consequences.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    {...form.type04Form.getInputProps("SRConsequencesSuffered")}
                  />
                  <Textarea
                    size="xs"
                    label="Describe the part of the body that is sick / injured"
                    placeholder="Description..."
                    autosize
                    minRows={2}
                    {...form.type04Form.getInputProps(
                      "ExplanationOfInjuredBodyParts",
                    )}
                  />

                  <Fieldset legend="Patient's Condition After The First Examination">
                    <Stack gap={4}>
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Outpatient Treatment
                          </Text>
                        }
                        searchable
                        clearable
                        placeholder="Treatment"
                        data={outTreatment.map((data) => ({
                          value: data.ItemID,
                          label: data.ItemName,
                        }))}
                        {...form.type04Form.getInputProps(
                          "SROutpatientTreatment",
                        )}
                      />
                      <Select
                        size="xs"
                        label={
                          <Text fz={12} fw={600} span>
                            Treated In
                          </Text>
                        }
                        searchable
                        clearable
                        placeholder="Treated In"
                        data={treatIn.map((data) => ({
                          value: data.ItemID,
                          label: data.ItemName,
                        }))}
                        {...form.type04Form.getInputProps("SRBeingTreatedIn")}
                      />
                    </Stack>
                  </Fieldset>
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

export default CreateEmployeeIncident;
