import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Fieldset,
  Group,
  Loader,
  NumberInput,
  Paper,
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
import { forwardRef, isValidElement, useEffect, useRef, useState } from "react";
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
import { usePatientIncidentForm } from "../states/patientIncident.local.state";
import { useGetRegistrationList } from "../../registration/api/getRegistrationList";
import useDebounce from "../../../hooks/useDebounce";
import { useGetServiceUnitList } from "../../serviceUnit/api/getServiceUnitList";
import { useGetStandardReference } from "../../standardReference/api/getStandardReference";
import { useCreatePatientIncident } from "../api/createPatientIncident";
import type { IStandardReferenceResponse } from "../../standardReference/types/standardReference.type";
import type { IServiceUnitResponse } from "../../serviceUnit/types";
import { calculateAge } from "../../../utils/calculateAge";
import type { IRegistrationResponse } from "../../registration/types";
import { modals } from "@mantine/modals";
import ConfirmModal from "../../../components/confirmModal/confirmModal";
import { useApprovePatientIncident } from "../api/approvePatientIncident";
import { showNotification } from "@mantine/notifications";
import { useGetRiskGradingList } from "../../riskGrading/api/getRiskGrading";
import type { IRiskGradingResponse } from "../../riskGrading/types";
import { useGetRiskGradingMatrix } from "../../riskGrading/api/getRiskGradingMatrix";
import { Dropzone } from "@mantine/dropzone";
import { fileToBase64 } from "../../../utils/fileToBase64";
import { useEvidenceUpload } from "../../whistleblowing/api/evidenceUpload";
import { decryptData } from "../../../utils/encryptDecrypt";
import { AltchaWidget, type AltchaWidgetRef } from "../../../components/captcha";
import { verifyCaptcha } from "../../../services/captcha.service";

