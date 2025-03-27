INSERT INTO Departments (name, description) VALUES
('Computer Science', 'Handles computer science courses and faculty'),
('Mechanical Engineering', 'Handles mechanical engineering courses and faculty'),
('Electronics', 'Handles electronics courses and faculty');

INSERT INTO Faculty (first_name, last_name, email, phone_number, address, date_of_birth, hire_date, department_id, position, salary) VALUES
('John', 'Doe', 'john.doe@example.com', '1234567890', '123 Elm Street', '1985-06-15', '2020-01-01', 1, 'Professor', 70000),
('Jane', 'Smith', 'jane.smith@example.com', '0987654321', '456 Maple Avenue', '1990-03-22', '2021-06-01', 2, 'Lecturer', 50000);

INSERT INTO Courses (course_name, course_code, department_id, credits, semester) VALUES
('Data Structures', 'CS101', 1, 4, 'Fall 2024'),
('Thermodynamics', 'ME201', 2, 3, 'Spring 2024'),
('Digital Circuits', 'EC301', 3, 3, 'Summer 2024');

INSERT INTO Faculty_Courses (faculty_id, course_id) VALUES
(1, 1),
(2, 2);

INSERT INTO Attendance (faculty_id, date, status) VALUES
(1, '2024-12-18', 'Present'),
(2, '2024-12-18', 'Absent');

INSERT INTO Users (username, password, role, faculty_id) VALUES
('admin', 'hashed_password_here', 'Admin', NULL),
('johndoe', 'hashed_password_here', 'Faculty', 1),
('janesmith', 'hashed_password_here', 'Faculty', 2);