DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;
-- USE employeeTracker_db;
\c employeetracker_db

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    salary DECIMAL(10,2),
    department_id INT,
    constraint fk_department
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
    );

    CREATE TABLE employee (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INT,
        constraint fk_role
        FOREIGN KEY (role_id)
        REFERENCES role(id),
        manager_id INT,
        constraint fk_manager
        FOREIGN KEY (manager_id)
        REFERENCES employee(id)
    );