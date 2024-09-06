INSERT INTO department (department_name)
VALUES
('Maintenance'),
('Sales'),
('Marketing'),
('Finance'),
('Engineering'),
('Human Resources'),
('Customer Success');

INSERT INTO role (title, salary, department_id)
VALUES
('Customer Success Manager', 75000.00, 7),
('Marketing Manager', 150000.00, 3),
('Janitor', 50000.00, 1),
('Financial Analyst', 150000.00, 4),
('Software Engineer', 250000.00, 5),
('Account Executive', 300000.00, 2),
('HR Specialist', 50000.00, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Mike', 'Johnson', 1,1),
('Bob', 'Stewart', 2,2),
('Dylan', 'Brown', 3,3),
('Stew', 'Stewieson', 4,1),
('Alfie', 'Tate', 5,2),
('Adam', 'Cruz', 6,3),
('Jack', 'Mac', 7,1);