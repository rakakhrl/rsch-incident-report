import dayjs from "dayjs";
import { IncidentListPageCard } from "../../../components/incidentListPageCard/incidentListPageCard";
import useAppRoute from "../../../config/appRoute";
import { useGetPatientIncidentList } from "../api/getPatientIncidentList";
import { useEffect, useState } from "react";
import type { IPatientIncidentResponse } from "../types";
import type { ICardItem } from "../../../components/incidentListPageCard/incidentListPageCard.type";

function PatientIncident() {
  const { go } = useAppRoute();

  // States
  const [list, setList] = useState<ICardItem[]>([]);
  const [start, setStart] = useState<string | null>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [end, setEnd] = useState<string | null>(dayjs().format("YYYY-MM-DD"));

  const get = useGetPatientIncidentList({
    DateOfIncidentFrom: start!,
    DateOfIncidentTo: end!,
  });

  useEffect(() => {
    if (start && end) get.refetch();
  }, [start, end]);

  useEffect(() => {
    if (get.data) {
      const res: IPatientIncidentResponse[] = get.data.data.data;
      const finalData: ICardItem[] = res.map((data) => {
        return {
          date: dayjs(data.IncidentDateTime).format("DD MMM YYYY"),
          id: data.PatientIncidentNo,
          title: data.PatientIncidentNo,
          status: data.IsApproved,
          subtitle: data.IncidentName,
        };
      });

      setList(finalData);
    }
  }, [get.data]);

  return (
    <IncidentListPageCard
      title="Patient Incident"
      data={list}
      onCreate={() => go("create")}
      onClickBack={() => go("/home")}
      onFilter={(from, to) => {
        if (from) {
          setStart(from);
        } else {
          setStart(dayjs().format("YYYY-MM-DD"));
        }

        if (to) {
          setEnd(to);
        } else {
          setEnd(dayjs().format("YYYY-MM-DD"));
        }
      }}
      loading={get.isLoading}
    />
  );
}

export default PatientIncident;
