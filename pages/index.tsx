import { clusterCountLayer, clusterLayer, unclusteredPointLayer } from "@/utils/dataset/clusterMapBox"
import { Layer, Map, Popup, Source } from "react-map-gl"
import { CSSProperties, useState } from "react"


export default function Home() {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="p-4 text-center capitalize border-b">
        <div className="text-xl font-semibold">crash monit</div>
        <div className="">monitor daerah rawan kecelakaan</div>
      </div>
      <div className="grid grid-cols-5 gap-8 p-8">
        <div className="col-span-3">
          <TableIncident />
        </div>
        <div className="col-span-2">
          <MyMap
            style={{ width: "100%", height: '20rem', borderRadius: '1rem', overflow: "hidden" }}
          />
          <FormIncident />
        </div>
      </div>
    </div>
  )
}

interface typePopupIncident {
  id: string | number,
  latitude: number,
  longitude: number,
  chronology: string
}

function MyMap({ style }: { style?: CSSProperties }) {
  const [PopupIncident, setPopupIncident] = useState<typePopupIncident | null>(null)

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_GMAPS_API_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={style}
      initialViewState={{
        latitude: -7.870549878082652,
        longitude: 111.46316607078202,
        zoom: 13
      }}
      onLoad={(ev) => {
        // init var
        const map = ev.target

        // style mouse hover cluster point
        map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer';
        }).on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = '';
        }).on('mouseenter', 'unclustered-point', () => {
          map.getCanvas().style.cursor = 'pointer';
        }).on('mouseleave', 'unclustered-point', () => {
          map.getCanvas().style.cursor = '';
        });

        // event click cluster point
        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          const feature: any = features[0];
          const clusterId = feature.properties.cluster_id;
          const mapSource: any = map.getSource('earthquakes')
          mapSource.getClusterExpansionZoom(
            clusterId,
            (err: Error, zoom: number) => {
              if (err) return;
              map.easeTo({
                center: feature.geometry.coordinates,
                zoom: zoom
              });
            }
          );
        });

        // event click uncluster/micro point
        map.on('click', 'unclustered-point', (e) => {
          const feature: any = e.features?.[0];
          const coordinates = feature.geometry.coordinates;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          setPopupIncident({
            id: feature.properties.id,
            longitude: coordinates[0],
            latitude: coordinates[1],
            chronology: feature.properties.chronology
          })
        });

      }}
    >
      <Source
        id="earthquakes"
        type="geojson"
        data={"/kecelakaan.json"}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
        {PopupIncident && (
          <Popup
            longitude={PopupIncident.longitude}
            latitude={PopupIncident.latitude}
            onClose={() => setPopupIncident(null)}
          >
            {PopupIncident.chronology}
          </Popup>
        )}
      </Source>
    </Map >
  )
}




function FormIncident() {
  return (
    <form>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="mt-6 relative rounded-lg h-[2.5rem]">
          <label
            htmlFor="lat"
            className="capitalize text-gray-600 text-[12px] absolute mt-[-10px] ml-[7px] px-[3px] bg-white"
          >Titik lintang kecelakaan</label>
          <input
            id="lat"
            name="lat"
            type="number"
            className="w-full h-full px-3 rounded-lg focus:outline-none border focus:border-sky-500"
          />
        </div>
        <div className="mt-6 relative rounded-lg h-[2.5rem]">
          <label
            htmlFor="long"
            className="capitalize text-gray-600 text-[12px] absolute mt-[-10px] ml-[7px] px-[3px] bg-white"
          >Titik bujur kecelakaan</label>
          <input
            id="long"
            name="long"
            type="number"
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
          className="w-full h-full px-3 rounded-lg focus:outline-none border focus:border-sky-500"
        ></textarea>
      </div>
      <div className="mt-6 flex">
        <button className="text-xs rounded-lg bg-blue-500 text-white ml-auto px-6 pt-2 pb-[.7rem]">Simpan</button>
      </div>
    </form>
  )
}


function TableIncident() {
  return (
    <div className="max-h-[34rem] overflow-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-3 pb-3">No.</th>
            <th className="px-3 pb-3">Kronologi</th>
            <th className="px-3 pb-3">Koordinat</th>
            <th className="px-3 pb-3">Hapus</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const ret = [];
            for (let i = 0; i < 10; i++) {
              ret.push(
                <tr key={i} className="border-t cursor-pointer hover:bg-gray-100">
                  <td className="p-3 text-center">{i + 1}</td>
                  <td className="p-3 ">Kecelakaan tunggal, klutuk terjungkir</td>
                  <td className="p-3 text-center">11.2029, 21.0199</td>
                  <td className="p-3 flex">
                    <div className="flex m-auto rounded-full w-[1.75rem] aspect-square text-red-500 hover:bg-red-500 hover:text-white">
                      <a className="m-auto font-bold text-xs">X</a>
                    </div>
                  </td>
                </tr>
              )
            }
            return ret
          })()}
        </tbody>
      </table>
    </div>
  )
}