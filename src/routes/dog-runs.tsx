import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dog-runs")({
  component: RouteComponent,
});

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
    address:
      "Located within Koon Seng Park, at the junction of Koon Seng Road and Joo Chiat Lane, Singapore 427013",
    openingHours: "24/7",
  },
  {
    name: "Guillemard Road Open Space Dog Run",
    address:
      "Located at the junction of Guillemard Road and Lorong 22 Geylang (opposite the former Guillemard Camp area).",
    openingHours: "24/7",
  },
];

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
      </div>
    </div>
  );
}
