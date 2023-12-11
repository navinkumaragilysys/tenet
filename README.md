# Payroll System
## Description
This project is a payroll system that allows the user to enter employee information and calculate their weekly pay. The user can also view a list of all employees and their information.

## Table of Contents
* [Tables](#tables)
* [Scripts](#scripts)
* [Usage](#usage)

## Tables

## Employee

### Design

*(This table will have the basic details about the employee.Middle name is optional. IdVerified is a bit field which will have 0 or 1. 0 means GovernmentID not verified and 1 means verified. Joined field will have the date when the employee joined the company. PayrollID is a foreign key which will have the primary key of the payroll table.)*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | - [x] |
| FirstName | varchar(50) | First name of the employee | yes |
| MiddleName | varchar(50) | Middle name of the employee | no |
| LastName | varchar(50) | Last name of the employee |  yes |
| Address | varchar(50) | Address of the employee | yes |
| City | varchar(50) | City of the employee |   yes |
| State | varchar(50) | State of the employee | yes |
| Zip | varchar(50) | Zip code of the employee |    yes |
| Phone | varchar(50) | Phone number of the employee |  yes |   
| Email | varchar(50) | Email address of the employee | yes |
| GovernmentID | varchar(50) | Government ID of the employee | yes |
| IdVerified | bit | Whether or not the employee's ID has been verified |   yes |
| Joined | date | Date the employee joined the company | yes |
| PayRollID | int | Foreign key for the payroll table | yes |

## Payroll

### Rates.
*(Pay rate based on pay type. if )*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the payroll table | yes |
| RateType | int | Type of the rate. 1 for hourly and 2 for salary | yes |
| PayRate | decimal(18,2) | Pay rate of the employee | yes |

### Detections.
*(This table will have the details about detections that are applicable. each entry in the table can be mapped to employees)*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | yes |
| Description | varchar(50) | Description of the detection | yes |
| Amount | decimal(18,2) | Amount of the detection | yes |

### Earnings.

*(This table will have the details about earnings that are applicable. each entry in the table can be mapped to employees)*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | yes |
| Description | varchar(50) | Description of the earning | yes |
| Amount | decimal(18,2) | Amount of the earning | yes |


### Leave.
*(Privilege Leave (PL) / Earned Leave (EL) / Annual Leave (AL),
Casual Leave (CL),
Sick Leave (SL),
Maternity Leave (ML),
Marriage Leave,
Paternity Leave,
Bereavement Leave,
Compensatory Off (comp-off),
Loss Of Pay Leave (LOP/LWP))*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | yes |
| Description | varchar(50) | Description of the leave | yes |
| Earned | decimal(18,2) | Amount of the leave earned | yes |
| Used | decimal(18,2) | Amount of the leave used | yes |