import type { Department, Employee } from "../types";

type DB = {
  departments: Department[];
  employees: Employee[];
};

const STORAGE_KEY = "pixell_db_v1";

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
}

function seedDB(): DB {
  return {
    departments: [
      { id: "d1", name: "Personal Banking" },
      { id: "d2", name: "Business Banking" },
      { id: "d3", name: "IT Support" },
    ],
    employees: [],
  };
}

function readDB(): DB {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedDB();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as DB;
  } catch {
    const seeded = seedDB();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function writeDB(db: DB) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export const employeeRepo = {
  getDepartments(): Department[] {
    return readDB().departments;
  },
  getEmployees(): Employee[] {
    return readDB().employees;
  },
  departmentExists(departmentId: string): boolean {
    return readDB().departments.some((d) => d.id === departmentId);
  },
  createEmployee(input: Omit<Employee, "id">): Employee {
    const db = readDB();
    const newEmployee: Employee = { id: makeId(), ...input };
    db.employees.push(newEmployee);
    writeDB(db);
    return newEmployee;
  },
};