## C19_Website
# C19  Freelancer Website

Everyone working on this Repository please follow the below rules:
<ol>
<li>Fork the repo on your github to work on it</li>
<li>Once you are dev complete, you can raise a pull request to organization repo</li>
<li>You need 2 reviewers to review your pull request before it can me merged to master branch of the Organization Repo</li>
<li>I have added gitignore for VS code. If you are using any other code editor add appropriate git ignore</li>
<li> Basic Folder Structure has been added to the project. Please follow the same for your development</li></ol>
<br>

## Folder Structure

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
    │   │   jobApplicationController.js         # Controller to handle all the job application api's function
    │   │   jobpostingController.js             # Controller to handle all the job posting api's function
    │   │   userController.js                   # Controller to handle all the user related api's function
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
            jobApplicationsRoutes.js            # Routes for Job Applications
            jobPostingRoutes.js                 # Routes for Posting jobs
            userRoutes.js                       # Routes for Users
```


## Installing
 1. Clone the repository on your local machine
 2. Once cloned cd into the folder and open the files in your favourite editor.
 3. Open a terminal in your folder and run npm i to install all the packages.
 4. Once all the packages are installed run npm start to start the api
 5. To test if your application running go to http://localhost:3000/. It should give you the count of users etc.

## MongoDB Schema

### 1. `User Schema`

|SNo. | Field | Description | Mandatory | Field Type |
| --- | --- | --- | ---- | ---- |
| 1. | firstName | First Name | Yes | String |
| 2. | lastName | Last Name | Yes | String |
| 3. | email | Email ID | Yes | String |
| 4. | password | Password(hashable password) | Yes | String |
| 5. | gender | Gender | Yes | String |
| 6. | created_date | Created Date (Default value of today's date. Do not need to pass it from the UI) | No | Date |
| 7. | dateofBirth | Date of birth of the user | Yes | String |
| 8. | skills | Holds an array of skills. Value to be given , seperated | Yes | Mixed |
| 9. | portfolioLink | Link to either a portfolio page or LinkedIN | Yes | String |
| 11. | education | Highest Degree being pursued by the user  | Yes | String |
| 12. | type | Holds the value of either user or Researcher | Yes | String | 
| 13. | loginAttempts | Counts the number of times the user has attempted a wrong login | No | Number | 
| 14. | emailAuthenticated | Checks if the user has verified their login or not | No | Number |

### 2. `Job Posting Schema`

|SNo. | Field | Description | Mandatory | Field Type |
| --- | --- | --- | ---- | ---- |
| 1. | userID | User id of the researcher who has posted the job | Yes | String |
| 2. | jobTitle | Title for the job | Yes | String |
| 3. | description | Description | Yes | String |
| 4. | weeklycommitment | Hours of weekly commitment | Yes | Number |
| 5. | skills | Skills required. Takes array value from front end seperated by "," | Yes | Mixed |
| 6. | postedDate | Posted Date (Default value of today's date. Do not need to pass it from the UI) | No | Date |

### 3. `Job Application Schema`

|SNo. | Field | Description | Mandatory | Field Type |
| --- | --- | --- | ---- | ---- |
| 1. | jobID | The id of the job applied to | Yes | String |
| 2. | userID | The id of the user who has applied for the job | Yes | String |
| 3. | currentStatus | The status of the application. Default value is "Application submitted" | Yes | String |
| 4. | appliedDate | Default to the applied date | Yes | Date |


## API Paths

### 1. `User API's`
<p>PS: The <i>userID</i> mentioned here means the auto generated id from mongoDB (_id)</p>

| API's  | Functionality  | Example    | Method | Requires token authentication
|----------------- |------------ | -------------- | -------------- |  -------------- |
| /user/ | Gets all the users in the database (Can be used for analytical purposes) | http://localhost:3000/dev/user/ | GET | No |
| /user/registration | Adds the user information to the database | http://localhost:3000/user/dev/registration/ | POST | No|
| /user/:userID | Gets the user information based on userID which will be returned in the json data after the user has successfully logged in | http://localhost:3000/dev/user/_id| GET | Yes |
| /user/delete/:userID | Deletes a user information based on user ID | http://localhost:3000/dev/user/delete/_id| DELETE | Yes |
| /user/update/:userID | Updates a user information based on user ID | http://localhost:3000/dev/user/update/_id | PUT | Yes |
| /user/login | Authenticates a user and assigns token | http://localhost:3000/dev/user/login | POST | Yes |
| /userinfo/:userID | Can be used when a user applies for an application that the researcher wants to view their profile | http://localhost:3000/dev/user/userinfo/_id | GET | No |
| /finduser/:search | Can be used to search a volunter based on First Name,Last Name and email and skills | http://localhost:3000/dev/user/finduser/Rahul | GET | No |

### <b>NOTE</b>: Data Format for Adding/Updating user:
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

| API's  | Functionality  | Example URL   | Method | Requires Token Authentication |
|----------------- |------------ | -------------- | -------------- | -------------- |
| /jobPosting/ | Gets all the job postings in the database (Can be used for analytical purposes) | http://localhost:3000/dev/jobPosting/ | GET | No |
| /jobPosting/addJob/:userID | Adds the jobs posting information to the database | http://localhost:3000/dev/jobPosting/addJob/_id | POST | Yes |
| /jobPosting/:jobID | Gets the job posting information | http://localhost:3000/dev/jobPosting/_id | GET | No |
| /jobPosting/delete/:jobID | Deletes a job posting based on jobID | http://localhost:3000/dev/jobPosting/delete/_id| DELETE | Yes |
| /jobPosting/update/:jobID/ | Updates a job Posting | http://localhost:3000/dev/jobPosting/update/_id | PUT | Yes |
| /jobPosting/searchjobs/:search | Searches for jobs based on skills or years of work exeprience | http://localhost:3000/dev/researcherinfo/searchjobs/value_to_search | GET | No |
| /jobPosting/myjobpostings/:userID | Searchees for jobs posted by a reasearcher | http://localhost:3000/dev/jobPosting/myjobpostings/_id | GET | Yes |

### 3. `Job Application API's`
<p>PS: The <i>userID</i> and <i>applicationID</i> mentioned here means the auto generated id from mongoDB (_id)</p>

| API's  | Functionality  | Example URL   | Method | Requires Token Authentication |
|----------------- |------------ | -------------- | -------------- | -------------- |
| /jobApplication/submitapplication/:userID | Adds the job application information to the database | http://localhost:3000/dev/jobApplication/submitapplication/_id | POST | Yes |
| /jobApplication/:applicationID | Gets the job application | http://localhost:3000/dev/jobApplication/_id | GET | Yes |
| /jobApplication/delete/:applicationID | Deletes a job application | http://localhost:3000/dev/jobApplication/delete/_id| DELETE | Yes |
| /jobApplication/updatestatus/:applicationID | Updates a job application's status | http://localhost:3000/dev/jobApplication/update/_id | PUT | Yes |
| /jobApplication/myapplications/:userID| Searchees for jobs posted by a reasearcher | http://localhost:3000/dev/jobApplication/myapplications/_id | GET | Yes |