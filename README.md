# cs465-fullstack
CS-465 Full Stack Development with MEAN

## Architecture

### Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA). Why did the backend use a NoSQL MongoDB database?

The architecture of the Travlr application was created using the MEAN stack to develop a client-facing front end with Express and Node.js, an administrator front end SPA using Angular, a RESTful API using Express and Node.js, and a backend using Express, Node.js, MongoDB, and Mongoose ODM.

The backend of the project used a NoSQL MongoDB database for several reasons:
- Flexibility: MongoDB's document-oriented data model allows for storing and retrieving data in a flexible and schema-less manner, which is particularly useful when dealing with complex or rapidly evolving data structures.
- Scalability: MongoDB is designed to scale horizontally across multiple servers, making it suitable for handling large amounts of data and high traffic loads.
- Performance: MongoDB's ability to store data in a denormalized fashion and its support for indexing and aggregation pipelines can lead to improved query performance, especially for read-heavy applications.
- JSON-like Data Format: MongoDB stores data in a binary JSON-like format (BSON), which aligns well with the JavaScript Object Notation (JSON) data format commonly used in web applications, facilitating seamless data exchange between the frontend and backend.

## Functionality

### How is JSON different from Javascript and how does JSON tie together the frontend and backend development pieces? 

JSON and JavaScript are not comparable. JavaScript is a scripting language, and JSON is a data format. Even though it has JavaScript in its name, JSON is language-independant. The server may send data in JSON format, which requires JavaScript to run on the client side to parse and display the information.

### Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.

Early in development, I refactored the customer-facing side of the application to implement handlebars. Handlebars allow the application to dynamically load the header and footer partials in the pages that were refactored to use handlebars. This further allowed the travel page to show data loaded from the database instead of using a JSON file or hardcoding the information directly in the HTML, creating a single dynamic HTML page. Other pages must be refactored as handlebars to convert the pages from static to dynamic. 

Reusable UI components make the code easier to maintain, test, and develop. For example, trip cards are dynamically created based on how many trips exist in the travlr database. Rather than creating several trip cards, making them a reuseable component allows the website to dynamically update based on the database without having to manually alter the source code.

There are two other tools that I used to help me that were not required in this course. I wish I implemented them sooner, but I started to use Doxygen and ESLint. Doxygen is a tool that creates documentation for a project. ESLint is a formatting and linting tool that helps developers enforce consistent rules across code for uniformity. It helped me identify certain code smells like the use of the 'any' datatype. 

## Testing

### Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.

The main tool I used for testing API endpoints is Postman. This application allowed me to manually test individual endpoints and view the results. Postman allows for automated testing, but we did not explore that in this course. 

HTTP methods such as GET, POST, PUT, and DELETE are used in the API for performing CRUD operations with the database. The POST method is also used for authenticating users. 

Testing the endpoints I created only involved testing that the applicable endpoints required authentication. Tests did not include anything else such as checking the hashing algorithms or input validation. I included my own validation outside of the requirements in the API's user model. This is only one instances of validation I added, and it only applies to new users or checking the user's email. There was no input validation anywhere else, including the password field. 

The thing I didn't particularly like about the User interface is that MongoDB has built-in roles based access. It would make more sense, in my opinion, to implement MongoDB's roles based authentication for at least for administrators. For normal users, the local strategy implementation that uses passport makes sense to introduce us to SSO. 

## Reflection

### How has this course helped you in reaching your professional goals? 

This course has helped me gain a significant understanding of how websites work. It is refreshing to tie everything together that I have been learning for the past several years. It is easier for me to identify gaps in my knowledge and to focus on improving my skills.  I wish this course taught us about the CI/CD pipeline.

### What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?

I have gained a basic understanding of how web applications work and are developed. A fullstack developer may be more prospect for some employers compared to others with a more narrow field of expertise. This depends on which employer we are talking about, though. Some employers need somebody who has significant experience in a particular stack or set of tools. However, I am far better off than somebody that has only done a coding bootcamp, especially with where the software engineering field is headed nowadays. 
