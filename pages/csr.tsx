
import FormIncident from "@/components/FormIncident";
import MyMap from "@/components/MyMap";
import TableIncident from "@/components/TableIncident";
import { useEffect, useState } from "react"



export default function Home() {
  const [DataSource, setDataSource] = useState()
  const [NewIncident, setNewIncident] = useState()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kecelakaan.json`).then(async (res) => {
      setDataSource(await res.json())
    })
  }, [])



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
            />
          </div>
          <div className="col-span-2">
            <MyMap
              DataSource={DataSource}
              setDataSource={setDataSource}
              setNewIncident={setNewIncident}
              NewIncident={NewIncident}
              style={{ width: "100%", height: '20rem', borderRadius: '1rem', overflow: "hidden" }}
            />
            <FormIncident
              setNewIncident={setNewIncident}
              NewIncident={NewIncident}
              setDataSource={setDataSource}
              DataSource={DataSource}
            />
          </div>
        </div>
      </div>
    </div>
  )
}