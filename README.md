## C19_Website

# C19 Freelancer Website

Everyone working on this Repository please follow the below rules:

<ol>
<li>Fork the repo on your github to work on it</li>
<li>Once you are dev complete, you can raise a pull request to organization repo</li>
<li>You need 2 reviewers to review your pull request before it can me merged to master branch of the Organization Repo</li>
<li>I have added gitignore for VS code. If you are using any other code editor add appropriate git ignore</li>
<li> Basic Folder Structure has been added to the project. Please follow the same for your development</li>
</ol>
<br>
<hr>

## <b>Folder Structure</b>

```bash
│   package.json                                # Has all the dependencies needed to run the application
│   server.js                                   # The main Server file that runs the application
│
└───src                                         # Folder having all the needed routes,controllers and middleware
    │
    ├───CONSTANTS                               # Folder to hold all the Constant files
    │       constants.js                        # File having all the constant values such as status code, responses etc.
    │
    ├───controller                              # Folder with all the controllers that run the required functions for api
    │   │   emailController.js                  # Controller to handle all the email api's
    │   │   jobApplicationController.js         # Controller to handle all the job application api's
    │   │   jobpostingController.js             # Controller to handle all the job posting api's
    │   │   passwordController.js               # Controller to handle all the password reset related api's
    │   │   userController.js                   # Controller to handle all the user related api's
    │   │
    │   └───common_controllers                  # All the controllers that are used across other controllers
    │           addUserController.js            # Controller to handle the add api call for users
    │           loginController.js              # Controller to handle login api for user
    │           postAuthenticationController.js # Controller to handle the user authentication for crud operations for users
    │
    ├───Logger                                  # Folder with the javascript file to handle the logs
    │       logger.js                           # Javascript file handling the logging of data
    │
    ├───middleware                              # Middleware folder for handling common requests between the api's
    │       authenticationMiddleware.js         # Authentication Middleware used for postAuthenticationController.js
    │       emailMiddleware.js                  # Middleware to handle all the email requests.
    │       loginMiddleware.js                  # Middleware to check if user exists and to update the login attempts count
    │       mongooseMiddleware.js               # Middleware to handle all the mongoose queries
    │
    ├───model                                   # Folder having all the mongoose models to be created in mongoDB
    │       jobApplicationModel.js              # Model for job application
    │       jobPostingModel.js                  # Model for posting jobs
    │       userModel.js                        # Model for user
    │
    └───Routes                                  # Folder with all the routes. Used in server.js file
            basicroutes.js                      # Basic routes showing hello page and the count of data for each model
            emailRoutes.js                      # Routes to handle email
            jobApplicationsRoutes.js            # Routes for Job Applications
            jobPostingRoutes.js                 # Routes for Posting jobs
            passwordRoutes.js                   # Routes for password reset and confirmation
            userRoutes.js                       # Routes for Users
```

<hr>

## <b>Steps to run the application</b>

1.  Clone your forked repository on your local machine using the following command:
    ```bash
    git clone https://github.com/your_github_name/C19_Website.git
    ```
2.  Once cloned cd into the folder and open the files in your favourite editor.
3.  Open a terminal in your folder and run the following command to install all the packages.
    ```bash
    npm i
    ```
4.  Create a .env folder in your root directory of the project and create the following folders and files in it<br>

    `PS: These steps are temporary just to test the application`

    ```bash

        ├───emailConstants            # Contains all the email constants required to set up the smtp server
        │       emailConstants.js
        │
        ├───researcher_keys           # The private and public key used to authenticate the researcher
        │       private.key
        │       public.key
        │
        └───volunteer_keys            # The private and public key used to authenticate the volunteer
                private.key
                public.key
    ```

    To create the public and private keys go to the below website and create them and place them in the private.key and public.key files shown in the above directory. Remember to select PKCS #8 (base64) from the dropdown.
    https://csfieldguide.org.nz/en/interactives/rsa-key-generator/

    `Note: The private and public keys should be different for volunteer and researcher. Do not copy the same public and private keys in the files or else it will give you errors.`

    In the email constants file create a variable as shown below:

    ```js
    const emailconstants = {
      HOST: 'smtp.googlemail.com',
      PORT: 465,
      SECURE: true,
      USER: 'YOUR_GMAIL_EMAIL_ID',
      PASSWORD: 'YOUR_GMAIL_PASSWORD',
    };

    module.exports = { emailconstants };
    ```

    Follow the steps in the below given link to setup your Gmail SMTP:

    https://artisansweb.net/sending-email-via-gmail-smtp-server-in-nodejs/

5.  Once all the packages are installed and folders created run the command below to start the api.

    ```bash
    npm start
    ```

