import { useEffect, useState } from "react";
import "./App.css";

import { useFormInput } from "./hooks/useFormInput";
import { employeeRepo } from "./repositories/employeeRepo";
import { employeeService } from "./services/employeeService";
import type { Department, Employee } from "./types";

export default function App() {
  // Presentation state (what UI shows)
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Form inputs handled by custom hook
  const firstName = useFormInput<string>("");
  const lastName = useFormInput<string>("");
  const departmentId = useFormInput<string>("");

  // On app load: get data from repository (repo is the only source of truth)
  useEffect(() => {
    const deps = employeeRepo.getDepartments();
    setDepartments(deps);

    const emps = employeeRepo.getEmployees();
    setEmployees(emps);

    // set a default department so dropdown has a value
    if (deps.length > 0) departmentId.setValue(deps[0].id);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Clear old messages (optional but nice)
    firstName.setExternalMessages([]);
    lastName.setExternalMessages([]);
    departmentId.setExternalMessages([]);

    // Hook-level validation example (first name length)
    const firstOk = firstName.validate((v) =>
      v.trim().length >= 3 ? [] : ["First Name must be at least 3 characters."]
    );

    // Service-level validation + creation
    const result = employeeService.createEmployee({
      firstName: firstName.value,
      lastName: lastName.value,
      departmentId: departmentId.value,
    });

    if (!firstOk || !result.ok) {
      // Push service errors back into the right hooks
      if (!result.ok) {
        if (result.errors.firstName) firstName.setExternalMessages(result.errors.firstName);
        if (result.errors.lastName) lastName.setExternalMessages(result.errors.lastName);
        if (result.errors.departmentId) departmentId.setExternalMessages(result.errors.departmentId);
      }
      return;
    }

    // Refresh from repo after creation
    setEmployees(employeeRepo.getEmployees());

    // Reset form (optional)
    firstName.setValue("");
    lastName.setValue("");
    // keep department selected
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h1>PiXELL River Financial — Employees</h1>

      <form onSubmit={handleSubmit} style={{ border: "1px solid #444", padding: 16, borderRadius: 8 }}>
        <h2>Add Employee</h2>

        <div style={{ marginBottom: 12 }}>
          <label>First Name</label>
          <input
            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
            value={firstName.value}
            onChange={firstName.onChange}
            placeholder="e.g., Aman"
          />
          {firstName.messages.map((m, i) => (
            <div key={i} style={{ color: "red", marginTop: 6 }}>
              {m}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Last Name</label>
          <input
            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
            value={lastName.value}
            onChange={lastName.onChange}
            placeholder="e.g., Singh"
          />
          {lastName.messages.map((m, i) => (
            <div key={i} style={{ color: "red", marginTop: 6 }}>
              {m}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Department</label>
          <select
            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
            value={departmentId.value}
            onChange={departmentId.onChange}
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {departmentId.messages.map((m, i) => (
            <div key={i} style={{ color: "red", marginTop: 6 }}>
              {m}
            </div>
          ))}
        </div>

        <button type="submit" style={{ padding: "10px 14px", cursor: "pointer" }}>
          Create Employee
        </button>
      </form>

      <h2 style={{ marginTop: 20 }}>Employee List</h2>
      {employees.length === 0 ? (
        <p>No employees yet. Add one above.</p>
      ) : (
        <ul>
          {employees.map((e) => {
            const deptName = departments.find((d) => d.id === e.departmentId)?.name ?? e.departmentId;
            return (
              <li key={e.id}>
                {e.firstName} {e.lastName} — <strong>{deptName}</strong>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}


