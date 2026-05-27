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
