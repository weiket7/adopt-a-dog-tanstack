import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import z from "zod";
import { getConvexServerClient } from "./convex";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.warn("email.ts - RESEND_API_KEY not set. Emails will not be sent.");
}

export const emailWelfareGroup = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      dogId: z.string(),
      name: z.string(),
      mobile: z.string(),
      email: z.string(),
      message: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const convex = getConvexServerClient();
    const dog = await convex.query(api.dogs.get, {
      id: data.dogId as Id<"dogs">,
    });

    if (!dog || !dog.welfareGroupId) {
      throw new Error("Dog or Welfare Group not found");
    }

    const group = await convex.query(api.welfareGroups.getById, {
      id: dog.welfareGroupId,
    });

    if (!group) {
      throw new Error("Welfare Group not found");
    }
    if (!group.email) {
      throw new Error("Welfare Group email not found");
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    const recipient = isDevelopment ? "weiket7@gmail.com" : group.email;
    const sender = isDevelopment
      ? "onboarding@resend.dev"
      : "hello@adoptadog.sg";
    console.log(`emailWelfareGroup - Sending email to: ${recipient}`);

    const resend = new Resend(apiKey);

    const { data: result, error } = await resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: data.email,
      subject: `Interest in adopting ${dog.name} | Referral from adoptadog.sg`,
      html: `
        <h3>New Adoption Inquiry</h3>
        <p><strong>Dog:</strong> ${dog.name}</p>
        <hr />
        <p><strong>From:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Contact:</strong> ${data.mobile}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    if (error) {
      return console.error({ error });
    }

    return { success: true };
  });
