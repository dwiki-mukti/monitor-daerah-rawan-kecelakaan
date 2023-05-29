export default function TableIncident({
    DataSource
}: { DataSource: any }) {
    return (
        <div className="max-h-[34rem] overflow-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="px-3 pb-3">No.</th>
                        <th className="px-3 pb-3">Kronologi</th>
                        <th className="px-3 pb-3">Koordinat</th>
                        {/* <th className="px-3 pb-3">Hapus</th> */}
                    </tr>
                </thead>
                {Boolean(DataSource?.features) && (
                    <tbody>
                        {
                            (DataSource.features).map((feature: any, index: number) => (
                                <tr key={index} className="border-t cursor-pointer hover:bg-gray-100">
                                    <td className="p-3 text-center">{index + 1}</td>
                                    <td className="p-3 ">{feature?.properties?.chronology}</td>
                                    <td className="p-3 text-center">{feature?.geometry?.coordinates[0]}, {feature?.geometry?.coordinates[1]}</td>
                                    {/* <td className="p-3 flex">
                                        <div className="flex m-auto rounded-full w-[1.75rem] aspect-square text-red-500 hover:bg-red-500 hover:text-white">
                                            <a className="m-auto font-bold text-xs">X</a>
                                        </div>
                                    </td> */}
                                </tr>
                            ))
                        }
                    </tbody>
                )}
            </table>
        </div>
    )
}