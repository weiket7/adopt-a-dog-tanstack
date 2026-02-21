import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import z from "zod";

const apiKey = process.env.RESEND_API_KEY;

export const contactAction = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string(),
      mobile: z.string(),
      email: z.string(),
      message: z.string(),
    })
  )
  .handler(async ({ data }) => {
    console.log("Sending email with:", data);

    const resend = new Resend(apiKey);

    resend.emails.send({
      from: "adoptadogsg7@gmail.com",
      to: "weiket7@gmail.com",
      subject: "Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });

    //     Name: Jonathan
    // Subject: Referral from adoptadog.sg | Interest in adopting Marblecake
    // Email: neojonathan6@gmail.com
    // Contact: 83491693

    // Add your Resend/Postmark logic here
    return { success: true };
  });
