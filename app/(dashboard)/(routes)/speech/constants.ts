import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "speech prompt is required"
  }),
  voice:z.string().min(1)
});
export const VoiceOption = [
  {
    value: "alloy",
    label: "alloy",
  },
  {
    value: "echo",
    label: "echo",
  },
  {
    value: "onyx",
    label: "onyx",
  },
  {
    value: "nova",
    label: "nova",
  }
  ,
  {
    value: "shimmer",
    label: "shimmer",
  }
];
