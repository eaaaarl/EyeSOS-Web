"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [organizationType, setOrganizationType] = useState("")

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Register Organization</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Create an EyeSOS account for your LGU/BLGU
          </p>
        </div>

        <FieldSeparator>Organization Information</FieldSeparator>

        <Field>
          <FieldLabel htmlFor="organizationType">Organization Type</FieldLabel>
          <Select
            value={organizationType}
            onValueChange={setOrganizationType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LGU">LGU (Local Government Unit)</SelectItem>
              <SelectItem value="BLGU">BLGU (Barangay Local Government Unit)</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="organizationName">Organization Name</FieldLabel>
          <Input
            id="organizationName"
            type="text"
            placeholder="City/Municipality Name"
            required
          />
        </Field>

        {organizationType === "BLGU" && (
          <Field>
            <FieldLabel htmlFor="barangayName">Barangay Name</FieldLabel>
            <Input
              id="barangayName"
              type="text"
              placeholder="Enter barangay name"
              required
            />
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="email">Organization Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="organization@example.com"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="contactNumber">Contact Number</FieldLabel>
          <Input
            id="contactNumber"
            type="tel"
            placeholder="+63 XXX XXX XXXX"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="officeAddress">Office Address</FieldLabel>
          <Textarea
            id="officeAddress"
            placeholder="Complete office address"
            className="min-h-20"
            required
          />
        </Field>

        <FieldSeparator>Administrator Information</FieldSeparator>

        <Field>
          <FieldLabel htmlFor="adminName">Full Name</FieldLabel>
          <Input
            id="adminName"
            type="text"
            placeholder="Juan Dela Cruz"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="adminEmail">Email</FieldLabel>
          <Input
            id="adminEmail"
            type="email"
            placeholder="admin@example.com"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="adminMobile">Mobile Number</FieldLabel>
          <Input
            id="adminMobile"
            type="tel"
            placeholder="+63 9XX XXX XXXX"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input id="confirmPassword" type="password" required />
        </Field>

        <Field>
          <Button type="submit" className="w-full">Create Account</Button>
        </Field>

        <FieldDescription className="px-6 text-center">
          Already have an account?{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
