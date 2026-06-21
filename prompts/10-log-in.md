refer to design/app.jsx, in footer, there's a new link to log in which opens a LoginModal

when click sign in, call convex/auth.js

after sign in, redirect to admin.dogs.tsx, change "Log in" to "Admin" which redirects to it as well and add a link to log out which calls convex log out

given relevant css has been added to src/styles/app.css

implement it

---

add a page listing all users, button to create user, simple form to enter email, password, select welfare group and upon submit will create a user into convex auth

if user with role Admin log in, show all dogs

if user with role Member log in, show dogs under his welfareGroupId

---

refer to design/events-admin.jsx

1. add convex/events.ts
2. add necessarry CSS to styles/admin.css,
3. implement it into src/routes/admin.events.index.tsx

--

if user is Admin, show admin/dogs, admin/events and admin/users

if user is Member, shoow admin/dogs

else show existing menu

Using Tanstack and Convex, ensure admin.dogs.index.tsx can be accessed when user is authenticated

--

refer to design/services.js, update convex/schema.js with new services table and add a seedServices function

refer to design/app.jsx ServicesView(), implement a new page src/routes/services

---

## Vets

1. Download PDF from https://avs.nparks.gov.sg/outreach/resources/public-registry-of-avs-licensed-veterinary-centres/
2. Parse it into a table
3. `refer to design/vets.xlsx, go to seeds.ts, replace existing VETS with the data`
4. In Convex, run seedVets function

## Dogs

```
refer to design/admin.jsx

given src/styles/admin.css

implement in src/routes/admin.dogs.index.tsx, ignore admin.dogs.$dogId.tsx
```

---

given styles/app.css has relevant css already

refer to design/app.jsx <ServicesView />

implement featured services with an image, when tap the image, open the gallery

---

refer to design/app.jsx BlogView and data in design/blog.js

given css exist in styles/app.css

implement src/routes/blog.tsx
