--- create employee table based on the employee class


CREATE TABLE EmployeeRoles (
    ID SERIAL PRIMARY KEY,
    Role VARCHAR(50) NOT NULL,
    Hierarchy INT NOT NULL,
    Enabled BIT NOT NULL default 0
);

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
    Joined DATE NOT NULL,
    role INT NOT NULL,
    
);


CREATE TABLE Rates (
    ID SERIAL PRIMARY KEY,
    RateType INT NOT NULL,
    PayRate DECIMAL(18,2) NOT NULL,
    Enabled BIT NOT NULL default 1
);


CREATE TABLE Deductions (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Enabled BIT NOT NULL default 1
);


CREATE TABLE Earnings (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Enabled BIT NOT NULL default 1
);



CREATE TABLE Leave (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Earned DECIMAL(5,2) NOT NULL,
    Used DECIMAL(5,2) NOT NULL,
    Enabled BIT NOT NULL default 1
);



CREATE TABLE Payroll (
    ID SERIAL PRIMARY KEY,
    EmployeeID INT NOT NULL,
    Salary INT NOT NULL,
    Enabled BIT NOT NULL default 1
);



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