6.  Make sure you have your mongoDB instance running in the local machine. Run the following command in your local machine<br>

    `PS: This is temporary as well`

    ```bash
    mongod
    ```

    Follow the steps in the following link to setup mongo db on your machine:
    https://treehouse.github.io/installation-guides/windows/mongo-windows.html

    To seed local database with test data, run the following in the root project folder.<br>

    ```bash
    npm run seed
    ```

7)  To test if your application running go to http://localhost:3000/. It should give you the count of users, job applications and job postings in the database.

<hr>

## <b>MongoDB Schema</b>

`Note`: Mandatory here means value that need to be passed from the Front end. There are certain values that are mandatory but need not be passed from the front end and is handled by the api itself.

### 1. `User Schema`

| SNo. | Field              | Description                                                                      | Mandatory | Field Type |
| ---- | ------------------ | -------------------------------------------------------------------------------- | --------- | ---------- |
| 1.   | firstName          | First Name                                                                       | Yes       | String     |
| 2.   | lastName           | Last Name                                                                        | Yes       | String     |
| 3.   | email              | Email ID                                                                         | Yes       | String     |
| 4.   | password           | Password(hashable password)                                                      | Yes       | String     |
| 5.   | gender             | Gender                                                                           | No        | String     |
| 6.   | created_date       | Created Date (Default value of today's date. Do not need to pass it from the UI) | No        | Date       |
| 7.   | dateofBirth        | Date of birth of the user                                                        | Yes       | String     |
| 8.   | skills             | Holds an array of skills. Value to be given , seperated                          | Yes       | Mixed      |
| 9.   | portfolioLink      | Link to either a portfolio page or LinkedIN                                      | Yes       | String     |
| 11.  | education          | Highest Degree being pursued by the user                                         | Yes       | String     |
| 12.  | type               | Holds the value of either Volunteer or Researcher                                | Yes       | String     |
| 13.  | loginAttempts      | Counts the number of times the user has attempted a wrong login                  | No        | Number     |
| 14.  | emailAuthenticated | Checks if the user has verified their login or not                               | No        | String     |
| 15.  | temporaryPassword  | A temporary password in case the user wants to reset their password              | No        | String     |

### 2. `Job Posting Schema`

| SNo. | Field            | Description                                                                     | Mandatory | Field Type |
| ---- | ---------------- | ------------------------------------------------------------------------------- | --------- | ---------- |
| 1.   | userID           | User id of the researcher who has posted the job                                | Yes       | String     |
| 2.   | jobTitle         | Title for the job                                                               | Yes       | String     |
| 3.   | description      | Description                                                                     | Yes       | String     |
| 4.   | weeklycommitment | Hours of weekly commitment                                                      | Yes       | Number     |
| 5.   | skills           | Skills required. Takes array value from front end seperated by ","              | Yes       | Mixed      |
| 6.   | postedDate       | Posted Date (Default value of today's date. Do not need to pass it from the UI) | No        | Date       |

### 3. `Job Application Schema`

| SNo. | Field         | Description                                                             | Mandatory | Field Type |
| ---- | ------------- | ----------------------------------------------------------------------- | --------- | ---------- |
| 1.   | jobID         | The id of the job applied to                                            | Yes       | String     |
| 2.   | userID        | The id of the user who has applied for the job                          | Yes       | String     |
| 3.   | currentStatus | The status of the application. Default value is "Application submitted" | Yes       | String     |
| 4.   | appliedDate   | Default to the applied date                                             | Yes       | Date       |
| 5.   | postedbyID    | The id of the user who has posted the job application                   | No        | String     |
| 6.   | jobTitle      | The job title                                                           | No        | String     |

<hr>

## <b>API Paths</b>

### 1. `User API's`

<p>PS: The <i>userID</i> mentioned here means the auto generated id from mongoDB (_id)</p>

| API's                | Functionality                                                                                                               | Example                                       | Method | Requires token authentication |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------ | ----------------------------- |
| /user/               | Gets all the users in the database (Can be used for analytical purposes)                                                    | http://localhost:3000/dev/user/               | GET    | No                            |
| /user/registration   | Adds the user information to the database                                                                                   | http://localhost:3000/user/dev/registration/  | POST   | No                            |
| /user/:userID        | Gets the user information based on userID which will be returned in the json data after the user has successfully logged in | http://localhost:3000/dev/user/_id            | GET    | Yes                           |
| /user/delete/:userID | Deletes a user information based on user ID                                                                                 | http://localhost:3000/dev/user/delete/_id     | DELETE | Yes                           |
| /user/update/:userID | Updates a user information based on user ID                                                                                 | http://localhost:3000/dev/user/update/_id     | PUT    | Yes                           |
| /user/login          | Authenticates a user and assigns token                                                                                      | http://localhost:3000/dev/user/login          | POST   | Yes                           |
| /userinfo/:userID    | Can be used when a user applies for an application that the researcher wants to view their profile                          | http://localhost:3000/dev/user/userinfo/_id   | GET    | No                            |
| /finduser/:search    | Can be used to search a volunter based on First Name,Last Name and email and skills                                         | http://localhost:3000/dev/user/finduser/Rahul | GET    | No                            |

### `NOTE:` Data Format for Adding/Updating user:

```js
{
"firstName":"FirstName",
"lastName":"LastName",
"email":"your_email",
"gender":"Gender",
"skills":"Web Development,Node JS,MongoDB,PowerBI,Tableau",
"password":"Password1!",
"education":"Masters",
"dateofBirth":"DOB",
"portfolioLink":"LinedIN/portfolio URL",
"type":"Researcher/user"
}

```

### 2. `Job Posting API's`

<p>PS: The <i>userid</i> and <i>jobID</i> mentioned here means the auto generated id from mongoDB (_id)</p>

| API's                             | Functionality                                                                                         | Example URL                                                         | Method | Requires Token Authentication |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------ | ----------------------------- |
| /jobPosting/                      | Gets all the job postings in the database (Can be used for analytical purposes)                       | http://localhost:3000/dev/jobPosting/                               | GET    | No                            |
| /jobPosting/addJob/:userID        | Adds the jobs posting information to the database and sends out an email to the user for confirmation | http://localhost:3000/dev/jobPosting/addJob/_id                     | POST   | Yes                           |
| /jobPosting/:jobID                | Gets the job posting information                                                                      | http://localhost:3000/dev/jobPosting/_id                            | GET    | No                            |
| /jobPosting/delete/:jobID         | Deletes a job posting based on jobID                                                                  | http://localhost:3000/dev/jobPosting/delete/_id                     | DELETE | Yes                           |
| /jobPosting/update/:jobID/        | Updates a job Posting                                                                                 | http://localhost:3000/dev/jobPosting/update/_id                     | PUT    | Yes                           |
| /jobPosting/searchjobs/:search    | Searches for jobs based on skills or years of work exeprience                                         | http://localhost:3000/dev/researcherinfo/searchjobs/value_to_search | GET    | No                            |
| /jobPosting/myjobpostings/:userID | Searchees for jobs posted by a reasearcher                                                            | http://localhost:3000/dev/jobPosting/myjobpostings/_id              | GET    | Yes                           |

### 3. `Job Application API's`

<p>PS: The <i>userID</i> and <i>applicationID</i> mentioned here means the auto generated id from mongoDB (_id)</p>

| API's                                       | Functionality                                        | Example URL                                                    | Method | Requires Token Authentication |
| ------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------- | ------ | ----------------------------- |
| /jobApplication/submitapplication/:userID   | Adds the job application information to the database | http://localhost:3000/dev/jobApplication/submitapplication/_id | POST   | Yes                           |
| /jobApplication/:applicationID              | Gets the job application                             | http://localhost:3000/dev/jobApplication/_id                   | GET    | Yes                           |
| /jobApplication/delete/:applicationID       | Deletes a job application                            | http://localhost:3000/dev/jobApplication/delete/_id            | DELETE | Yes                           |
| /jobApplication/updatestatus/:applicationID | Updates a job application's status                   | http://localhost:3000/dev/jobApplication/update/_id            | PUT    | Yes                           |
| /jobApplication/myapplications/:userID      | Searchees for jobs posted by a reasearcher           | http://localhost:3000/dev/jobApplication/myapplications/_id    | GET    | Yes                           |

### 4. `Email API's`

<p>PS: The <i>userID</i> and <i>applicationID</i> mentioned here means the auto generated id from mongoDB (_id)</p>

| API's                       | Functionality                                                                            | Example URL                                      | Method | Requires Token Authentication |
| --------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------ | ------ | ----------------------------- |
| /email/confirmEmail/:userID | Confirms the email id of the user. Without this the user cannot login to the application | http://localhost:3000/dev/email/confirmEmail/_id | POST   | Yes                           |

### 5. `Password Management API's`

| API's                          | Functionality                                                                                                                | Example URL                                             | Method | Requires Token Authentication |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------ | ----------------------------- |
| /password/passwordreset        | Used to provide the user with a temporary password in their email to then reset their password                               | http://localhost:3000/dev/password/passwordreset        | POST   | Yes                           |
| /password/confirmresetpassword | This will compare the temporary password with the password provided by the user and then allow them to reset their password. | http://localhost:3000/dev/password/confirmresetpassword | POST   | Yes                           |
