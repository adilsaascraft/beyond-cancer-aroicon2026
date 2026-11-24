
import { z } from 'zod'

/* -------------------- MAIN SCHEMA -------------------- */

export const EVEventRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters'),

  email: z
    .string()
    .trim()
    .email('Enter a valid Email ID'),

  mobile: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9]{10,13}$/,
      'Mobile number must contain 10 to 13 digits, with an optional + prefix'
    ),

  affiliation: z
    .string()
    .trim()
    .min(1, 'Affiliation / Organization is required'),
})

/* -------------------- TYPE -------------------- */

export type EVEventRegistrationForm = z.output<
  typeof EVEventRegistrationSchema
>
