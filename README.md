## C19_Website
# C19  Freelancer Website<br/>  
Everyone working on this Repository please follow the below rules:
<ol>
<li>Fork the repo on your github to work on it</li>
<li>Once you are dev complete, you can raise a pull request to organization repo</li>
<li>You need 2 reviewers to review your pull request before it can me merged to master branch of the Organization Repo</li>
<li>I have added gitignore for VS code. If you are using any other code editor add appropriate git ignore</li>
<li> Basic Folder Structure has been added to the project. Please follow the same for your development</li></ol>
<br>
<!-- **Folder Structure Explained**
<ul>
<li>Route folder is used to add files that contains all the routes</li>
<li>Service folder is for files that contain the required business logic </li>
<li> DAO folder is for files those will interact with the DB </li>
<li> CONSTANTS folder will contain all the constant variables that are used across the project </li>
<li> Application properties folder will contain files that have env variables </li>
<li> Logger will contain the logger file. I am configured Log4js as of now. Let me know if you feel some other logger would be better </li> -->

## Folder Structure

```bash
│   package.json                                # Has all the dependencies needed to run the application
│   server.js                                   #The main Server file that runs the application
│                    
└───src                                         # Folder having all the needed routes,controllers and middleware
    │   
    ├───CONSTANTS                               # Folder to hold all the Constant files
    │       constants.js                        # File having all the constant values such as status code, responses etc.
    │       
    ├───controller                              # Folder having all the controllers that run the required functions for api
    │   │   jobApplicationController.js         # Controller to handle all the job application api's function
    │   │   jobpostingController.js             # Controller to handle all the job posting api's function
    │   │   researcherController.js             # Controller to handle all the researcher related api's function
    │   │   volunteerController.js              # Controller to handle all the volunteer related api's function
    │   │   
    │   └───common_controllers                  # Folder having all the controllers that are used across other controllers
    │           addUserController.js            # Controller to handle the add api call for researcher's and volunteer's
    │           loginController.js              # Controller to handle login api for both researcher and volunteer
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
    │       researcherModel.js                  # Model for Researchers
    │       volunteerModel.js                   # Model for Volunteers
    │       
    └───Routes                                  # Folder with all the routes. Used in server.js file
            basicroutes.js                      # Basic routes showing hello page and the count of data for each model
            jobApplicationsRoutes.js            # Routes for Job Applications
            jobPostingRoutes.js                 # Routes for Posting jobs
            researcherRoutes.js                 # Routes for Researchers
            volunteerRoutes.js                  # Routes for Volunteers
```


## Installing
 1. Clone the repository on your local machine
 2. Once cloned cd into the folder and open the files in your favourite editor.
 3. Open a terminal in your folder and run npm i to install all the packages.
 4. Once all the packages are installed run npm start to start the api
 5. To test if your application running go to http://localhost:3000/. It should give you the count of researcher,volunteers etc.

## MongoDB Schema

### 1. `Volunteer Schema`

