# Payroll System
## Description
This project is a payroll system that allows the user to enter employee information and calculate their weekly/Monthly/Yearly pay. The user can also view a list of all employees and their information.

## Table of Contents
* [Tables](#tables)
  * [Employee](#employee)
  * [Rates](#rates)
  * [Deductions lookup](#deductions-lookup)
  * [Earnings lookup](#earnings-lookup)
  * [Leave lookup](#leave-lookup)
  * [Payroll](#payroll)
* [Usage](#usage)
* [Chart](#chart)
    * [Relationship diagram](#relationship-diagram)
    * [Class diagrams](#class-diagrams)

## Tables

## Employee

### Design

> [!NOTE]
> *This table will have the basic details about the employee. Middle name is optional. IdVerified is a bit field which will have 0 or 1. 0 means GovernmentID not verified and 1 means verified. Joined field will have the date when the employee joined the company. PayrollID is a foreign key which will have the primary key of the payroll table.*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | `yes` |
| FirstName | varchar(50) | First name of the employee | `yes` |
| MiddleName | varchar(50) | Middle name of the employee | **no** |
| LastName | varchar(50) | Last name of the employee |  `yes` |
| Address | varchar(50) | Address of the employee | `yes` |
| City | varchar(50) | City of the employee |   `yes` |
| State | varchar(50) | State of the employee | `yes` |
| Zip | varchar(50) | Zip code of the employee |    `yes` |
| Phone | varchar(50) | Phone number of the employee |  `yes` |   
| Email | varchar(50) | Email address of the employee | `yes` |
| GovernmentID | varchar(50) | Government ID of the employee | `yes` |
| IdVerified | bit | Whether or not the employee's ID has been verified |  `yes` |
| Joined | date | Date the employee joined the company | `yes` |

### Script

```sql
CREATE TABLE Employee (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    MiddleName VARCHAR(50),
    LastName VARCHAR(50) NOT NULL,
    Address VARCHAR(50) NOT NULL,
    City VARCHAR(50) NOT NULL,
    State VARCHAR(50) NOT NULL,
    Zip VARCHAR(50) NOT NULL,
    Phone VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL,
    GovernmentID VARCHAR(50) NOT NULL,
    IdVerified BIT NOT NULL,
    Joined DATE NOT NULL
);
```
## Rates.
Pay rate based on Paytype.

> [!NOTE]
> *Paytype can be specified as hourly 24 hours for daily. 168 hours for weekly. 730 hours for monthly. 8760 hours for yearly. Assuming 8 hours per day and 5 days per week. 40 hours per week. 160 hours per month. 2080 hours per year. The formula for calculating the hourly rate is as follows: Hourly Rate = (Annual Salary / 2080) * 1.5. The formula for calculating the daily rate is as follows: Daily Rate = (Annual Salary / 260) * 1.5. The formula for calculating the weekly rate is as follows: Weekly Rate = (Annual Salary / 52) * 1.5. The formula for calculating the monthly rate is as follows: Monthly Rate = (Annual Salary / 12) * 1.5. Also OT rate is 1.5 times the normal rate. OT rate is applicable only for hourly rate. OT rate is not applicable for salary rate.*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the payroll table | `yes` |
| RateType | int | Type of the rate. 1 for hourly and 2 for salary | `yes` |
| PayRate | decimal(18,2) | Pay rate of the employee | `yes` |
| Enabled | bit | Whether or not the rate is enabled | `yes` |

### Script
```sql
CREATE TABLE Rates (
    ID SERIAL PRIMARY KEY,
    RateType INT NOT NULL,
    PayRate DECIMAL(18,2) NOT NULL,
    Enabled BIT NOT NULL default 1
);
```
## Deductions lookup.

This table will have the details about detections that are applicable. each entry in the table can be mapped to a employee
> [!NOTE]
> *Income tax, Professional tax, Provident fund, Employee State Insurance, Other deductions*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | `yes` |
| Description | varchar(50) | Description of the detection | `yes` |
| Amount | decimal(18,2) | Amount of the detection | `yes` |
| Enabled | bit | Whether or not the rate is enabled | `yes` |

### Script
```sql
CREATE TABLE Deductions (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Enabled BIT NOT NULL default 1
);
```
## Earnings lookup.

This table will have the details about earnings that are applicable. each entry in the table can be mapped to a employee
> [!NOTE]
> *Salary earnings are the fixed amount of compensation that an employee receives for their work, usually on a monthly or annual basis. Salary earnings vary depending on the job title, skills, experience, education, industry, and location of the employee.*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | `yes` |
| Description | varchar(50) | Description of the earning | `yes` |
| Amount | decimal(18,2) | Amount of the earning | `yes` |
| Enabled | bit | Whether or not the rate is enabled | `yes` |

### Script
```sql
CREATE TABLE Earnings (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Enabled BIT NOT NULL default 1
);
```
## Leave lookup.
Leave details of the employee.
> [!NOTE]
> *Privilege Leave (PL) / Earned Leave (EL) / Annual Leave (AL),
Casual Leave (CL),
Sick Leave (SL),
Maternity Leave (ML),
Marriage Leave,
Paternity Leave,
Bereavement Leave,
Compensatory Off (comp-off),
Loss Of Pay Leave (LOP/LWP)*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | `yes` |
| Description | varchar(50) | Description of the leave | `yes` |
| Earned | decimal(5,2) | Amount of the leave earned | `yes` |
| Used | decimal(5,2) | Amount of the leave used | `yes` |
| Enabled | bit | Whether or not the rate is enabled | `yes` |

### Script
```sql
CREATE TABLE Leave (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Earned DECIMAL(5,2) NOT NULL,
    Used DECIMAL(5,2) NOT NULL,
    Enabled BIT NOT NULL default 1
);
```
## Payroll
This table will have the link between employee and rates, deductions, earnings and leave. each entry in the table is either a rate, deduction, earning or leave for an employee.

> [!NOTE]
> *Being a link table it will have primary key and foregin key to Employee. Each employee will have multiple entries for each of the rates, deductions, earnings and leave.*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | `yes` |
| EmployeeID | int | Foreign key for the employee table | `yes` |
| Salary | int | Salary of the employee | `yes` |
| Enabled | bit | Whether or not the rate is enabled | `yes` |

### Script
```sql
CREATE TABLE Payroll (
    ID SERIAL PRIMARY KEY,
    EmployeeID INT NOT NULL,
    Salary INT NOT NULL,
    Enabled BIT NOT NULL default 1
);
```

## Chart


### Relationship diagram.

```mermaid
graph LR
A[Employee] -- 1:n --> B((Payroll))
A -- 1:n --> C((Rates))
A -- 1:n --> D((Deductions))
A -- 1:n --> E((Earnings))
A -- 1:n --> F((Leave))
```

### Class diagrams.

```mermaid
classDiagram
    Employee <|-- Payroll
    Employee <|-- Rates
    Employee <|-- Deductions
    Employee <|-- Earnings
    Employee <|-- Leave
    class Employee{
        +int ID
        +varchar(50) FirstName
        +varchar(50) MiddleName
        +varchar(50) LastName
        +varchar(50) Address
        +varchar(50) City
        +varchar(50) State
        +varchar(50) Zip
        +varchar(50) Phone
        +varchar(50) Email
        +varchar(50) GovernmentID
        +bit IdVerified
        +date Joined
    }
    class Payroll{
        +int ID
        +int EmployeeID
        +int Salary
        +bit Enabled
    }
    class Rates{
        +int ID
        +int RateType
        +decimal(18,2) PayRate
        +bit Enabled
    }
    class Deductions{
        +int ID
        +varchar(50) Description
        +decimal(18,2) Amount
        +bit Enabled
    }
    class Earnings{
        +int ID
        +varchar(50) Description
        +decimal(18,2) Amount
        +bit Enabled
    }
    class Leave{
        +int ID
        +varchar(50) Description
        +decimal(5,2) Earned
        +decimal(5,2) Used
        +bit Enabled
    }
```