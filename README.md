# Setup after cloning to local device
# installation
- run *npm install* in the root directory of application
- in root directory of application, create a file *'.env'*
- copy and paste the following code to *'.env'*:

  ACCESS_TOKEN_SECRET = awdasf12weawdfsd5fgesdf7gdsfg6
  
  REFRESH_TOKEN_SECRET = serg5fghgbntdyug8hsfdse4fasdw6yh6
  
 # setup database
 - open *'database.sql'* file and follow the steps provided to create a postgresql database and tables for the application
 - once done, change the db credentials to your respective credentials to access psql in your local machine

# APIs
**Create user**
- this will create a user if provided valid credentials
- POST http://localhost:6969/api/users
- params(body): 

*'name'*(full name of user), 

*'email'*(email will be used for login), 

*"password"*(password for login), 

*'balance'*(initial balance of wallet)

- sample API in postman
![image](https://github.com/KendrickIan/take-home-assessment/assets/106476794/455d0c66-9c20-4030-8a36-e54e18d2b7dd)


**Login**
- this will generate a token for user to access some APIs
- POST http://localhost:6969/api/auth/login
- params(body): 

*"email"*

*"password"*

- sample in postman:
![image](https://github.com/KendrickIan/take-home-assessment/assets/106476794/acf6a566-1062-437a-af7c-02f55bef15f5)


**Get user details**

*REQUIRES BEARER TOKEN AUTHENTICATION FROM LOGIN*
- this will get the user's account id, wallet id, name, email, and current wallet balance 
- GET http://localhost:6969/api/transactions
- params(N/A)
- sample API in postman:
![image](https://github.com/KendrickIan/take-home-assessment/assets/106476794/09ba0b2b-d2f5-4c28-b697-665eff8e1f89)


**Cash-in**

*REQUIRES BEARER TOKEN AUTHENTICATION FROM LOGIN*
- this will handle cash-in transactions (add money to wallet)
- POST http://localhost:6969/api/transactions/cash-in?amount={enter cash-in amount here}
- params(query):

*?amount=*

- sample API in postman:
![image](https://github.com/KendrickIan/take-home-assessment/assets/106476794/8430c118-41d1-4755-a85d-88bcea24fb17)


**Debit**

*REQUIRES BEARER TOKEN AUTHENTICATION FROM LOGIN*
- this will handle debit transactions (spend money from wallet)
- POST http://localhost:6969/api/transactions/debit?amount={enter debit amount here}
- params(query):

*?amount=*

- sample API in postman:
![image](https://github.com/KendrickIan/take-home-assessment/assets/106476794/18b8d24c-0248-4b49-9d59-2256940f6744)

