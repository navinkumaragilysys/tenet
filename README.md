# Payroll System
## Description
This project is a payroll system that allows the user to enter employee information and calculate their weekly pay. The user can also view a list of all employees and their information.

## Table of Contents
* [Tables](#tables)
* [Scripts](#scripts)
* [Usage](#usage)

## Tables

### Employee Table
| Column Name | Data Type | Description |
| ----------- | --------- | ----------- |
| EmployeeID | int | Primary key for the employee table |
| FirstName | varchar(50) | First name of the employee |
| MiddleName | varchar(50) | Middle name of the employee |
| LastName | varchar(50) | Last name of the employee |
| Address | varchar(50) | Address of the employee |
| City | varchar(50) | City of the employee |
| State | varchar(50) | State of the employee |
| Zip | varchar(50) | Zip code of the employee |
| Phone | varchar(50) | Phone number of the employee |
| Email | varchar(50) | Email address of the employee |
| PayRollID | int | Foreign key for the payroll table |