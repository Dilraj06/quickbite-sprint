import { employeeRepo } from "../repositories/employeeRepo";
import type { Employee } from "../types";

type CreateEmployeeInput = {
  firstName: string;
  lastName: string;
  departmentId: string;
};

type FieldErrors = Partial<Record<keyof CreateEmployeeInput, string[]>>;

export type CreateEmployeeResult =
  | { ok: true; employee: Employee }
  | { ok: false; errors: FieldErrors };

export const employeeService = {
  createEmployee(input: CreateEmployeeInput): CreateEmployeeResult {
    const errors: FieldErrors = {};

    const first = input.firstName.trim();
    const last = input.lastName.trim();
    const dept = input.departmentId.trim();

    if (first.length < 3) errors.firstName = ["First Name must be at least 3 characters."];
    if (last.length === 0) errors.lastName = ["Last Name is required."];
    if (!employeeRepo.departmentExists(dept)) errors.departmentId = ["That department does not exist."];

    if (Object.keys(errors).length > 0) return { ok: false, errors };

    const employee = employeeRepo.createEmployee({
      firstName: first,
      lastName: last,
      departmentId: dept,
    });

    return { ok: true, employee };
  },
};
