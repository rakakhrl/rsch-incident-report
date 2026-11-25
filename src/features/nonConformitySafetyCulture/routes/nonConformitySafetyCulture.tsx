import { useEffect, useState } from "react";
import { IncidentListPageCard } from "../../../components/incidentListPageCard/incidentListPageCard";
import useAppRoute from "../../../config/appRoute";
import type { ICardItem } from "../../../components/incidentListPageCard/incidentListPageCard.type";
import dayjs from "dayjs";
import { useGetNonConformityList } from "../api/getNonConformityList";
import type { INonConformityResponse } from "../types";

function NCSF() {
  const { go } = useAppRoute();

  // States
  const [list, setList] = useState<ICardItem[]>([]);
  const [start, setStart] = useState<string | null>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [end, setEnd] = useState<string | null>(dayjs().format("YYYY-MM-DD"));

  const get = useGetNonConformityList({
    ReportingDateFrom: start!,
    ReportingDateTo: end!,
  });

  useEffect(() => {
    if (start && end) get.refetch();
  }, [start, end]);

  useEffect(() => {
    if (get.data) {
      const res: INonConformityResponse[] = get.data.data.data;
      const finalData: ICardItem[] = res.map((data) => {
        return {
          date: dayjs(data.ReportingDateTime).format("DD MMM YYYY"),
          id: data.NonConformityNo,
          title: data.NonConformityNo,
          status: data.IsApproved!,
          subtitle: data.SRNcComplaintClassification.ItemName!,
        };
      });

      setList(finalData);
    }
  }, [get.data]);

  return (
    <IncidentListPageCard
      title="Non Conformity Safety Culture (NCSF)"
      data={list}
      onCreate={() => go("create")}
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
      onClickBack={() => go("/home")}
      loading={get.isLoading}
    />
  );
}

export default NCSF;
