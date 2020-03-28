## C19_Website
# C19  Freelancer Website<br/>  
Everyone working on this Repository please follow the below rules:
<ol>
<li>Fork the repo on your github to work on it</li>
<li>Once you are dev complete, you can raise a pull request to organization repo</li>
<li>You need 2 reviewers to review your pull request before it can me merged to master branch of the Organization Repo</li>
<li>I have added gitignore for VS code. If you are using any other code editor add appropriate git ignore</li>
<li> Basic Folder Structure has been added to the project. Please follow the same for your development</li>
<br>
**Folder Structure Explained**
<ul>
<li>Route folder is used to add files that contains all the routes</li>
<li>Service folder is for files that contain the required business logic </li>
<li> DAO folder is for files those will interact with the DB </li>
<li> CONSTANTS folder will contain all the constant variables that are used across the project </li>
<li> Application properties folder will contain files that have env variables </li>
<li> Logger will contain the logger file. I am configured Log4js as of now. Let me know if you feel some other logger would be better </li>
 
<ul>

</ol>


### Installing
 1. Clone the repository on your local machine
 2. Once cloned cd into the folder and open the files in your favourite editor.
 3. Open a terminal in your folder and run npm i to install all the packages.
 4. Once all the packages are installed run npm start to start the api

### API Paths

| API's                        | Functionality                                           |
| ---------------------------- |-------------------------------------------------------- | 
| /volunteer                   | Adds the volunteer information to the database          |
| /volunteer/:volunteerID      | Gets, Updates and Deletes the volunter data based on id |
| /volunteer/login             | Authenticates a volunteer and assigns token             |