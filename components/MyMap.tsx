
import { CSSProperties, Dispatch, SetStateAction } from "react"
import { clusterCountLayer, clusterLayer, unclusteredPointLayer } from "@/utils/dataset/clusterMapBox"
import { Layer, Map, Marker, Source } from "react-map-gl"

interface typeMyMapPharams {
    style?: CSSProperties,
    DataSource: any,
    setDataSource: Dispatch<SetStateAction<any>>,
    setNewIncident: Dispatch<SetStateAction<any>>,
    NewIncident: any
}

export default function MyMap({
    style,
    DataSource,
    setDataSource,
    setNewIncident,
    NewIncident
}: typeMyMapPharams) {

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
            onContextMenu={(e) => {
                const newPoint = {
                    "type": "Feature",
                    // "properties": {
                    //     "id": Date.now(),
                    //     "chronology": ""
                    // },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            e.lngLat.lng,
                            e.lngLat.lat,
                            0.0
                        ]
                    }
                }

                setNewIncident(newPoint)

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
                    setNewIncident({
                        ...feature,
                        geometry: feature.geometry
                    })
                });

            }}
        >
            <Source
                id="earthquakes"
                type="geojson"
                data={DataSource}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
            >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
                {NewIncident && (
                    <Marker
                        latitude={NewIncident.geometry?.coordinates?.[1]}
                        longitude={NewIncident.geometry?.coordinates?.[0]}
                        anchor="bottom"
                    >
                        <img src="/vercel.svg" style={{ width: "100px" }} />
                    </Marker>
                )}
            </Source>
        </Map >
    )
}