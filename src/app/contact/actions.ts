"use server";

import { sendContactFormEmail } from "@/lib/email";

export async function submitContactForm(formData: {
  name: string;
  email: string;
  message: string;
}): Promise<{ error?: string }> {
  if (!formData.name || !formData.email || !formData.message) {
    return { error: "Please fill in all fields." };
  }
  await sendContactFormEmail(formData);
  return {};
}