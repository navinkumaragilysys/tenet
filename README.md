# Payroll System
## Description
This project is a payroll[^1] [^2]  system[^3] that allows the user to enter employee information and calculate their weekly/Monthly/Yearly pay. The user can also view a list of all employees and their information.

## Table of Contents
* [Tables](#tables)
  * [Employee](#employee)
  * [Rates](#rates)
  * [Deductions lookup](#deductions-lookup)
  * [Earnings lookup](#earnings-lookup)
  * [Leave lookup](#leave-lookup)
  * [Payroll](#payroll)
  * [Payment](#payment)
  * [Bank Details](#bank-details)
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
    IdVerified BIT NOT NULL default 0,
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

<details>
<summary>These are permissible deductions according to the Finance Act, 2015:</summary>

- §80C – Up to ₹ 150,000:
    - Provident and Voluntary Provident Funds (VPF)
    - Public Provident Fund (PPF)
    - Life-insurance premiums
    - Equity-Linked Savings Scheme (ELSS)
    - Home-loan principal repayment
    - Stamp duty and registration fees for a home
    - Sukanya Samriddhi Account
    - National Savings Certificate (NSC) (VIII Issue)
    - Infrastructure bonds
- §80CCC – Life Insurance Corporation annuity premiums up to ₹ 150,000
- §80CCD – Employee pension contributions, up to 10 percent of salary
- §80CCG – Rajiv Gandhi Equity Savings Scheme, 2013: 50 percent of investment or ₹25,000 (whichever is lower), up to ₹ 50,000
- §80D – Medical-insurance premium, up to ₹ 25,000 for self/family and up to ₹ 15,000 for parents (up to ₹ 50,000 for senior citizens); premium cannot be paid in cash.
- §80DD – Expenses for medical treatment (including nursing), training and rehabilitation of a permanently-disabled dependent, up to ₹ 75,000 (₹ 1,25,000 for a severe disability, as defined by law)
- §80DDB – Medical expenses, up to ₹ 40,000 (₹ 100,000 for senior citizens)
- §80E – Student-loan interest
- §80EE – Home-loan interest (up to 100,000 on a loan up to ₹ 2.5 million)
- §80G – Charitable contributions (50 or 100 percent)
- §80GG – Rent minus 10 percent of income, up to ₹ 5,000 per month or 25 percent of income (whatever is less)[16]
- §80TTA – Interest on savings, up to ₹ 10,000
- §80TTB – Time deposit interest for senior citizens, up to ₹ 50,000
- 80U – Certified-disability deduction (₹ 75,000; ₹ 125,000 for a severe disability)
- §87A – Rebate (up to ₹ 12,500) for individuals with income up to ₹ 5,00,000
- 80RRB – Certified royalties on a patent registered on or after 1 April 2003, up to ₹ 300,000
- §80QQB – Certified book royalties (except textbooks), up to ₹ 300,000
</details>

This table will have the details about detections that are applicable. each entry in the table can be mapped to a employee
> [!NOTE]
> *Income tax, Professional tax, Provident fund, Employee State Insurance, Other deductions*

## Tax deduction at source (TDS)
Income tax is also paid by tax deduction at source (TDS): [^4]

| Section |	Payment | TDS threshold | 	TDS |
| ------- | -------- | ------------- | ---- |
|192	| Salary	    | Exemption limit	| As specified in Part III of I Schedule |
|193	| Interest on securities |	Subject to provisions |	10% |
|194A	| Other interest	| Banks – ₹10,000 (under age 60); ₹ 50,000 (over 60). All other interest – ₹5,000 |	10% |
|194B	| Lottery winnings	| ₹10,000 |	30% |
|194BB	| Horse-racing winnings |	₹10,000 |	30% |
|194C	| Payment to resident contractors |	₹30,000 (single contract); ₹100,000 (multiple contracts) |	2% (companies); 1% otherwise |
|194D	| Insurance commission |	₹15,000 |	5% (individual), 10% (domestic companies) |
|194DA	| Life-insurance payment |	₹100,000 |	1% |
|194E	| Payment to non-resident sportsmen or sports association |	Not applicable |	20% |
|194EE	| Payment of deposit under National Savings Scheme |	₹2,500 |	10% |
|194F	| Repurchase of unit by Mutual Fund or Unit Trust of India |	Not applicable |	20% |
|194G	| Commission on sale of lottery tickets |	₹15,000 |	5% |
|194H	| Brokerage commission |	₹15,000 |	5% |
|194-I	| Rents	 |₹180,000 |	2% (plant, machinery, equipment), 10% (land, building, furniture) |
|194IA	| Purchase of immovable property |	₹5,000,000 |	1% |
|194IB	| Rent by individual or HUF not liable to tax audit |	₹50,000 |	5% |
|194J	| Professional or technical services, royalties |	₹30,000 |	10% |
|194LA	| Compensation on acquisition of certain immovable property |	₹250,000 | 10% |
|194LB	| Interest paid by Infrastructure Development Fund under section 10(47) to non-resident or foreign company |	– |	5% |
|194LC	| Interest paid by Indian company or business trust on money borrowed in foreign currency under a loan agreement or long-term bonds |	– |	5% |
|195	| Interest or other amounts paid to non-residents or a foreign company (except under §115O) |	As computed by assessing officer on application under §195(2) or 195(3) |	Avoiding double taxation |


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

## Payment
This table will have the details about the payment made to the employee. each entry in the table is a payment made to an employee.

> [!NOTE]
> *This table will have the details about the payment made to the employee. each entry in the table is a payment made to an employee. It will have the employee id, payment date, payment amount, payment type, payment mode, payment reference, payment status, payment remarks.*

| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | `yes` |
| EmployeeID | int | Foreign key for the employee table | `yes` |
| BankDetailsID | int | Foreign key for the bank details table | `yes` |
| PaymentDate | date | Date of the payment | `yes` |
| PaymentAmount | decimal(18,2) | Amount of the payment | `yes` |
| PaymentType | int | Type of the payment. 1 for salary, 2 for deduction, 3 for earning, 4 for leave | `yes` |
| PaymentMode | int | Mode of the payment. 1 for cash, 2 for check, 3 for bank transfer | `yes` |
| PaymentReference | varchar(50) | Reference of the payment | `yes` |
| PaymentStatus | int | Status of the payment. 1 for paid, 2 for unpaid | `yes` |
| PaymentRemarks | varchar(50) | Remarks of the payment | `yes` |

### Script
```sql
CREATE TABLE Payment (
    ID SERIAL PRIMARY KEY,
    EmployeeID INT NOT NULL,
    PaymentDate DATE NOT NULL,
    PaymentAmount DECIMAL(18,2) NOT NULL,
    PaymentType INT NOT NULL,
    PaymentMode INT NOT NULL,
    PaymentReference VARCHAR(50) NOT NULL,
    PaymentStatus INT NOT NULL,
    PaymentRemarks VARCHAR(50) NOT NULL
);
```

## Bank Details
This table will have the details about the bank account of the employee. each entry in the table is a bank account of an employee.

> [!NOTE]
> *This table will have the details about the bank account of the employee. each entry in the table is a bank account of an employee. It will have the employee id, bank name, bank branch, bank account number, bank account type, bank account holder name, bank account holder address, bank account holder city, bank account holder state, bank account holder zip, bank account holder phone, bank account holder email.*


| Column Name | Data Type | Description | required |
| ----------- | --------- | ----------- | -------- |
| ID | int | Primary key for the employee table | `yes` |
| EmployeeID | int | Foreign key for the employee table | `yes` |
| BankName | varchar(50) | Name of the bank | `yes` |
| BankBranch | varchar(50) | Branch of the bank | `yes` |
| BankCode | varchar(50) | Code of the bank | `yes` |
| BankAccountNumber | varchar(50) | Account number of the bank | `yes` |
| BankAccountType | int | Type of the bank account. 1 for savings, 2 for current | `yes` |
| BankAccountHolderName | varchar(50) | Name of the bank account holder | `yes` |
| BankAccountHolderAddress | varchar(50) | Address of the bank account holder | `yes` |
| BankAccountHolderCity | varchar(50) | City of the bank account holder | `yes` |
| BankAccountHolderState | varchar(50) | State of the bank account holder | `yes` |
| BankAccountHolderZip | varchar(50) | Zip of the bank account holder | `yes` |
| BankAccountHolderPhone | varchar(50) | Phone of the bank account holder | `yes` |
| BankAccountHolderEmail | varchar(50) | Email of the bank account holder | `yes` |


### Script
```sql
CREATE TABLE BankDetails (
    ID SERIAL PRIMARY KEY,
    EmployeeID INT NOT NULL,
    BankName VARCHAR(50) NOT NULL,
    BankBranch VARCHAR(50) NOT NULL,
    BankCode VARCHAR(50) NOT NULL,
    BankAccountNumber VARCHAR(50) NOT NULL,
    BankAccountType INT NOT NULL,
    BankAccountHolderName VARCHAR(50) NOT NULL,
    BankAccountHolderAddress VARCHAR(50) NOT NULL,
    BankAccountHolderCity VARCHAR(50) NOT NULL,
    BankAccountHolderState VARCHAR(50) NOT NULL,
    BankAccountHolderZip VARCHAR(50) NOT NULL,
    BankAccountHolderPhone VARCHAR(50) NOT NULL,
    BankAccountHolderEmail VARCHAR(50) NOT NULL
);
```

## Chart

<details>

<summary>Sample charts</summary>

### Relationship diagram with field names.
    
```mermaid
erDiagram
    Employee ||--o{ Payroll : "ID"
    Employee ||--o{ Rates : "ID"
    Employee ||--o{ Deductions : "ID"
    Employee ||--o{ Earnings : "ID"
    Employee ||--o{ Leave : "ID"
    Employee ||--o{ Payment : "ID"
    Employee ||--o{ BankDetails : "ID"
    Payroll ||--o{ Payment : "ID"
    Rates ||--o{ Payment : "ID"
    Deductions ||--o{ Payment : "ID"
    Earnings ||--o{ Payment : "ID"
    Leave ||--o{ Payment : "ID"
    BankDetails ||--o{ Payment : "ID"
    Employee {
        ID int
        FirstName varchar(50)
        MiddleName varchar(50)
        LastName varchar(50)
        Address varchar(50)
        City varchar(50)
        State varchar(50)
        Zip varchar(50)
        Phone varchar(50)
        Email varchar(50)
        GovernmentID varchar(50)
        IdVerified bit
        Joined date
    }
    Payroll {
        ID int
        EmployeeID int
        Salary int
        Enabled bit
    }
    Rates {
        ID int
        RateType int
        PayRate decimal(18,2)
        Enabled bit
    }
    Deductions {
        ID int
        Description varchar(50)
        Amount decimal(18,2)
        Enabled bit
    }
    Earnings {
        ID int
        Description varchar(50)
        Amount decimal(18,2)
        Enabled bit
    }
    Leave {
        ID int
        Description varchar(50)
        Earned decimal(5,2)
        Used decimal(5,2)
        Enabled bit
    }
    Payment {
        ID int
        EmployeeID int
        BankDetailsID int
        PaymentDate date
        PaymentAmount decimal(18,2)
        PaymentType int
        PaymentMode int
        PaymentReference varchar(50)
        PaymentStatus int
        PaymentRemarks varchar(50)
    }
    BankDetails {
        ID int
        EmployeeID int
        BankName varchar(50)
        BankBranch varchar(50)
        BankCode varchar(50)
        BankAccountNumber varchar(50)
        BankAccountType int
        BankAccountHolderName varchar(50)
        BankAccountHolderAddress varchar(50)
        BankAccountHolderCity varchar(50)
        BankAccountHolderState varchar(50)
        BankAccountHolderZip varchar(50)
        BankAccountHolderPhone varchar(50)
        BankAccountHolderEmail varchar(50)
    }
```


### Class diagrams.
    
```mermaid
classDiagram
    Employee <|-- Payroll
    Employee <|-- Rates
    Employee <|-- Deductions
    Employee <|-- Earnings
    Employee <|-- Leave
    Employee <|-- Payment
    Employee <|-- BankDetails
    Payroll <|-- Payment
    Rates <|-- Payment
    Deductions <|-- Payment
    Earnings <|-- Payment
    Leave <|-- Payment
    BankDetails <|-- Payment
    class Employee{
        <<entity>>
        ID
        FirstName
        MiddleName
        LastName
        Address
        City
        State
        Zip
        Phone
        Email
        GovernmentID
        IdVerified
        Joined
    }
    class Payroll{
        <<entity>>
        ID
        EmployeeID
        Salary
        Enabled
    }
    class Rates{
        <<entity>>
        ID
        RateType
        PayRate
        Enabled
    }
    class Deductions{
        <<entity>>
        ID
        Description
        Amount
        Enabled
    }
    class Earnings{
        <<entity>>
        ID
        Description
        Amount
        Enabled
    }
    class Leave{
        <<entity>>
        ID
        Description
        Earned
        Used
        Enabled
    }
    class Payment{
        <<entity>>
        ID
        EmployeeID
        BankDetailsID
        PaymentDate
        PaymentAmount
        PaymentType
        PaymentMode
        PaymentReference
        PaymentStatus
        PaymentRemarks
    }
    class BankDetails{
        <<entity>>
        ID
        EmployeeID
        BankName
        BankBranch
        BankCode
        BankAccountNumber
        BankAccountType
        BankAccountHolderName
        BankAccountHolderAddress
        BankAccountHolderCity
        BankAccountHolderState
        BankAccountHolderZip
        BankAccountHolderPhone
        BankAccountHolderEmail
    }
```

</details>

## Individual Income Tax Slabs

The proposed Union Budget 2023-24 budget aims to establish the New Tax Regime as the primary tax system, while still allowing the salaried-class taxpayers the choice to opt for the Old Tax Regime and its associated benefits [^5]. Also the tax slabs are different for the new tax regime and old tax regime. The tax slabs for the new tax regime are as follows [^6] [^7].

|Slab  | Tax Rate | New Tax Regime | Old Tax Regime |
|------|----------|----------------|----------------|
|1 |	NIL |	₹0 - ₹3 lakh |₹0 - ₹2.5 lakh |
|2 |	5% |	₹3 lakh - ₹6 lakh |	₹2.5 lakh - ₹5 lakh|
|3 |	10%	| ₹6 lakh - ₹9 lakh |	₹5 lakh - ₹7.5 lakh|
|4 |	15%	| ₹9 lakh - ₹12 lakh | ₹7.5 lakh - ₹10 lakh|
|5 |    20%	| ₹12 lakh - ₹15 lakh |₹10 lakh - ₹12.5 lakh |
|6 |	25% | Not Applicable | ₹12.5 lakh - ₹15 lakh |
|7 |	30% | ₹15 lakh and Above |₹15 lakh and Above |


[^1]: My reference [Writing Efficient Payroll Calculation Formulas](https://docs.oracle.com/cd/E18727-01/doc.121/e14567/T1774T1776.htm#I_efficpay) and [What is payroll software](https://www.oracle.com/in/human-capital-management/payroll/what-is-payroll-software/)

[^2]: [Payroll for India](https://www.oracle.com/in/a/ocom/docs/applications/hcm/oracle-payroll-for-india.pdf)

[^3]: [Payroll](https://www.oracle.com/in/human-capital-management/payroll/#india)

[^4]: [Tax deduction at source](https://en.wikipedia.org/wiki/Income_tax_in_India)

[^5]: [New Tax Regime](https://en.wikipedia.org/wiki/New_Tax_Regime)

[^6]: [INCOME AND TAX CALCULATOR](https://incometaxindia.gov.in/pages/tools/income-tax-calculator.aspx)

[^7]: [TAX CALCULATOR – OLD REGIME vs NEW REGIME](https://incometaxindia.gov.in/Pages/tools/115bac-tax-calculator-finance-act-2023.aspx)