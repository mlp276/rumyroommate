CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
--@block
CREATE TABLE Listings(
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    id INT,
    title VARCHAR(100) NOT NULL,
    campus VARCHAR(255) NOT NULL,
    house_address VARCHAR(255) NOT NULL,
    house_type VARCHAR(255) NOT NULL,
    num_rooms INT NOT NULL,
    num_bath INT NOT NULL,
    roommates INT NOT NULL,
    rent INT NOT NULL,
    dt_available VARCHAR(255) NOT NULL,
    bio VARCHAR(255),
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE
);
--@block
CREATE TABLE Preferences (
    preference_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    female BOOLEAN DEFAULT FALSE,
    male BOOLEAN DEFAULT FALSE,
    other BOOLEAN DEFAULT FALSE,
    smoker BOOLEAN DEFAULT FALSE,
    non_smoker BOOLEAN DEFAULT FALSE,
    clean INT,
    FOREIGN KEY (post_id) REFERENCES Listings(post_id) ON DELETE CASCADE
);

