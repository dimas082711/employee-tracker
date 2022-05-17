INSERT INTO department (name)
VALUES
('Manager'),
('Staff'),
('Employees');

INSERT INTO role(title, salary, department_id)
VALUES
('General Manager', 162000, 1),
('Operation Manager', 140000, 1),
('Staff', 75000, 2),
('Operation Staff', 70000, 2),
('Financial Team', 65000, 3),
('Sales Team', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Alex', 'Smirnoff', 1, NULL),
('Jane', 'Gofrey', 2, 1),
('John', 'Doe', 2, 1),
('Serge', 'Forkaf', 3, NULL),
('Anna', 'Lastly', 4, 3),
('Mark', 'Sorkoff', 5, NULL),
('Maya', 'Fedorof', 6, 5),
('Ivan', 'Podubniy', 6, 5);