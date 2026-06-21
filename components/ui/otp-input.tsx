"use client"

import {
  useCallback,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react"
import { OTP_LENGTH } from "@/lib/auth/otp-session"
import { cn } from "@/lib/shared/utils"

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  id?: string
  disabled?: boolean
  autoFocus?: boolean
  "aria-invalid"?: boolean
  className?: string
}

export function OtpInput({
  value,
  onChange,
  length = OTP_LENGTH,
  id = "otp",
  disabled = false,
  autoFocus = false,
  "aria-invalid": ariaInvalid,
  className,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const focusInput = useCallback((index: number) => {
    const el = inputsRef.current[index]
    if (!el) return
    el.focus()
    el.select()
  }, [])

  const applyValue = useCallback(
    (nextValue: string, focusIndex?: number) => {
      const sanitized = nextValue.replace(/\D/g, "").slice(0, length)
      onChange(sanitized)
      if (focusIndex != null) {
        focusInput(Math.min(Math.max(focusIndex, 0), length - 1))
      }
    },
    [focusInput, length, onChange],
  )

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "")
    if (digits.length > 1) {
      applyValue(digits, digits.length - 1)
      return
    }

    const chars = Array.from({ length }, (_, i) => value[i] ?? "")
    chars[index] = digits
    applyValue(chars.join(""))
    if (digits && index < length - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault()
      if (value[index]) {
        const chars = Array.from({ length }, (_, i) => value[i] ?? "")
        chars[index] = ""
        applyValue(chars.join(""))
        return
      }
      if (index > 0) {
        const chars = Array.from({ length }, (_, i) => value[i] ?? "")
        chars[index - 1] = ""
        applyValue(chars.join(""))
        focusInput(index - 1)
      }
      return
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault()
      focusInput(index - 1)
      return
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!pasted) return
    applyValue(pasted, pasted.length - 1)
  }

  return (
    <div
      className={cn("flex justify-center gap-2 sm:gap-3", className)}
      role="group"
      aria-label="Kode OTP"
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && index === 0}
          maxLength={1}
          value={value[index] ?? ""}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.currentTarget.select()}
          className={cn(
            "h-12 w-10 rounded-lg border border-input bg-transparent text-center text-lg font-semibold shadow-xs outline-none sm:h-14 sm:w-12",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            ariaInvalid && "border-destructive focus-visible:ring-destructive/20",
          )}
        />
      ))}
    </div>
  )
}
