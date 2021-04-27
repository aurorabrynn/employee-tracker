const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'password',
    database: 'employee_DB',

    multipleStatements: true
});

const start = () => {
    inquirer.prompt([
        {
            name: "choice",
            choices: ["View departments", "View roles", "View employees", "Add department", "Add role", "Add employee", "Update roles", "Delete department", "Delete role", "Delete employee", "Quit"],
            message: "What do you want to do?",
            type: "list"
        }
    ]).then(answers => {
        switch (answers.choice) {
            case "View departments":
                console.log("viewing departments!")
                viewDepartments()
                break;
            case "View roles":
                console.log("viewing roles!")
                viewRoles()
                break;
            case "View employees":
                console.log("viewing employees!")
                viewEmployees()
                break;
            case "Add department":
                console.log("adding departments!")
                addDepartment()
                break;
            case "Add role":
                console.log("adding roles!")
                addRole()
                break;
            case "Add employee":
                console.log("adding employees!")
                addEmployee()
                break;
            case "Update roles":
                console.log("updating roles!")
                updateRoles()
                break;
            case "Delete department":
                console.log("deleting departments!")
                deleteDepartment()
                break;
            case "Delete role":
                console.log("deleting roles!")
                deleteRole()
                break;
            case "Delete employee":
                console.log("deleting employees!")
                deleteEmployee()
                break;

            default:
                console.log("Thank you!")
                connection.end();
                break;
        }
    })
}

const viewDepartments = () => {
    //view department table
    connection.query(`SELECT * FROM department`, (err, data) => {
        if (err) {
            throw err
        } else {
            console.table(data);
            start()
        }
    })
}

const viewRoles = () => {
    //view role table
    connection.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role
    JOIN department ON role.department_id = department.id;`, (err, data) => {
        if (err) {
            throw err
        } else {
            console.table(data);
            start()
        }
    })
}

const viewEmployees = () => {
    //view employee table
    connection.query(`SELECT a.id, a.first_name, a.last_name, role.title, role.salary, department.name AS department, CONCAT(b.first_name, ' ', b.last_name) AS manager FROM employee a
        LEFT JOIN employee b ON a.manager_id = b.id
        JOIN role ON a.role_id = role.id
        JOIN department ON role.department_id = department.id;`, (err, data) => {
        if (err) {
            throw err
        } else {
            console.table(data);
            start()
        }
    })
}

const addDepartment = () => {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What is the new department's name?"
    }).then(answers => {
        connection.query(`INSERT INTO department (name)
        VALUES (?);`, answers.department, (err) => {
            if (err) {
                throw err
            } else {
                console.log("Department successfully added")
                viewDepartments()
                start()
            }
        })
    })
}

const addRole = () => {
    connection.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the new role's title?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the new role's salary?"
            },
            {
                name: "dep",
                type: "list",
                message: "What is the new role's department?",
                choices() {
                    const choiceArray = [];
                    results.forEach(({ name }) => {
                        choiceArray.push(name);
                    });
                    return choiceArray;
                }
            }
        ]).then(answers => {
            connection.query(`SELECT id FROM department WHERE name=?`, answers.dep, (err, data) => {
                if (err) {
                    throw err
                } else {
                    let bar = JSON.stringify(data[0].id)
                    connection.query(`INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)`, [answers.title, answers.salary, bar], (err) => {
                        if (err) {
                            throw err
                        } else {
                            console.log("Role successfully added")
                            viewRoles()
                            start()
                        }
                    })
                }
            })
        })
    })
}



const addEmployee = () => {
    connection.query(`SELECT * FROM role`, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "role",
                type: "list",
                message: "What is the employee's role?",
                choices() {
                    const choiceArray = [];
                    results.forEach(({ title }) => {
                        choiceArray.push(title);
                    });
                    return choiceArray;
                },
            }]).then(response => {
                connection.query(`SELECT id FROM role WHERE title=?`, response.role, (err, data) => {
                    if (err) {
                        throw err
                    } else {
                        let foo = JSON.stringify(data[0].id)
                        connection.query(`SELECT * FROM employee`, (err, results) => {
                            if (err) throw err;
                            inquirer.prompt([
                                {
                                    name: "manager",
                                    type: "list",
                                    message: "Who is the employee's manager?",
                                    choices() {
                                        const choiceArray = ['None'];
                                        results.forEach(({ first_name, last_name }) => {
                                            choiceArray.push(`${first_name} ${last_name}`);
                                        });
                                        return choiceArray;
                                    },
                                }]).then(answers => {
                                    connection.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?`, answers.manager, (err, data) => {
                                        if (err) {
                                            throw err
                                        } else {
                                            if (answers.manager !== 'None') {
                                                bar = JSON.stringify(data[0].id)
                                            } else {
                                                bar = null
                                            }
                                            console.log(bar)
                                            connection.query(
                                                `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                            VALUES (?, ?, ?, ?)`,
                                                [response.firstName, response.lastName, foo, bar],
                                                (err) => {
                                                    if (err) throw err;
                                                    console.log('Employee successfully added');
                                                    viewEmployees()
                                                    start();
                                                })
                                        }
                                    })

                                })
                        })
                    }
                })
            })
    })
}

