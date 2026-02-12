import { useState } from "react";

type ValidateFn<T> = (value: T) => string[];

export function useFormInput<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [messages, setMessages] = useState<string[]>([]);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setValue(e.target.value as unknown as T);
    setMessages([]);
  }

  function validate(validateFn: ValidateFn<T>) {
    const results = validateFn(value);
    setMessages(results);
    return results.length === 0;
  }

  function setExternalMessages(msgs: string[]) {
    setMessages(msgs);
  }

  return { value, setValue, onChange, messages, validate, setExternalMessages };
}
