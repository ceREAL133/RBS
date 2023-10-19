# Test APP

There is already an admin user in DB.

## Endpoints

1. `/register`

-   For everyone.
-   Required data: `name`, `email` - unique, `password` - min length - 3, max - 30. Any alphanumeric character (letters from both uppercase and lowercase alphabets and digits). `bossId` parameter sets the boss for the current user.
-   Role parameter - after registration it will be automatically set to USER.
-   You can't provide ADMIN role to user using this app, only manually in db. Also you can't provide BOSS role to the user this way, it will ruin the logic of RBS, because BOSS is the user which has at least one subordinate (you can make it later)

2. `/login`

-   Only for registered user.
-   Gives you access token, automatically sets it in Request headers

3. `changeboss/:id`

-   Only for logged in BOSS or ADMIN.
-   `:id` query parameter - the id of the subordinate user we want to change boss for. `bossId` in the request body - the id of his new boss.
-   If the new BOSS is a REGULAR user, his role will be changed to BOSS.
-   If the old BOSS doesn't have subordinates now then his role will be changed to REGULAR user.
-   Boss can manipulate only with his direct child subordinates. He can't manipulate with his deep subordinates (subordinates of his subordinates), and he CAN'T make his subordinate-boss to become a subordinate of his subordinate (circular dependency).
-   ADMIN can change the boss for all users except himself (if it doesn't break the logic)

4. `/users`

-   only logged in users.
-   REGULAR user will only see the information about himself.
-   BOSS will see the info about himself and his child and deep subordinates.
-   ADMIN will see information about ALL users across the database.
