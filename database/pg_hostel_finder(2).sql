USE pg_hostel_finder;

INSERT INTO users(name,email,password,role)
VALUES
('Rahul Sharma','rahul@gmail.com','123456','owner'),
('Priya Singh','priya@gmail.com','123456','owner'),
('Admin','admin@gmail.com','admin123','admin');

INSERT INTO hostels
(owner_id,hostel_name,description,city,area,address,contact_phone)
VALUES
(1,'Green Valley PG',
'Boys PG near college',
'Bangalore',
'Marathahalli',
'123 Main Road',
'9876543210'),

(2,'Sunrise Hostel',
'Girls hostel with WiFi',
'Bangalore',
'Whitefield',
'456 Park Street',
'9876543211');

INSERT INTO rooms
(hostel_id,room_type,rent,capacity,available_beds)
VALUES
(1,'Single',8000,1,1),
(1,'Double',6000,2,2),
(2,'Triple',5000,3,2);

INSERT INTO hostel_images
(hostel_id,image_url)
VALUES
(1,'green1.jpg'),
(1,'green2.jpg'),
(2,'sunrise1.jpg');

INSERT INTO reviews
(hostel_id,user_name,rating,comment)
VALUES
(1,'Amit',5,'Excellent stay'),
(1,'Kiran',4,'Good facilities'),
(2,'Riya',5,'Very clean hostel');

SELECT * FROM users;
SELECT * FROM hostels;
SELECT * FROM rooms;
SELECT * FROM hostel_images;
SELECT * FROM reviews;