**User Account**
- user id
- net id
- authentication token?

**Users Preferences**
- user id

preference ids as shown below
- 00 reserved for null

Categorical
- 01 actual name
- 02 major
- 03 gender
- 04 preferred campus
- 05 preferred room type
- 06 preferred roommate
- 07 race preference
- 08 religion preference
- 09 smoking preference
- 10 drinking preference
- 11 sleeping habits

Numerical
- 12 age
- 13 room budget
- 14 start sleep time
- 15 end sleep time
- 16 study start time
- 17 study end time
- 18 shared space start time
- 19 shared space end time
- 20 preferred temperature
- 21 preferred guest frequency

Numerical (1-10)
- 22 number of roommates
- 23 number of rooms
- 24 cleanliness scale
- 25 noise tolerance scale

**Created Roommate Listings**
- user id
- post id
- array of preferences ids

**Saved Roommates Listings**
- user id
- post id

**Matching Notifications**
- notification id
- user id
- post id