--@block
CREATE TABLE Listings(
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    bio VARCHAR(255),
    num_rooms INT NOT NULL
    created TIMESTAMP NOT NULL DEFAULT NOW()
);
--@block
SELECT * FROM Users
--@block
INSERT INTO Listings(title, bio, num_rooms)
VALUES(
    'Testing',
    'HI!',
    '2'
);
--@block 
SELECT * FROM Listings;
