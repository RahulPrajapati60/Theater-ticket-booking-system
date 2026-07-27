CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE movies (
    movie_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    language VARCHAR(20),
    duration INT,
    poster_url VARCHAR(255)
);

-- Theaters
CREATE TABLE theaters (
    theater_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50),
    address TEXT
);

--  Shows / Screenings 
CREATE TABLE shows (
    show_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    movie_id BIGINT NOT NULL,
    theater_id BIGINT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    total_seats INT NOT NULL,          
    available_seats INT NOT NULL,     
    price_per_seat DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (theater_id) REFERENCES theaters(theater_id)
);

--  Bookings table
CREATE TABLE bookings (
    booking_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    show_id BIGINT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_tickets INT NOT NULL,           
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
    booking_status ENUM('CONFIRMED', 'PENDING', 'CANCELLED') DEFAULT 'PENDING',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (show_id) REFERENCES shows(show_id)
);