|SNo. | Field | Description | Mandatory | Field Type |
| --- | --- | --- | ---- | ---- |
| 1. | vfirstName | First Name | Yes | String |
| 2. | vlastName | Last Name | Yes | String |
| 3. | vemail | Email ID | Yes | String |
| 4. | vpassword | Password(hashable password) | Yes | String |
| 5. | vphone | Phone Number | Yes | Number |
| 6. | vgender | Gender | Yes | String |
| 7. | vcreated_date | Created Date (Default value of today's date. Do not need to pass it from the UI) | No | Date |
| 8. | vage | Between 18 and 65 (Can be changed. Open for discussion) | Yes | Number |
| 9. | vskills | Holds an array of skills. Value to be given , seperated | Yes | Mixed |
| 10. | vwork_experience | Holds arrays of different values [company, position, description, from, to] | No | Mixed |
| 11. | vworks_experience_years | Years of Experience | Yes (Can be 0) | Number |
| 12. | veducation | Holds Array of different values regarding the education of a volunteer [school, major, state, city, country, from, to] | Yes | Mixed |
| 13. | type | Holds default value of Volunteer. No need to pass from the frontend | No | String | 

### 2. `Researcher Schema`

|SNo. | Field | Description | Mandatory | Field Type |
| --- | --- | --- | ---- |---- |
| 1. | rfirstName | First Name | Yes | String |
| 2. | rlastName | Last Name | Yes | String |
| 3. | remail | Email ID | Yes | String |
| 4. | rpassword | Password(hashable password) | Yes | String |
| 5. | rphone | Phone Number | Yes | Number |
| 6. | rgender | Gender | Yes | String |
| 7. | rcreated_date | Created Date (Default value of today's date. Do not need to pass it from the UI) | No | Date |
| 8. | rage | Between 18 and 65 (Can be changed. Open for discussion) | Yes | Number |
| 9. | rinstitute | Holds the value for Institutes | Yes | String |
| 10. | type | Holds default value of Researcher. No need to pass from the frontend | No | String |

### 3. `Job Posting Schema`

|SNo. | Field | Description | Mandatory | Field Type |
| --- | --- | --- | ---- | ---- |
| 1. | researcherID | Researcher id of the researcher who has posted the job | Yes | String |
| 2. | jobTitle | Title for the job | Yes | String |
| 3. | description | Description | Yes | String |
| 4. | requirements | Specific requirements for the job | Yes | String |
| 5. | skills | Skills required. Takes array value from front end seperated by "," | Yes | Mixed |
| 6. | postedDate | Posted Date (Default value of today's date. Do not need to pass it from the UI) | No | Date |
| 7. | work_experience_required | Years of experience requird for the job. Can be 0 | Yes | Number |

### 4. `Job Application Schema`

|SNo. | Field | Description | Mandatory | Field Type |
| --- | --- | --- | ---- | ---- |
| 1. | jobID | The id of the job applied to | Yes | String |
| 2. | volunteerID | The id of the volunteer who has applied for the job | Yes | String |
| 3. | currentStatus | The status of the application. Default value is "Application submitted" | Yes | String |
| 4. | appliedDate | Default to the applied date | Yes | Date |


## API Paths

### 1. `Volunteer API's`
<p>PS: The <i>volunteerID</i> mentioned here means the auto generated id from mongoDB (_id)</p>

| API's  | Functionality  | Example    | Method | Requires token authentication
|----------------- |------------ | -------------- | -------------- |  -------------- |
| /volunteer/ | Gets all the volunteers in the database (Can be used for analytical purposes) | http://localhost:3000/dev/volunteer/ | GET | No |
| /volunteer/registration | Adds the volunteer information to the database | http://localhost:3000/volunteer/dev/registration/ | POST | No|
| /volunteer/:volunteerID | Gets the volunteer information based on userID which will be returned in the json data after the user has successfully logged in | http://localhost:3000/dev/volunteer/_id| GET | Yes |
| /volunteer/delete/:volunteerID | Deletes a volunteer information based on user ID | http://localhost:3000/dev/volunteer/delete/_id| DELETE | Yes |
| /volunteer/update/:volunteerID | Updates a volunteer information based on user ID | http://localhost:3000/dev/volunteer/update/_id | PUT | Yes |
| /volunteer/login | Authenticates a volunteer and assigns token | http://localhost:3000/dev/volunteer/login | POST | Yes |
| /volunteerinfo/:volunteerID | Can be used when a volunteer applies for an application that the researcher wants to view their profile | http://localhost:3000/dev/volunteer/volunteerinfo/_id | GET | No |
| /findvolunteer/:search | Can be used to search a volunter based on First Name,Last Name and email | http://localhost:3000/dev/volunteer/findvolunteer/Rahul | GET | No |

### <b>NOTE</b>: Data Format for Adding/Updating Volunteer:
```js
{
"vfirstName":"FirstName",
"vlastName":"LastName",
"vemail":"your_email@domain.com",
"vage":26,
"vskills":"Web Development,Node JS,MongoDB",
"vwork_experience":[{"company":"Company1","position":"Position1","description":"First Company","from":"3/28/2020","to":"3/28/2020"},{"company":"Company2","position":"Position2","description":"Second Company","from":"3/28/2020","to":"3/28/2020"}],
"vpassword":"your_password",
"vworks_experience_years":3,
"veducation":[{"school":"NEU","major":"IS","state":"MA","city":"Boston","country":"USA","from":"3/28/2020","to":"3/28/2020"}]
}
```

### 2. `Researcher API's`
<p>PS: The <i>researcherID</i> mentioned here means the auto generated id from mongoDB (_id)</p>

| API's  | Functionality  | Example URL   | Method | Requires Token Authentication |
|----------------- |------------ | -------------- | -------------- | -------------- |
| /researcher/ | Gets all the researchers in the database (Can be used for analytical purposes) | http://localhost:3000/dev/researcher/ | GET | No |
| /researcher/registration | Adds the researcher information to the database | http://localhost:3000/researcher/dev/registration/ | POST | No |
| /researcher/:researcherID | Gets the researcher information based on userID which will be returned in the json data after the user has successfully logged in | http://localhost:3000/dev/researcher/_id | GET | Yes |
| /researcher/delete/:researcherID | Deletes a researcher information based on user ID | http://localhost:3000/dev/researcher/delete/_id| DELETE | Yes |
| /researcher/update/:researcherID | Updates a researcher information based on user ID | http://localhost:3000/dev/researcher/update/_id | PUT | Yes |
| /researcher/login | Authenticates a volunteer and assigns token | http://localhost:3000/dev/researcher/login | POST | Yes |
| /researcherinfo/:researcherID | Can be used when a volunteer wants to see the researcher info | http://localhost:3000/dev/researcher/researcherinfo/_id | GET | No |
| /findresearcher/:search | Can be used to search a researcher based on First Name,Last Name and email | http://localhost:3000/dev/researcher/findresearcher/Rahul | GET | No |

### 3. `Job Posting API's`
<p>PS: The <i>researcherID</i> and <i>jobID</i> mentioned here means the auto generated id from mongoDB (_id)</p>

| API's  | Functionality  | Example URL   | Method | Requires Token Authentication |
|----------------- |------------ | -------------- | -------------- | -------------- |
| /jobPosting/ | Gets all the job postings in the database (Can be used for analytical purposes) | http://localhost:3000/dev/jobPosting/ | GET | No |
| /jobPosting/addJob/:researcherID | Adds the jobs posting information to the database | http://localhost:3000/dev/jobPosting/addJob/_id | POST | Yes |
| /jobPosting/:jobID | Gets the job posting information | http://localhost:3000/dev/jobPosting/_id | GET | No |
| /jobPosting/delete/:jobID | Deletes a job posting based on jobID | http://localhost:3000/dev/jobPosting/delete/_id| DELETE | Yes |
| /jobPosting/update/:jobID/ | Updates a job Posting | http://localhost:3000/dev/jobPosting/update/_id | PUT | Yes |
| /jobPosting/searchjobs/:search/ | Searches for jobs based on skills or years of work exeprience | http://localhost:3000/dev/researcherinfo/searchjobs/value_to_search | GET | No |
| /jobPosting/myjobpostings/:researcherID| Searchees for jobs posted by a reasearcher | http://localhost:3000/dev/jobPosting/myjobpostings/_id | GET | Yes |