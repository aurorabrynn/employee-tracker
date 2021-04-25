DROP DATABASE IF EXISTS employee_DB;
CREATE database employee_DB;

USE employee_DB;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ahmed", TRUE, "Rockington", 100);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ahmed", TRUE, "Rockington", 100);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jacob", TRUE, "Misty", 10);

INSERT INTO employee (first_name, last_name)
VALUES ("Peter", false);