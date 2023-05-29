
import FormIncident from "@/components/FormIncident";
import MyMap from "@/components/MyMap";
import TableIncident from "@/components/TableIncident";
import { useState } from "react"


export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kecelakaan.json`);
  const dataSource = await res.json();
  return { props: { dataSource } };
}


export default function Home({ dataSource }: any) {
  const [DataSource, setDataSource] = useState(dataSource)
  const [IncidentSelected, setIncidentSelected] = useState()


  return (
    <div className="overflow-auto p-4 min-h-screen">
      <div className="mx-auto min-w-[80rem] max-w-[150rem]">
        <div className="p-4 text-center capitalize border-b">
          <div className="text-xl font-semibold">crash monit</div>
          <div className="">monitor daerah rawan kecelakaan</div>
        </div>
        <div className="grid grid-cols-5 gap-8 p-8">
          <div className="col-span-3">
            <TableIncident
              DataSource={DataSource}
              IncidentSelected={IncidentSelected}
              setIncidentSelected={setIncidentSelected}
            />
          </div>
          <div className="col-span-2">
            <MyMap
              DataSource={DataSource}
              setDataSource={setDataSource}
              setIncidentSelected={setIncidentSelected}
              IncidentSelected={IncidentSelected}
              style={{ width: "100%", height: '20rem', borderRadius: '1rem', overflow: "hidden" }}
            />
            <FormIncident
              setIncidentSelected={setIncidentSelected}
              IncidentSelected={IncidentSelected}
              setDataSource={setDataSource}
              DataSource={DataSource}
            />
          </div>
        </div>
      </div>
    </div>
  )
}