const updateRoles = () => {
    connection.query(`SELECT * FROM employee`, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "name",
                type: "list",
                message: "Which employee's role do you want to update?",
                choices() {
                    const choiceArray = [];
                    results.forEach(({ first_name, last_name }) => {
                        choiceArray.push(`${first_name} ${last_name}`);
                    });
                    return choiceArray;
                },
            }]).then(response => {
                connection.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?`, response.name, (err, data) => {
                    if (err) {
                        throw err
                    } else {
                        let foo = JSON.stringify(data[0].id)
                        connection.query(`SELECT * FROM role`, (err, results) => {
                            if (err) throw err;
                            inquirer.prompt([
                                {
                                    name: "role",
                                    type: "list",
                                    message: "What is the employee's new role?",
                                    choices() {
                                        const choiceArray = [];
                                        results.forEach(({ title }) => {
                                            choiceArray.push(title);
                                        });
                                        return choiceArray;
                                    },
                                }
                            ]).then(answers => {
                                //answers.role needs to connect to role_id
                                connection.query(`SELECT id FROM role WHERE title=?`, answers.role, (err, data) => {
                                    if (err) {
                                        throw err
                                    } else {
                                        let bar = JSON.stringify(data[0].id)
                                        connection.query(
                                            `UPDATE employee SET role_id = ? WHERE id = ?`,
                                            [bar, foo],
                                            (err) => {
                                                if (err) throw err;
                                                console.log('Role successfully updated');
                                                start();
                                            })
                                    }
                                })

                            })
                        })
                    }
                })
            })
    })
}

const deleteDepartment = () => {
    connection.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department do you want to delete?",
            choices() {
                const choiceArray = [];
                results.forEach(({ name }) => {
                    choiceArray.push(name);
                });
                return choiceArray;
            }
        }).then(answers => {
            connection.query(`DELETE FROM department WHERE name=?`, answers.department, (err) => {
                if (err) {
                    throw err
                } else {
                    console.log("Department successfully deleted")
                    viewDepartments()
                    start()
                }
            })
        })
    })
}

const deleteRole = () => {
    connection.query(`SELECT * FROM role`, (err, results) => {
        if (err) throw err;
        inquirer.prompt({
            name: "role",
            type: "list",
            message: "Which role do you want to delete?",
            choices() {
                const choiceArray = [];
                results.forEach(({ title }) => {
                    choiceArray.push(title);
                });
                return choiceArray;
            }
        }).then(answers => {
            connection.query(`DELETE FROM role WHERE title=?`, answers.role, (err) => {
                if (err) {
                    throw err
                } else {
                    console.log("Role successfully deleted")
                    viewRoles()
                    start()
                }
            })
        })
    })
}

const deleteEmployee = () => {
    connection.query(`SELECT * FROM employee`, (err, results) => {
        if (err) throw err;
        inquirer.prompt({
            name: "employee",
            type: "list",
            message: "Which employee do you want to delete?",
            choices() {
                const choiceArray = [];
                results.forEach(({ first_name, last_name }) => {
                    choiceArray.push(`${first_name} ${last_name}`);
                });
                return choiceArray;
            },
        }).then(answers => {
            connection.query(`DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?`, answers.employee, (err) => {
                if (err) {
                    throw err
                } else {
                    console.log("Employee successfully deleted")
                    viewEmployees()
                    start()
                }
            })
        })
    })
}


connection.connect((err) => {
    if (err) throw err;
    console.log("config done!")
    start()
})