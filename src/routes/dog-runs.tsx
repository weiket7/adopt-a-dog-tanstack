import { createFileRoute } from "@tanstack/react-router";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapCameraChangedEvent,
  Pin,
} from "@vis.gl/react-google-maps";

export const Route = createFileRoute("/dog-runs")({
  component: RouteComponent,
});

const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

const dogRuns = [
  {
    name: "​Bishan-Ang Mo Kio Park Dog Run",
    address: "453 Ang Mo Kio Ave 1, Singapore 569972",
    openingHours: "24/7",
  },
  {
    name: "​Toa Payoh Dog Run Park",
    address: "Toa Payoh Lorong 1 near Blk 128, Singapore 310128",
    openingHours: "7am - 9pm",
  },
  {
    name: "​Potong Pasir Dog Run",
    address: "Potong Pasir Ave 3, S357682",
    openingHours: "",
  },
  {
    name: "​Tiong Bahru Dog Run Park",
    address: "1 Henderson Rd, Singapore 15956",
    openingHours: "",
  },
  {
    name: "​East Coast Dog Run Park",
    address: "Parkland Green, East Coast Park Service Rd, Singapore 449875",
    openingHours: "",
  },
  {
    name: "Bedok Town Park Dog Run",
    address: "Bedok Town Park, along Bedok North Road.​",
    openingHours: "24/7",
  },
  {
    name: "​Pasir Ris Park Dog Run",
    address: "125 Pasir Ris Rd (Near Carpark E)",
    openingHours: "24/7",
  },
  {
    name: "​Telok Kurau Dog Run",
    address:
      "Telok Kurau Park, located at the junction of Telok Kurau Lorong N and Lorong M.",
    openingHours: "24/7",
  },
  {
    name: "Tampines Boulevard Park Dog Run",
    address: "Along Tampines Ave 12",
    openingHours: "24/7",
  },
  {
    name: "Katong Park Dog Run Park",
    address: "Junction of Meyer Road and Fort Road.",
    openingHours: "24/7 (Lights until 10 PM)",
  },
  {
    name: "Lengkong Enam Interim Park Dog Run",
    address: "Along Jalan Selamat and Lengkong Tujuh.",
    openingHours: "24/7",
  },
  {
    name: "​TMariam Way Dog Run Park",
    address: "Mariam Way Playground",
    openingHours: "24/7",
  },
  {
    name: "Opera Estate Dog Run",
    address:
      "Located at Opera Estate Football Field, along Swan Lake Avenue (near the junction of Fidelio Street), Singapore 455707",
    openingHours: "24/7",
  },
  {
    name: "Koon Seng Park Dog Run",
    address: "36 Koon Seng Rd, Singapore 426978",
    openingHours: "24/7",
  },
  {
    name: "Guillemard Road Open Space Dog Run",
    address:
      "Located at the junction of Guillemard Road and Lorong 22 Geylang (opposite the former Guillemard Camp area).",
    openingHours: "24/7",
  },
  {
    name: "​Sembawang Dog Run Park",
    address: "Northern end of Sembawang Road",
    openingHours: "24/7 (No dedicated lighting)",
  },
  {
    name: "Yishun Park Dog Run",
    address: "Yishun Central (Opposite Adora Green)",
    openingHours: "24/7",
  },
  {
    name: "Punggol Waterway Park Dog Run",
    address: "Sentul Crescent.",
    openingHours: "24/7",
  },
  {
    name: "Rivervale Dog Run (Sengkang)",
    address: "Near Block 178 Rivervale Crescent",
    openingHours: "7:00 AM – 10:00 PM",
  },
  {
    name: "Woodlands Waterfront Dog Run",
    address: "Admiralty Road West",
    openingHours: "24/7",
  },
  {
    name: "K9 Park @ NEX (Mall Dog Run)",
    address: "23 Serangoon Central, NEX Level 4R",
    openingHours: "10:30 AM – 10:30 PM",
  },
  {
    name: "Sun Plaza Park Dog Run",
    address: "Tampines Avenue 7 and Tampines Avenue 9, Singapore 520558",
    openingHours: "24/7",
  },
  {
    name: "West Coast Park Dog Run",
    address: "Parallel to West Coast Highway (Near Carpark 1)",
    openingHours: "24/7 (Lights until 7 PM)",
  },
  {
    name: "Clementi Woods Park Dog Run",
    address: "52 West Coast Road (next to West Coast Plaza)",
    openingHours: "24/7 (Lights until 7 AM)",
  },
  {
    name: "Jurong Lake Gardens Dog Run",
    address: "104 Yuan Ching Road",
    openingHours: "8:00 AM – 10:00 PM",
  },
  {
    name: "Bukit Gombak Park Dog Run",
    address: "Bukit Batok West Ave 5",
    openingHours: "24/7",
  },
  {
    name: "Villa Verde Park Dog Run",
    address:
      "Within Villa Verde Park, at the end of Verde View, Singapore 688644",
    openingHours: "24/7",
  },
];

type Poi = { key: string; location: google.maps.LatLngLiteral };
const locations: Poi[] = [
  {
    key: "operaHouse",
    location: { lat: 1.3108975655652841, lng: 103.90315204123539 },
  },
];

const PoiMarkers = (props: { pois: Poi[] }) => {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin
          // background={"#FBBC04"}
          // glyphColor={"#000"}
          // borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

function RouteComponent() {
  return (
    <div className="row">
      <div className="col">
        <h1>Dog Runs</h1>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Opening Hours</th>
            </tr>
          </thead>
          <tbody>
            {dogRuns.map((x) => (
              <tr>
                <td>{x.name}</td>
                <td>{x.address}</td>
                <td>{x.openingHours}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <APIProvider
          apiKey={apiKey}
          onLoad={() => console.log("Maps API has loaded.")}
        >
          <Map
            defaultZoom={12}
            defaultCenter={{ lat: 1.366667, lng: 103.8 }}
            mapId={mapId}
            // onCameraChanged={(ev: MapCameraChangedEvent) =>
            //   console.log(
            //     "camera changed:",
            //     ev.detail.center,
            //     "zoom:",
            //     ev.detail.zoom
            //   )
            // }
          >
            <PoiMarkers pois={locations} />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
