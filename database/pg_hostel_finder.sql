
USE pg_hostel_finder;

create table users(
	user_id int auto_increment primary key,
    name varchar(100)not null,
    email varchar(100)not null,
    password varchar(100)not null,
    role enum('owner','admin') default 'owner',
    created_at timestamp default current_timestamp
);

create table hostels(
	hostel_id int auto_increment primary key,
	owner_id int not null,
	hostel_name varchar(150) not null,
	description text,
	city varchar(100),
	area varchar(100),
	address text,
	contact_phone varchar(15),
	created_at timestamp default current_timestamp,

	foreign key(owner_id)
	references users(user_id)
	on delete cascade
);

create table rooms(
	room_id int auto_increment primary key,
    hostel_id int  not null,
    room_type enum('single','double','triple'),
    rent decimal(10,2),
    capacity int,
    available_beds int,
    
    foreign key(hostel_id)
    references hostels(hostel_id)
    on delete cascade
);
    
CREATE TABLE hostel_images(
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    image_url VARCHAR(255),

    FOREIGN KEY(hostel_id)
    REFERENCES hostels(hostel_id)
    ON DELETE CASCADE
);

CREATE TABLE reviews(
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    user_name VARCHAR(100),
    rating INT CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(hostel_id)
    REFERENCES hostels(hostel_id)
    ON DELETE CASCADE
);

show tables;

