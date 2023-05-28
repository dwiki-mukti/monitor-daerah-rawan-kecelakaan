import { clusterCountLayer, clusterLayer, unclusteredPointLayer } from "@/utils/dataset/clusterMapBox"
import { Layer, Map, Source } from "react-map-gl"
import { CSSProperties } from "react"


export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <MyMap
        style={{ width: "100%", height: '20rem', borderRadius: '1rem' }}
      />
    </div>
  )
}



function MyMap({ style }: { style?: CSSProperties }) {

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
          const coordinates = feature.geometry.coordinates.slice();

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `${feature.properties.title}`
            )
            .addTo(map);
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
      </Source>
    </Map>
  )
}