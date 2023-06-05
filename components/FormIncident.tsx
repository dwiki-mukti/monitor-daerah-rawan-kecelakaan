
import { Dispatch, SetStateAction } from "react"


interface typeFormIncident {
    IncidentSelected: any,
    setIncidentSelected: Dispatch<SetStateAction<any>>,
    DataSource: any,
    setDataSource: Dispatch<SetStateAction<any>>
}

export default function FormIncident({
    IncidentSelected,
    setIncidentSelected,
    DataSource,
    setDataSource
}: typeFormIncident) {

    const onDeletePoint = () => {
        fetch(`/api/delete-point/${IncidentSelected?.properties?.id}`, {
            method: 'DELETE'
        }).then((res) => {
            if (res.status == 200) {
                setDataSource((prev: any) => {
                    const newFeatures = prev.features.filter((feature: any) => (feature?.properties?.id != IncidentSelected?.properties?.id))
                    return ({
                        ...prev,
                        features: newFeatures
                    })
                })
                setIncidentSelected(undefined)
            }
        })
    }

    const onCreateNewPoint = () => {
        var IncidentSelectedGonnaSend: any;
        if (!Boolean(IncidentSelected?.properties?.id)) {
            IncidentSelectedGonnaSend = {
                ...IncidentSelected,
                properties: {
                    ...(IncidentSelected.properties),
                    id: Date.now()
                }
            }
        } else {
            IncidentSelectedGonnaSend = IncidentSelected
        }

        fetch('/api/save-point', {
            method: 'POST',
            body: JSON.stringify({
                incicdent: IncidentSelectedGonnaSend
            }),
            headers: {
                ['Content-Type']: 'application/json'
            }
        }).then((res) => {
            if (res.status == 200) {
                var newFeature: any
                if (!Boolean(IncidentSelected?.properties?.id)) {
                    newFeature = [
                        ...(DataSource.features),
                        IncidentSelectedGonnaSend
                    ];
                } else {
                    // filter old data
                    const newFeatures = DataSource.features.filter((feature: any) => (feature?.properties?.id != IncidentSelectedGonnaSend?.properties?.id));

                    // add new data
                    newFeature = [
                        ...(newFeatures),
                        IncidentSelectedGonnaSend
                    ]
                }
                setDataSource((prev: any) => ({
                    ...prev,
                    features: newFeature
                }))
                setIncidentSelected(IncidentSelectedGonnaSend)
            }
        })
    }


    return (
        <div>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="mt-6 relative rounded-lg h-[2.5rem]">
                    <label
                        htmlFor="long"
                        className="capitalize text-gray-600 text-[12px] absolute mt-[-10px] ml-[7px] px-[3px] bg-white"
                    >Titik bujur kecelakaan</label>
                    <input
                        id="long"
                        name="long"
                        type="number"
                        value={IncidentSelected?.geometry?.coordinates[0] ?? ''}
                        onChange={(e) => {
                            setIncidentSelected((prev: any) => ({
                                ...prev,
                                geometry: {
                                    ...(prev?.geometry),
                                    coordinates: [
                                        e.target.value,
                                        (prev?.geometry?.coordinates?.[1] ?? 0),
                                        (prev?.geometry?.coordinates?.[2]),
                                    ]
                                }
                            }))
                        }}
                        className="w-full h-full px-3 rounded-lg focus:outline-none border focus:border-sky-500"
                    />
                </div>
                <div className="mt-6 relative rounded-lg h-[2.5rem]">
                    <label
                        htmlFor="lat"
                        className="capitalize text-gray-600 text-[12px] absolute mt-[-10px] ml-[7px] px-[3px] bg-white"
                    >Titik lintang kecelakaan</label>
                    <input
                        id="lat"
                        name="lat"
                        type="number"
                        value={IncidentSelected?.geometry?.coordinates[1] ?? ''}
                        onChange={(e) => {
                            setIncidentSelected((prev: any) => ({
                                ...prev,
                                geometry: {
                                    ...(prev?.geometry),
                                    coordinates: [
                                        (prev?.geometry?.coordinates?.[0] ?? 0),
                                        e.target.value,
                                        (prev?.geometry?.coordinates?.[2]),
                                    ]
                                }
                            }))
                        }}
                        className="w-full h-full px-3 rounded-lg focus:outline-none border focus:border-sky-500"
                    />
                </div>
            </div>
            <div className="mt-6 relative rounded-lg h-[5rem]">
                <label
                    htmlFor="long"
                    className="capitalize text-gray-600 text-[12px] absolute mt-[-10px] ml-[7px] px-[3px] bg-white"
                >Kronologi kecelakaan</label>
                <textarea
                    id="long"
                    name="long"
                    value={IncidentSelected?.properties?.chronology ?? ''}
                    onChange={(e) => {
                        setIncidentSelected((prev: any) => ({
                            ...prev,
                            properties: {
                                ...(prev?.properties),
                                chronology: e.target.value
                            }
                        }))
                    }}
                    className="w-full h-full px-3 rounded-lg focus:outline-none border focus:border-sky-500"
                ></textarea>
            </div>
            <div className="mt-6 flex justify-between gap-2">
                <div className="grow">
                    {Boolean(IncidentSelected?.properties?.id) && (
                        <div className="flex justify-between">
                            <div
                                onClick={onDeletePoint}
                                className="text-xs rounded-lg border border-red-500/60 text-red-500/60 cursor-pointer hover:border-red-500 hover:text-red-500 px-6 pt-[.4rem] pb-[.5rem]"
                            >Hapus</div>
                            <div
                                onClick={onCreateNewPoint}
                                className="text-xs rounded-lg bg-gray-100 px-6 pt-2 pb-[.7rem] cursor-pointer"
                            >Perbarui</div>
                        </div>
                    )}
                </div>

                <div
                    onClick={onCreateNewPoint}
                    className="text-xs rounded-lg bg-blue-500 text-white px-6 pt-2 pb-[.7rem] cursor-pointer"
                >Buat Baru</div>
            </div>
        </div>
    )
}