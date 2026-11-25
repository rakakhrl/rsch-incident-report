import { useEffect, useState } from "react";
import { IncidentListPageCard } from "../../../components/incidentListPageCard/incidentListPageCard";
import useAppRoute from "../../../config/appRoute";
import type { ICardItem } from "../../../components/incidentListPageCard/incidentListPageCard.type";
import dayjs from "dayjs";
import { usegetEmployeeIncidentList } from "../api/getEmployeeIncident";
import type { IEmployeeIncidentResponse } from "../types";

function EmployeeIncident() {
  const { go } = useAppRoute();

  // States
  const [list, setList] = useState<ICardItem[]>([]);
  const [start, setStart] = useState<string | null>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [end, setEnd] = useState<string | null>(dayjs().format("YYYY-MM-DD"));

  const get = usegetEmployeeIncidentList({
    ReportingDateFrom: start!,
    ReportingDateTo: end!,
  });

  useEffect(() => {
    if (start && end) get.refetch();
  }, [start, end]);

  useEffect(() => {
    if (get.data) {
      const res: IEmployeeIncidentResponse[] = get.data.data.data;
      const finalData: ICardItem[] = res.map((data) => {
        return {
          date: dayjs(
            data.EmployeeIncidentRptWorkAccident?.DateOfAccident,
          ).format("DD MMM YYYY"),
          id: data.EmployeeIncidentNo,
          title: data.EmployeeIncidentNo,
          status: data.IsApproved!,
          subtitle: data.EmployeeIncidentRptWorkAccident?.AccidentScene,
        };
      });

      setList(finalData);
    }
  }, [get.data]);

  return (
    <IncidentListPageCard
      title="Employee Incident"
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

export default EmployeeIncident;