function CreatePatientIncident() {
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
  const [isNonPatient, setIsNonPatient] = useState(false);
  const form = usePatientIncidentForm();
  const [age, setAge] = useState<string | number>(0);
  const [reg, setReg] = useState<IRegistrationResponse[]>([]);
  const [searchReg, setSearchReg] = useState("");
  const [patientName, setPatientName] = useState("");
  const [mrn, setMrn] = useState("");
  const [patientAge, setPatientAge] = useState<{
    year: number;
    month: number;
    day: number;
  }>({ day: 0, month: 0, year: 0 });
  const [units, setUnits] = useState<IServiceUnitResponse[]>([]);
  const [locations, setLocations] = useState<IServiceUnitResponse[]>([]);
  const [searchUnit, setSearchUnit] = useState("");
  const [searchLocations, setSearchLocations] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBed, setSelectedBed] = useState("");
  const [incidentOccurredOn, setIncidentOccurredOn] = useState<
    IStandardReferenceResponse[]
  >([]);
  const [incidentOccurredOnPatientWith, setIncidentOccurredOnPatientWith] =
    useState<IStandardReferenceResponse[]>([]);
  const [incidentGroup, setIncidentGroup] = useState<
    IStandardReferenceResponse[]
  >([]);
  const [clinicalImpact, setClinicalImpact] = useState<
    IStandardReferenceResponse[]
  >([]);
  const [incidentProbabilityFreq, setIncidentProbabilityFreq] = useState<
    IStandardReferenceResponse[]
  >([]);
  const [incidentFollowUp, setIncidentFollowUp] = useState<
    IStandardReferenceResponse[]
  >([]);
  const [incidentHandleBy, setIncidentHandleBy] = useState<
    IStandardReferenceResponse[]
  >([]);
  const [risk, setRisk] = useState<IRiskGradingResponse[]>([]);
  const [boxColor, setBoxColor] = useState<string | null>(null);
  const user = localStorage.getItem("userID-value");
  const [reportedBy, setReportedBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State & Ref CAPTCHA
  const captchaRef = useRef<AltchaWidgetRef>(null);
  const [captchaPayload, setCaptchaPayload] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const userData = decryptData(user);
      setReportedBy(userData?.UserID);
    }
  }, [user]);

  const getRegistration = useGetRegistrationList({ TextToSearch: searchReg });

  const fetchRegistration = useDebounce(getRegistration.refetch);

  const getIncidentOccurredOn = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "IncidentOccurredOn",
  });

  const getIncidentOccurredOnPatientWith = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "IncidentOccurredOnPatientWith",
  });

  const getIncidentGroup = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "IncidentGroup",
  });

  const getClinicalImpact = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "ClinicalImpact",
  });

  const getIncidentProbabilityFreq = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "IncidentProbabilityFrequency",
  });

  const getIncidentFollowUp = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "IncidentFollowUp",
  });

  const getIncidentHandledBy = useGetStandardReference({
    NcComplaintClassification: "",
    StandardReferenceID: "IncidentHandledBy",
  });

  const getRisk = useGetRiskGradingList({});

  const getMatrix = useGetRiskGradingMatrix({
    SRClinicalImpact: form.createForm.values.SRClinicalImpact!,
    SRIncidentProbabilityFrequency:
      form.createForm.values.SRIncidentProbabilityFrequency!,
  });

  const create = useCreatePatientIncident({});

  useEffect(() => {
    if (
      form.createForm.values.SRClinicalImpact &&
      form.createForm.values.SRIncidentProbabilityFrequency
    ) {
      getMatrix.refetch();
    } else {
      setBoxColor(null);
    }
  }, [
    form.createForm.values.SRClinicalImpact,
    form.createForm.values.SRIncidentProbabilityFrequency,
  ]);

  useEffect(() => {
    if (getMatrix.data) {
      const res: IRiskGradingResponse = getMatrix.data.data.data;

      setBoxColor(res.RiskGradingID);

      if (res.RiskGradingColor === "Blue" || res.RiskGradingColor === "Green") {
        form.createForm.setFieldValue(`SRIncidentFollowUp`, "002");
      } else if (
        res.RiskGradingColor === "Yellow" ||
        res.RiskGradingColor === "Red"
      ) {
        form.createForm.setFieldValue(`SRIncidentFollowUp`, "003");
      }
    }
  }, [getMatrix.data]);

  useEffect(() => {
    getIncidentOccurredOn.refetch();
    getIncidentOccurredOnPatientWith.refetch();
    getIncidentGroup.refetch();
    getClinicalImpact.refetch();
    getIncidentProbabilityFreq.refetch();
    getIncidentFollowUp.refetch();
    getIncidentHandledBy.refetch();
    getRisk.refetch();
  }, []);

  useEffect(() => {
    if (getRisk.data) {
      const res = getRisk.data.data.data;

      setRisk(res);
    }
  }, [getRisk.data]);

  useEffect(() => {
    if (getIncidentOccurredOn.data) {
      const res = getIncidentOccurredOn.data.data.data;

      setIncidentOccurredOn(res);
    }
  }, [getIncidentOccurredOn.data]);

  useEffect(() => {
    if (getIncidentOccurredOnPatientWith.data) {
      const res = getIncidentOccurredOnPatientWith.data.data.data;

      setIncidentOccurredOnPatientWith(res);
    }
  }, [getIncidentOccurredOnPatientWith.data]);

  useEffect(() => {
    if (getIncidentGroup.data) {
      const res = getIncidentGroup.data.data.data;

      setIncidentGroup(res);
    }
  }, [getIncidentGroup.data]);

  useEffect(() => {
    if (getClinicalImpact.data) {
      const res = getClinicalImpact.data.data.data;

      setClinicalImpact(res);
    }
  }, [getClinicalImpact.data]);

  useEffect(() => {
    if (getIncidentProbabilityFreq.data) {
      const res = getIncidentProbabilityFreq.data.data.data;

      setIncidentProbabilityFreq(res);
    }
  }, [getIncidentProbabilityFreq.data]);

  useEffect(() => {
    if (getIncidentFollowUp.data) {
      const res = getIncidentFollowUp.data.data.data;

      setIncidentFollowUp(res);
    }
  }, [getIncidentFollowUp.data]);

  useEffect(() => {
    if (getIncidentHandledBy.data) {
      const res = getIncidentHandledBy.data.data.data;

      setIncidentHandleBy(res);
    }
  }, [getIncidentHandledBy.data]);

  useEffect(() => {
    fetchRegistration();
  }, [searchReg]);

  useEffect(() => {
    if (getRegistration.data) {
      const res = getRegistration.data.data.data;
      setReg(res);
    }
  }, [getRegistration.data]);

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

  const getLocation = useGetServiceUnitList({ TextToSearch: searchLocations });

  const fetchLocation = useDebounce(getLocation.refetch);

  useEffect(() => {
    fetchLocation();
  }, [searchLocations]);

  useEffect(() => {
    if (getLocation.data) {
      const res = getLocation.data.data.data;
      setLocations(res);
    }
  }, [getLocation.data]);

  const onCreate = async () => {
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

    try {
      const createRes = await create.mutateAsync({
        payload: {
          ...form.createForm.values,
          RegistrationNo: form.createForm.values.RegistrationNo!,
          ReportedByServiceUnitID: Number(
            form.createForm.values.ReportedByServiceUnitID!,
          ),
          IncidentLocationID: form.createForm.values.IncidentLocationID!,
          IncidentDateTime: dayjs(
            form.createForm.values.IncidentDateTime!,
          ).format("YYYY-MM-DD HH:mm"),
          ReportingDateTime: dayjs(
            form.createForm.values.ReportingDateTime!,
          ).format("YYYY-MM-DD HH:mm"),
          SRIncidentOccurredOn: form.createForm.values.SRIncidentOccurredOn!,
          SRIncidentGroup: form.createForm.values.SRIncidentGroup!,
          SRClinicalImpact: form.createForm.values.SRClinicalImpact!,
          SRIncidentProbabilityFrequency:
            form.createForm.values.SRIncidentProbabilityFrequency!,
          SRIncidentFollowUp: form.createForm.values.SRIncidentFollowUp!,
          SRIncidentHandledBy: form.createForm.values.SRIncidentHandledBy!,
          Sex: form.createForm.values.Sex!,
          SRIncidentOccurredInPatientsWith:
            form.createForm.values.SRIncidentOccurredInPatientsWith!,
          DateOfBirth: form.createForm.values.DateOfBirth!,
        },
      });

      transactionNo = createRes.data.data.PatientIncidentNo;

      showNotification({
        title: <Title order={5}>Report Created Successfully</Title>,
        message: (
          <Text c="dark">Patient incident report successfully created</Text>
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
      go("/patient-incident");
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

  useEffect(() => {
    if (form.createForm.values.DateOfBirth) {
      const age = calculateAge(form.createForm.values.DateOfBirth);
      setAge(age.years);
      setPatientAge({
        year: age.years,
        month: age.months,
        day: age.days,
      });
    }
  }, [form.createForm.values.DateOfBirth]);

  type ColorItem = {
    value: string;
    label: string;
    color: string;
  };

  const dataBoxOptions = risk.map((data) => ({
    value: data.RiskGradingID,
    label: data.RiskGradingName,
    color: data.RiskGradingColor.toLowerCase(),
  }));

  const selectedBoxOption = dataBoxOptions.find((d) => d.value === boxColor);

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

  const approve = useApprovePatientIncident({});

  const onApprove = async (incidentNo: string) => {
    await approve.mutateAsync({ payload: { PatientIncidentNo: incidentNo } });
  };

  const upload = useEvidenceUpload({});

  const onUploadEvidence = async (transactionNo: string) => {
    const uploadPromises = form.fileStore.values.store.map((data) => {
      const payload = {
        ...data,
        TransactionNo: transactionNo,
        IncidentType: "pi",
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
                onClick={() => go("/patient-incident")}
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
                <Title order={3}>Patient Incident Report</Title>
                <Divider />
              </Stack>
              <Stack gap={6}>
                <Stack gap={2}>
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Incident No
                      </Text>
                    }
                    placeholder="WB/202511-0002"
                    disabled
                    {...form.createForm.getInputProps("PatientIncidentNo")}
                  />
                  <Checkbox
                    size="xs"
                    label="From Health Record"
                    checked={false}
                    disabled
                  />
                </Stack>
                <Checkbox
                  size="xs"
                  label="Non Patient"
                  checked={isNonPatient}
                  onChange={(event) =>
                    setIsNonPatient(event.currentTarget.checked)
                  }
                />
              </Stack>

              <Fieldset legend="IDENTITY" display={isNonPatient ? "" : "none"}>
                <Stack gap={4}>
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        First Name
                      </Text>
                    }
                    placeholder="First Name"
                    {...form.createForm.getInputProps("FirstName")}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Middle Name
                      </Text>
                    }
                    placeholder="Middle Name"
                    {...form.createForm.getInputProps("MiddleName")}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Last Name
                      </Text>
                    }
                    placeholder="Last Name"
                    {...form.createForm.getInputProps("LastName")}
                  />
                  <DatePickerInput
                    size="xs"
                    label="Date of Birth"
                    placeholder={dayjs().format("DD-MM-YYYY")}
                    {...form.createForm.getInputProps("DateOfBirth")}
                  />
                  <Group gap={4}>
                    <NumberInput
                      hideControls
                      w="49%"
                      size="xs"
                      label={
                        <Text fz={12} fw={600} span>
                          Age
                        </Text>
                      }
                      placeholder="25"
                      value={age}
                      onChange={setAge}
                      disabled
                    />
                    <Select
                      w="49%"
                      size="xs"
                      label={
                        <Text fz={12} fw={600} span>
                          Sex
                        </Text>
                      }
                      placeholder="Male"
                      clearable
                      data={[
                        { value: "M", label: "Laki-laki" },
                        { value: "F", label: "Perempuan" },
                      ]}
                      {...form.createForm.getInputProps("Sex")}
                    />
                  </Group>
                </Stack>
              </Fieldset>

              <Fieldset
                legend="PATIENT IDENTITY"
                display={isNonPatient ? "none" : ""}
              >
                <Stack gap={4}>
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Registration No
                      </Text>
                    }
                    placeholder="REG/OP/211005-0001"
                    data={reg.map((data) => data.RegistrationNo)}
                    searchable
                    onSearchChange={(val) => setSearchReg(val)}
                    searchValue={searchReg}
                    clearable
                    rightSection={
                      getRegistration.isLoading ? (
                        <Loader size="xs" />
                      ) : undefined
                    }
                    nothingFoundMessage="Nothing Found..."
                    value={form.createForm.values.RegistrationNo}
                    onChange={(val) => {
                      if (val) {
                        const find = reg.find((f) => f.RegistrationNo === val);
                        if (find) {
                          setPatientName(find.PatientName);
                          setMrn(find.MedicalNo);
                          setSelectedUnit(find.ServiceUnitName);
                          setSelectedBed(find.BedID);
                          setSelectedRoom(find.RoomName);
                        }
                      }
                      form.createForm.setFieldValue(`RegistrationNo`, val);
                    }}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Patient Name
                      </Text>
                    }
                    placeholder="Patient Name"
                    value={patientName}
                    disabled
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Medical Record No
                      </Text>
                    }
                    placeholder="00-00-00-00"
                    value={mrn}
                    disabled
                  />
                  <Group gap={4}>
                    <NumberInput
                      size="xs"
                      label={
                        <Text fz={12} fw={600} span>
                          Age (year)
                        </Text>
                      }
                      suffix=" year"
                      placeholder="25"
                      hideControls
                      w="32.3%"
                      value={patientAge.year}
                      onChange={(val) => {
                        setPatientAge({ ...patientAge, year: Number(val) });
                      }}
                      disabled
                    />
                    <NumberInput
                      size="xs"
                      label={
                        <Text fz={12} fw={600} span>
                          Age (month)
                        </Text>
                      }
                      suffix=" month"
                      placeholder="5"
                      hideControls
                      w="32.3%"
                      value={patientAge.month}
                      onChange={(val) => {
                        setPatientAge({ ...patientAge, month: Number(val) });
                      }}
                      disabled
                    />
                    <NumberInput
                      size="xs"
                      label={
                        <Text fz={12} fw={600} span>
                          Age (day)
                        </Text>
                      }
                      suffix=" day"
                      placeholder="2"
                      hideControls
                      w="32.3%"
                      value={patientAge.day}
                      onChange={(val) => {
                        setPatientAge({ ...patientAge, day: Number(val) });
                      }}
                      disabled
                    />
                  </Group>
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Service Unit
                      </Text>
                    }
                    placeholder="Unit"
                    value={selectedUnit}
                    disabled
                  />
                  <Group gap={4}>
                    <TextInput
                      size="xs"
                      label={
                        <Text fz={12} fw={600} span>
                          Room
                        </Text>
                      }
                      placeholder="Room"
                      w="49%"
                      value={selectedRoom}
                      disabled
                    />
                    <TextInput
                      size="xs"
                      label={
                        <Text fz={12} fw={600} span>
                          Bed
                        </Text>
                      }
                      placeholder="Bed"
                      w="49%"
                      value={selectedBed}
                      disabled
                    />
                  </Group>
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Physcian
                      </Text>
                    }
                    placeholder="Physcian"
                    data={[]}
                    disabled
                  />
                </Stack>
              </Fieldset>

              <Fieldset legend="REPORTED TO">
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
              </Fieldset>

              <Fieldset legend="INCIDENT INFORMATION">
                <Stack gap={4}>
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Reported By
                      </Text>
                    }
                    placeholder="Reported By"
                    value={reportedBy}
                    disabled
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Reported By Unit
                      </Text>
                    }
                    placeholder="Unit"
                    data={units.map((data) => ({
                      value: data.OrganizationUnitID.toString(),
                      label: data.OrganizationUnitName,
                    }))}
                    clearable
                    rightSection={
                      getUnit.isLoading ? <Loader size="xs" /> : undefined
                    }
                    searchable
                    searchValue={searchUnit}
                    onSearchChange={(val) => setSearchUnit(val)}
                    {...form.createForm.getInputProps(
                      "ReportedByServiceUnitID",
                    )}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Incident Location
                      </Text>
                    }
                    placeholder="Location"
                    data={locations.map((data) => ({
                      value: data.OrganizationUnitID.toString(),
                      label: data.OrganizationUnitName,
                    }))}
                    clearable
                    rightSection={
                      getLocation.isLoading ? <Loader size="xs" /> : undefined
                    }
                    searchable
                    searchValue={searchLocations}
                    onSearchChange={(val) => setSearchLocations(val)}
                    {...form.createForm.getInputProps("IncidentLocationID")}
                  />
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Other Incident Location
                      </Text>
                    }
                    placeholder="Location"
                    {...form.createForm.getInputProps("IncidentLocationOther")}
                  />
                  <DateTimePicker
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Incident Date Time
                      </Text>
                    }
                    placeholder="Select date and time"
                    {...form.createForm.getInputProps("IncidentDateTime")}
                  />
                  <DateTimePicker
                    size="xs"
                    label={
                      <Text fz={12} fw={600}>
                        Reporting Date Time
                      </Text>
                    }
                    placeholder="Select date and time"
                    {...form.createForm.getInputProps("ReportingDateTime")}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Occured On
                      </Text>
                    }
                    placeholder="Occured On"
                    data={incidentOccurredOn.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    searchable
                    clearable
                    {...form.createForm.getInputProps("SRIncidentOccurredOn")}
                  />
                  <Textarea
                    size="xs"
                    label="Occured On Description"
                    placeholder="Description..."
                    autosize
                    minRows={2}
                    {...form.createForm.getInputProps("IncidentOccurredOnName")}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Occured In Patient With
                      </Text>
                    }
                    placeholder="Occured In Patient With"
                    data={incidentOccurredOnPatientWith.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    searchable
                    clearable
                    {...form.createForm.getInputProps(
                      "SRIncidentOccurredInPatientsWith",
                    )}
                  />
                  <Textarea
                    size="xs"
                    label="Occured In Patient With Description"
                    placeholder="Description..."
                    autosize
                    minRows={2}
                    {...form.createForm.getInputProps(
                      "IncidentOccurredInPatientsWithName",
                    )}
                  />
                </Stack>
              </Fieldset>

              <Fieldset legend="INCIDENT DETAIL INFORMATION">
                <Stack gap={4}>
                  <TextInput
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Incident
                      </Text>
                    }
                    placeholder="Incident"
                    {...form.createForm.getInputProps("IncidentName")}
                  />
                  <Textarea
                    size="xs"
                    label="Chronology"
                    placeholder="Chronology..."
                    autosize
                    minRows={2}
                    {...form.createForm.getInputProps("Chronology")}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Incident Group
                      </Text>
                    }
                    placeholder="Incident Group"
                    data={incidentGroup.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    searchable
                    clearable
                    {...form.createForm.getInputProps("SRIncidentGroup")}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Clinical Impact
                      </Text>
                    }
                    placeholder="Clinical Impact"
                    data={clinicalImpact.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    searchable
                    clearable
                    {...form.createForm.getInputProps("SRClinicalImpact")}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Probability Frequency
                      </Text>
                    }
                    placeholder="Probability Frequency"
                    data={incidentProbabilityFreq.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    searchable
                    clearable
                    {...form.createForm.getInputProps(
                      "SRIncidentProbabilityFrequency",
                    )}
                  />
                  <Group gap={4}>
                    <Select
                      size="xs"
                      w="70%"
                      label={
                        <Text fz={12} fw={600} span>
                          Follow Up
                        </Text>
                      }
                      placeholder="Follow Up"
                      data={incidentFollowUp.map((data) => ({
                        value: data.ItemID,
                        label: data.ItemName,
                      }))}
                      searchable
                      clearable
                      {...form.createForm.getInputProps("SRIncidentFollowUp")}
                    />
                    <Select
                      mt={24}
                      size="xs"
                      w="28%"
                      data={dataBoxOptions}
                      value={boxColor}
                      onChange={setBoxColor}
                      styles={{
                        input: {
                          color: "transparent",
                        },
                      }}
                      disabled
                      clearable
                      leftSection={
                        selectedBoxOption && (
                          <Box
                            w={20}
                            h={20}
                            style={{
                              backgroundColor:
                                theme.colors[selectedBoxOption.color][6],
                              borderRadius: 4,
                              border: "1px solid #ccc",
                            }}
                          />
                        )
                      }
                      renderOption={({ option }) => {
                        const item = option as ColorItem;

                        return (
                          <Box
                            w={20}
                            h={20}
                            style={{
                              backgroundColor: item.color,
                              borderRadius: 4,
                              border: "1px solid #ccc",
                            }}
                          />
                        );
                      }}
                    />
                  </Group>
                  <Textarea
                    size="xs"
                    label="Handling"
                    placeholder="Handling..."
                    autosize
                    minRows={2}
                    {...form.createForm.getInputProps("Handling")}
                  />
                  <Select
                    size="xs"
                    label={
                      <Text fz={12} fw={600} span>
                        Handled By
                      </Text>
                    }
                    placeholder="Handled By"
                    data={incidentHandleBy.map((data) => ({
                      value: data.ItemID,
                      label: data.ItemName,
                    }))}
                    searchable
                    clearable
                    {...form.createForm.getInputProps("SRIncidentHandledBy")}
                  />
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
          onCreate();
          scrollToBottom();
        }}
        title="Are you sure you want to submit this report?"
        subTitle="Make sure the data you entered is correct before proceeding to submit."
      />
    </>
  );
}

export default CreatePatientIncident;
