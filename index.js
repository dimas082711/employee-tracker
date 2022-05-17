const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const startApp = () => {
    inquirer
        .prompt({
            type: 'list',
            name: 'options',
            message: 'Please choose from the following list of employees',
        choices: ["View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Quit"]
        })
        .then(({ options }) => {
            switch (options) {
                case "View all departments":
                    viewDepartments(db)
                    break;
                case "View all roles":
                    viewRoles(db)
                    break;
                case "View all employees":
                    viewEmployees(db)
                    break;
                case "Add a department":
                    addDepartment(db)
                    break;
                case "Add a role":
                    addRole(db)
                    break;
                case "Add an employee":
                    addEmployee(db)
                    break;
                case "Update an employee role":
                    updateEmployee(db)
                    break;
                case "Quit":
                    console.log("goodbye!")
                    process.exit(1)
            }
        })
}

// allows users to view departments
const viewDepartments = () => {
    const sql = `SELECT department.name AS Department, department.id AS id
                FROM department;`
    db.promise().query(sql)
        .then(rows => {
            console.table(rows[0])
            inquirer.prompt({
                type: 'confirm',
                name: 'confirm',
                message: "Please confirm to return Main Menu"
            })
                .then(confirm => {
                    startApp()
                })
        })
}

//Allows user to view roles across database
const viewRoles = () => {
    const sql = `SELECT role.title, role.id, department.name AS department, role.salary
                FROM role
                LEFT JOIN department ON role.department_id = department.id;`
    db.promise().query(sql)
        .then(rows => {
            console.table(rows[0])
            inquirer.prompt({
                type: 'confirm',
                name: 'confirm',
                message: "Please confirm to return Main Menu"
            })
                .then(confirm => {
                    startApp()
                })
        })
}

//Allows user to view all employees across database
const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary AS salary, department.name AS department, manager_id AS Manager
                 FROM employee
                 LEFT JOIN role ON employee.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id;`
    db.promise().query(sql)
        .then(rows => {
            console.table(rows[0])
            inquirer.prompt({
                type: "confirm",
                name: "confirm",
                message: "Please confirm to return Main Menu"
            })
                .then(confirm => {
                    startApp()
                })
        })
}

//Allows user to add department to the database
const addDepartment = () => {
    const sql = `INSERT INTO department (name) VALUES (?)`
    inquirer
        .prompt({
            type: 'text',
            name: 'department',
            message: 'Please enter the name of the Department you would like to add to the database:'
        })
        .then(function ({ department }) {
            db.query(sql, (department), (err, result) => {
                if (err) throw err
                console.log('Successfully added ' + department + ' to the database!')
                startApp()
            })
        })
}

//Allows users to add role to the database
const addRole = () => {

    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err
        const choices = result.map(choice => {
            return choice = { ...choice, value: choice.id }
        })
        inquirer
            .prompt([{
                type: 'text',
                name: 'title',
                message: 'Please enter the title of the role you would like added to the database:'
            },
            {
                type: 'text',
                name: 'salary',
                message: 'Please enter the salary of the role you would like added to the database:'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department is this new role under?',
                choices: choices
            }
            ]).then(function ({ title, salary, department_id }) {
                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
                db.query(sql, [title, salary, department_id], (err, result) => {
                    if (err) throw err
                    console.log('Successfully added role to the database!')
                    startApp()
                })
            })
    })
}

//Allows user to add employees to the database

const addEmployee = () => {
    db.query(`SELECT id,title FROM role`, (err, result) => {
        if (err) throw err
        const choices = result.map(({ id, title }) => ({ name: title, value: id }))
        db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) throw err
            const employeeList = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }))
            inquirer
                .prompt([
                    {
                    type: 'text',
                    name: 'first_name',
                    message: 'Enter employee first name:'
                },
                {
                    type: 'text',
                    name: 'last_name',
                    message: 'Enter employee last name'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select employee role',
                    choices: choices
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Employees manager name',
                    choices: employeeList
                }
                ]).then(function ({ first_name, last_name, role_id, manager_id }) {
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
                    db.query(sql, [first_name, last_name, role_id, manager_id], (err, result) => {
                        if (err) throw err
                        console.log('Successfully added employee to database')
                        startApp()
                    })
                })
        })
    })
}

//Allows users to updateEmployee as needed to new role
const updateEmployee = () => {
    db.query('SELECT first_name, last_name FROM employee', (err, result) => {
        if (err) throw err
        const employeeList = result.map(({ first_name, last_name }) => ({ name: first_name + " " + last_name }))
        db.query('SELECT id,title FROM role', (err, result) => {
            if (err) throw err
            const roles = result.map(({ id, title }) => ({ name: title, value: id }))
            inquirer
                .prompt([
                    {
                    type: 'list',
                    name: 'name',
                    message: 'Which employee would you like to update role ?',
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Which role would you like this employee to be under?',
                    choices: roles
                }
                ]).then(function ({ role, name }) {
                    const splitName = name.split(' ')
                    const sql = `UPDATE employee SET role_id = ${role} WHERE first_name = '${splitName[0]}' AND last_name = '${splitName[1]}'`
                    db.query(sql, (err, result) => {
                        if (err) throw err
                        console.log('Successfully updated employee role!')
                        startApp()
                    })

                })
        })
    })
}

startApp()