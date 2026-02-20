import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/welfare-groups')({
  component: RouteComponent,
})

const welfareGroups = [
    {
      name: "Gentle Paws",
      email: "farmwaylove@gmail.com",
      website: "https://gentlepaws2010.blogspot.com/",
    },
    {
      name: "OSCAS",
      email: "enquiry@oscas.sg",
      website: "https://www.oscas.sg/",
    },
    {
      name: "Exclusively Mongrels",
      email: "enquiry@exclusivelymongrels.org",
      website: "https://www.exclusivelymongrels.org/",
    },
  ];

function RouteComponent() {
  return (
    <div className="row">
    {
      welfareGroups.map((x) => (
        <div className="col-md-6">
          <h2 className="font-weight-semibold text-5 line-height-6 mt-3 mb-2">
            {x.name}
          </h2>
          <div>Email: {x.email}</div>
          <div>Website: {x.website}</div>
        </div>
      ))
    }
  </div>
  )
}
