CREATE DATABASE IF NOT EXISTS payroll;
USE payroll;

-- https://gist.githubusercontent.com/robcowie/1539835/raw/ca2773a8a43fd9f001dc61ece20f46eddea11114/alphanumeric_code.pgsql
-- Generate a random alphanumeric code of length 7
CREATE OR REPLACE FUNCTION generate_random_seven_digit_code()
RETURNS char(7) AS $$
DECLARE _serial char(7); _i int; _chars char(36) = 'abcdefghijklmnopqrstuvwxyz0123456789';
BEGIN
    _serial = '';
    FOR _i in 1 .. 7 LOOP
        _serial = _serial || substr(_chars, int4(floor(random() * length(_chars))) + 1, 1);
    END LOOP;
    RETURN lower(_serial);
END;
$$ LANGUAGE plpgsql VOLATILE;

select UPPER(AlphaNumericSerial());

-- 16 digit number generator
CREATE OR REPLACE FUNCTION generate_random_16_digit_unique_id()
RETURNS TEXT AS
$$
DECLARE
result TEXT;
BEGIN
WITH RandomDigits AS (
    SELECT ARRAY(SELECT generate_series(0, 9)) AS digits)
SELECT 
    string_agg(digit::text, '' ORDER BY random()) INTO result
FROM unnest((SELECT digits FROM RandomDigits)) digit LIMIT 16;
RETURN result;
END;
$$
LANGUAGE plpgsql;

select generate_random_16_digit_unique_id()

-- Create a trigger on the table RollsLookup on delete to update the records

CREATE OR REPLACE FUNCTION updateRolesLookup() RETURNS TRIGGER AS $$
BEGIN
    UPDATE RolesLookup SET Enabled = B'0' WHERE ID = OLD.ID;
    RETURN OLD;
END;

CREATE TABLE IF NOT EXISTS RolesLookup (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Hierarchy INT NOT NULL,
    Enabled BIT(1) NOT NULL default B'0'
);

CREATE SEQUENCE IF NOT EXISTS public.roles_id_seq
    INCREMENT 1
    START 101
    MINVALUE 101
    MAXVALUE 5000000
    CACHE 1;

CREATE TABLE IF NOT EXISTS ProofsLookup (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Enabled BIT(1) NOT NULL default B'0'
);

CREATE SEQUENCE IF NOT EXISTS public.proofs_id_seq
    INCREMENT 1
    START 101
    MINVALUE 101
    MAXVALUE 5000000
    CACHE 1;

CREATE TABLE IF NOT EXISTS Employee (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    MiddleName VARCHAR(50),
    LastName VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL default UPPER(AlphaNumericSerial()),
    unique_id VARCHAR(16) NOT NULL default generate_random_16_digit_unique_id(), 
    Address VARCHAR(50) NOT NULL,
    City VARCHAR(50) NOT NULL,
    State VARCHAR(50) NOT NULL,
    Zip VARCHAR(50) NOT NULL,
    Phone VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL,
    GovernmentID INT NOT NULL,
    IdVerified BIT(1) NOT NULL default B'0',
    Joined DATE NOT NULL,
    role INT NOT NULL,
	isLocked BIT(1) NOT NULL default B'0',
    CONSTRAINT fk_RolesLookup FOREIGN KEY (role) REFERENCES RolesLookup(ID),
    CONSTRAINT fk_ProofsLookup FOREIGN KEY (GovernmentID) REFERENCES ProofsLookup(ID)
);

-- create a trigger on employee table when username is updated
CREATE OR REPLACE FUNCTION updateUsername() RETURNS TRIGGER AS $$
BEGIN
    UPDATE Employee SET username = UPPER(AlphaNumericSerial()) WHERE ID = NEW.ID;
    RETURN NEW;
END;

INSERT INTO public.roleslookup(
	description, hierarchy, enabled)
	VALUES ('CEO', 1, B'1'), 
	('CTO', 2, B'1'), 
	('CFO', 3, B'1'), 
	('Vice President', 4, B'1'), 
	('Manager', 5, B'1'), 
	('Team Lead', 6, B'1'), 
	('Senior Developer', 7, B'1'), 
	('Developer', 8, B'1'), 
	('Intern', 9, B'1'), 
	( 'HR', 10, B'1'), 
	( 'Accountant', 11, B'1'), 
	( 'Receptionist', 12, B'1'), 
	( 'Security', 13, B'1'),
	( 'Cleaner', 14, B'1'), 
	( 'Other', 15, B'1');  


INSERT INTO public.proofslookup(
	description, enabled)
	VALUES 
	('Passport', B'1'), 
	('Driving License', B'1'), 
	('Voter ID', B'1'), 
	('Aadhar Card', B'1'), 
	('PAN Card', B'1'), 
	('Ration Card', B'1'), 
	('Bank Passbook', B'1'), 
	('Other', B'1');

CREATE SEQUENCE IF NOT EXISTS public.employee_id_seq
    INCREMENT 1
    START 101
    MINVALUE 101
    MAXVALUE 5000000
    CACHE 1;

INSERT INTO public.employee(
	id, firstname, middlename, lastname, address, city, state, zip, phone, email, governmentid, idverified, joined, role, islocked)
	VALUES 
    (101, 'Karan', 'Kumar', 'Raj', 'No. 1, 2nd Street', 'Chennai', 'Tamil Nadu', '600001', '9876543210', 'n@n.com', 1, B'1', '2020-01-01', 1, B'0'),
    (102, 'ram', 'Kumar', 'vel', 'No. 1, 2nd Street', 'Chennai', 'Tamil Nadu', '600001', '9876543210', 'y@y.com', 2, B'1', '2020-01-01', 2, B'0'),
    (103, 'Kumar', 'Raj', 'Maha', 'No. 1, 2nd Street', 'Chennai', 'Tamil Nadu', '600001', '9876543210', 'x@x.com', 3, B'1', '2020-01-01', 3, B'0'),
    (104, 'Navin', 'Karthik', 'Kumar', 'No. 1, 2nd Street', 'Chennai', 'Tamil Nadu', '600001', '9876543210', 'p@p.com', 4, B'1', '2020-01-01', 4, B'0'),
    (105, 'praveen', 'Kumar', 'Raj', 'No. 1, 2nd Street', 'Chennai', 'Tamil Nadu', '600001', '9876543210', 'xc@xc.com', 5, B'1', '2020-01-01', 5, B'0'),
    (106, 'Pon', 'Kumar', 'rajesh', 'No. 1, 2nd Street', 'Chennai', 'Tamil Nadu', '600001', '9876543210', 'er@er.com', 6, B'1', '2020-01-01', 6, B'0');
    

CREATE TABLE Rates (
    ID SERIAL PRIMARY KEY,
    RateType INT NOT NULL,
    PayRate DECIMAL(18,2) NOT NULL,
    Enabled BIT(1) NOT NULL default B'1'
);


CREATE TABLE Deductions (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Enabled BIT(1) NOT NULL default B'1'
);


CREATE TABLE Earnings (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Enabled BIT(1) NOT NULL default B'1'
);



CREATE TABLE Leave (
    ID SERIAL PRIMARY KEY,
    Description VARCHAR(50) NOT NULL,
    Earned DECIMAL(5,2) NOT NULL,
    Used DECIMAL(5,2) NOT NULL,
    Enabled BIT(1) NOT NULL default B'1'
);



CREATE TABLE Payroll (
    ID SERIAL PRIMARY KEY,
    EmployeeID INT NOT NULL,
    Salary INT NOT NULL,
    Enabled BIT(1) NOT NULL default B'1'
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