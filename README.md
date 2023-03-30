# wemart

### Introduction
wemart is a digital shopping mall (multivendor e-commerce platform), that let vendors (entrepreneurs) create there own e-commerce store. 

### wemart Features
* Private store front domain previlage.
* Vendor Store SEO.
* Real-time and manuel shipping calculations.
* vendor account balance, sales reports and statistics.
* Flexible Products approval system.
* Advanced vendor Payout system
* Vendor debt payout.
* social media platform integration.
* Mail marketing.

### Installation Guide
* Clone this repository [here] (https://github.com/FemiOluwadamilola/wemart.git).
* Create a new project branch e.g wemart-feature/newFeature.
* Run npm install to install all dependencies
* You can either work with the default mongodb atlas database or use your locally installed MongoDB. Do configure to your choice in the application entry file.
### Usage
* Run npm start:dev to start the application.
* Connect to the API using port 5000.
### API Endpoints
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |
| POST | /api/vendors/signup | To sign up a new user account |
| POST | /api/vendors/login | To login an existing user account |
| PUT | /api/vendors/store | To setup vendor store front |
| POST | /api/vendors | To upload a new product |
| GET | /api/vendors | To get vendor admin dashboard |
| GET | /api/vendors/:productId | To retrieve details of a single product |
| PATCH | /api/vendors/:productId | To edit the details of a single product |
| DELETE | /api/vendors/:productId | To delete a single product |
### Technologies Used
* [NodeJS](https://nodejs.org/) This is a cross-platform runtime environment built on Chrome's V8 JavaScript engine used in running JavaScript codes on the server. It allows for installation and managing of dependencies and communication with databases.
* [ExpressJS](https://www.expresjs.org/) This is a NodeJS web application framework.
* [MongoDB](https://www.mongodb.com/) This is a free open source NOSQL document database with scalability and flexibility. Data are stored in flexible JSON-like documents.
* [Mongoose ODM](https://mongoosejs.com/) This makes it easy to write MongoDB validation by providing a straight-forward, schema-based solution to model to application data.
### Authors
* [KlassicDev](https://github.com/FemiOluwadamilola)



