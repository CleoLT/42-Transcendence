_<p align=center> This project has been created as part of the 42 curriculum by @cle-tron, @esellier, @crmanzan, @mgimon-c and @martalop. </p>_

### <p align=center> **ft_transcendence**</p>
 
# <p align=center> :cherry_blossom: Blossom Clash :cherry_blossom: </p>

## 1. Description
> section that clearly presents the project, including its goal and a brief overview.

> should also contain a clear name for the project and its key features.

_**ft_transcendence**_ is a group project with the goal of building a real-world web application that demonstrates our ability to adapt to new technologies, collaborate effectively as a team, and deliver a functional and secure final product.

There is a lot of freedom in what this final product can look like: it can be a multiplayer game, a collaborative platform, or a social network, depending on the modules you choose. \
There is a **mandatory** part that demands basic web functionality and security, and then we also have to comply with: 

 #### *the modules*

They are requirements for the project that focus on very specific topics and features classified as **MAJOR** (2p) or **MINOR**(1p).\
The complexity and length of the module influences whether it is considered a MAJOR (more difficult and long) or MINOR (easier to implement) one.

> [!IMPORTANT] 
> The minimum points you need to evaluate and pass the project is 14!

Anything over 14 points is considered part of the **bonus**.

<br>

## 2. Instructions
> section containing any relevant information about compilation, installation, and/or execution.

> should mention all the needed prerequisites (software, tools, versions, configuration like .env setup, etc.), and step-by-step instructions to run the project.

To run the project, you should follow these steps:  
1. **Make sure you have Docker and Git installed on your machine** :package:
   
2. **Clone the repository:** 

   `git clone [repository-url]`  

3. ~~Set up environment variables: Copy `.env.example` to `.env` and fill in the required values.~~ (to be specified)

4. **Build and run the project:**

   Execute `make` , `make dev` or `make prod` in the cloned folder.
   
   We have 2 creation modes:
   	- for development -> hot reload on front + back, vite server on 5173 :hammer_and_pick:
    - for production -> recompilation is necessary to see changes, no node, nginx server on 8080 :shield: (*default*) 

	See `make help` to get more information about each `make` command

5. **Open your browser and navigate to** `https://localhost:8080` (*prod*) **or**  `https://localhost:5173` (*dev*)

<br>

## 3. Resources
> section listing classic references related to the topic (documentation, articles, tutorials, etc.), as well as a description of how AI was used — specifying for which tasks and which parts of the project.

This is a list with all the resources we used classified by topics. It contains a mix of websites, tutorials and videos that helped us understand how we should approach the project and helped us learn new tools.\
At the end of the section, you can find out more about how we approached the use of AI.

#### Docker
- https://docs.docker.com/reference/compose-file/services/
- https://docs.docker.com/build/building/multi-stage/
- https://www.datacamp.com/es/tutorial/nginx-docker
- https://www.docker.com/blog/understanding-the-docker-user-instruction/
- https://blog.devops.dev/understanding-how-uid-and-gid-work-in-docker-containers-9e043f6405c1
- https://mariadb.com/docs/server/server-management/automated-mariadb-deployment-and-administration/docker-and-mariadb/using-healthcheck-sh
###### Youtube video: [Multi-stage Dockerfiles](https://www.youtube.com/watch?v=t779DVjCKCs)

#### APIs
- https://strapi.io/blog/how-to-store-API-keys-securely
- https://medium.com/%40maheshsaini.sec/what-does-api-gateway-do-in-microservices-architecture-d1e93e27e040
###### Youtube videos: [API security](https://www.youtube.com/watch?v=FsB_nRGdeLs&list=PL-iwwQA26tlFecnT2HMip8gigYBWz9Q1X&index=71)  |   [What is an API](https://www.youtube.com/watch?v=rMPLHPnltmM&list=PL-iwwQA26tlFecnT2HMip8gigYBWz9Q1X&index=66) |  [API types](https://www.youtube.com/watch?v=4vLxWqE94l4&list=PL-iwwQA26tlFecnT2HMip8gigYBWz9Q1X&index=60) | [API authentication](https://www.youtube.com/watch?v=xJA8tP74KD0) | [API gateway](https://www.youtube.com/watch?v=7-6F3b14baA)

#### Node & npm
- https://www.npmjs.com/package/nodemon
###### Youtube video: [Node beguinner guide](https://www.youtube.com/watch?v=ENrzD9HAZK4&list=PL-iwwQA26tlFecnT2HMip8gigYBWz9Q1X&index=69) | [Nodemon setup](https://www.youtube.com/watch?v=kV6MJ9W4whM&t=53s)

#### Web
###### Youtube videos: [Web design fundamentals](https://www.youtube.com/watch?v=qyomWr_C_jA&list=PL-iwwQA26tlFecnT2HMip8gigYBWz9Q1X&index=54) |  [Request and response full cycle](https://www.youtube.com/watch?v=xv0Be4QfkH0)

#### SPAs
###### Youtube videos: [Dynamic Websites vs Static Pages vs Single Page Apps](https://www.youtube.com/watch?v=Kg0Q_YaQ3Gk&list=PL-iwwQA26tlFecnT2HMip8gigYBWz9Q1X&index=63) |  [Multi-page vs single page](https://www.youtube.com/watch?v=me5lS00Nj1k&list=PL-iwwQA26tlFecnT2HMip8gigYBWz9Q1X&index=61)

#### React
###### Youtube video: [React beguinner tutorial](https://www.youtube.com/watch?v=SqcY0GlETPk&t=163s)
### AI Use
We used AI as a tool for **research**, specially in the begginner stages of the project. 

Even with the extensive list you can see above, when it comes to understanding new tools, new concepts and how they play a part in the context of this project, sometimes a conversation with AI can be more fruitful and insighful towards getting started and taking the first steps to build the website than reading articles and tutorials.\
We believe the combination of the two resources makes for the best material.

In addition, AI has been very useful in **troubleshooting** issues during production that we had never seen before, and that we could not find aswers to on the web.

We predominantly used Chatgpt and VS Code's Copilot.

Despite being great tools, we did not rely on them completely. We used our critical thinking, executed tests and we always made sure to contrast any input given by AI with other teamates and 42 colleagues. In doing so, we were able to make the most informed, efficient and tailored decisions for the project.
  
<br>

## 4. The dream team :handshake:
Our team consists of five members: Cléo Le Tron, Emilie Sellier, Manu Gimon, Cristina Manzanares and Marta López.\
All of us are *developers* and, on top of that, three of us have other roles as well:

####  :tulip: Emilie  | *Product Owner*

As PO, she made sure that the game has the necessary elements so that the users get the best experience. She decided which features made sense and she solved doubts about subject requirements and evaluations.
She kept track of the overall tasks and the team members assigned to them.

As a developer, she was in charge of the whole front-end and web design and she saw the potential for a new module using Figma for this project. Along with Cristina, who worked on the game on the front, they were in charge of the overall user and game experience.\
She also kept in touch with the back-end developers to make sure the connection between back and front worked seamlessly.
  
#### :seedling: Marta  |  *Project Manager*

As PM, she made sure the team had clear objectives and went over possible issues and how to approach them. She was in charge of scheduling the weekly meetings where she established an individual task debrief so that every team member could track their progress and show any new developments with the rest of the team.\
She was vocal and active on the Whatsapp group, where she gave updates and meeting reminders.\
She also dedicated time to project documentation, like the redaction of this Readme.

In terms of the project, she was in charge of creating the docker arquitecture and making sure everyone had a ready-to-use container.\
She worked closely with the technical lead and the backend team to make the best informed and consensual decisions regarding the sructure and design of the project.

#### :palm_tree: Manu |  *Technical Lead*

As TL, he was in charge of dciding which languages and technologies we used, as well as giving insight on how the architecture should be. He also made sure the code quality was high and consistent throughout the whole project.\
He established a pull authorization method in github and reviewed all the pull and merge requests before they were applied to the main branch.

As a developer, he worked on the whole authentication system in the backend. He also made sure that the web was secure and protected against possible attacks.

#### :potted_plant: Cléo |  *Developer (back)*

He was the first member to start working on the project. He had knowldege and a keen interest on APIs, so he worked on the user database and requests related to it. He also worked on the API Gateway container, making sure the redirection of requests went to the proper microservice.

He also had more knowledge on Github and its issues, projects and backlog, so he introduced the team to some great practices that were applied throughout the process and made a big difference.

#### :blossom: Cristina |  *Game developer (front)*

As a computer games enthusiast herself, she was the person who came up with the idea for the game, and later created it in the frontend. The game is completely original, she put together an aesthetic for it and a game experience with different settings, functionalities, components and customization options.

She worked closely with Emilie in the frontend to make sure they were on the same page and everything went according to plan.

<br>

## 5. Project Management
> How the team organized the work (task distribution, meetings, etc.).

> Tools used for project management (GitHub Issues, Trello, etc.).

> Communication channels used (Discord, Slack, etc.).


Deciding how we were going to divide tasks and the work was difficult because we all had more or less the same level of knowledge.\
All of us except Cristina(our game developer), who had animation notions, came from different areas of studies and had started 42 at aproximately the same time. Some of us had done *webserver* and *irc*, but no one had a deep understanding of how the web works. This made the task distribution harder beacuse we had to take more time to do research and we did not know how much workload each task really implied.

In the end we decided to divide it like so:

- Frontend design and implementation --- Emilie
- System design and Docker management --- Marta
- Backend user logic, including database structure --- Cléo
- Game creation with AI oponent and customization --- Cristina
- Authorization logic and overall security --- Manu

We assigned the biggest tasks of each module and the basic mandatory rules to each member in GitHub's Backlog. We referenced the issues displayed there in our commits.\
We created a Whatsapp group to communicate with each other and we set up weekly meetings to keep track of our progress and updates.






<br>

## 6. Technical Stack
> Frontend technologies and frameworks used.

> Backend technologies and frameworks used.
Backend built with Fastify, with Swagger UI for API route documentation.

> Database system and why it was chosen.
We used MariaDB as our relational database.

> Any other significant technologies or libraries.

> Justification for major technical choices.

<br>

## 7. Database Schema
![Database](assets/database.png)

> Visual representation or description of the database structure

> Tables/collections and their relationships

> Key fields and data types
<br>

## 8. Features List
> Complete list of implemented features

> Which team member(s) worked on each feature

> Brief description of each feature’s functionality
<br>

## 9. Modules

###  MAJOR | Use a framework for both the frontend and backend (2p)
We felt that chosing frameworks would help a lot in the frontend and the backend taking into account the architecture of microservices that we wanted to buildand the use of frameworks is strictly necessary in a company environment, so even though they were new to most of us, we felt that it was a good investment.
##### Implementation
For the frontend we chose **React** & for the backend **Fastify**.\
Emilie designed the frontend having the React components in mind while Cristina worked on the game in the front in pure Javascript.\
In the backend, Manu and Cléo both learned how to use Fastify to create and manage the API routes.

<br>

###  MAJOR | A public API to interact with the database (2p)
It has to have a secured API key, ratelimiting, documentation, and at least 5 endpoints.

Because creating an API was already a necessity, we thought that making it public, well documented and secure would be a plus that would help reinforce the structure we had planned.
##### Implementation
We used Swagger to see and test that the endpoints worked correctly. Cléo worked on the user-service endpoints and Manu on the auth-service ones.

<br>

###  MAJOR | Implement a complete web-based game (2p)
Because we originally started the project with the old subject, we were already going to do a game, the Pong. Eventhough we eventually decided to adhere to the new subject, therefore having the freedom to do other types of websites, we liked the idea of a game, and the opportunity to make something more interesting and modern. Cristina, our game developer, had a lot of inspiration and motivattion to go for a complex and fun game, so we went for it.

##### Implementation
(To be completed by @Bgoost)

<br>

###  MAJOR | Introduce an AI Opponent for games (2p)
Cristina was not only interested in the game logic, but also in the use of an AI tool to train to act as an oponent to the real player. Nowadays AI is going through a huge rise and many companies and users are interested in the topic, so we decided to add it to the game.

##### Implementation
(To be completed by @Bgoost)

<br>

### MINOR | Game customization options (1p)
The setup of the game allowed for a lot of customization options that Cristina was able to easily integrate in the game.

##### Implementation
(To be completed by @Bgoost)

<br>

###  MAJOR | Standard user management and authentication (2p)
This is a basic requierement for any type of website that offers a service. In our case, because we supply an online game, we wanted to make sure that the user can save his games, customize his settings and profile. This can only happen with a user account system.

##### Implementation
We made an 'guest' option, as well as a 'log in' or 'register' option when you enter the game. From there there is a form that protected from the front and back that stores the user data so that any stats and user information can live in the our database volumes and be retrieved anytime the user logs in.\
Cléo made sure this works perfectly.

<br>

###  MAJOR | Backend as microservices (2p)
Nowadays microservices are the obvious choice for most big companies or websites with a lot of traffic. Not only is it a great security advantatge to have different services running in different containers, but in terms of CI/CD, having every service in a different container allows developers to work on features in an isolated environment and helps them integrate them into the whole program.\
Moreover, if any of the services ever crashes, it only affects a part of the website, while the rest can continue working. 

##### Implementation
Marta was in charge of creating the set of containers and their correct communication. 

Using Docker and Docker-compose we set up two containers for the front and four in the back.\
We decided to have an API Gateway with its own container to further tighten security and protect the containers from the front. The Nginx container then only acts as a server of static files and handles the https connection.\
We distinguish 3 microservices:
- user-service (with its own separate db container)
- authentication-service
- game_history-service (with its own separate db container)
  
<br>

### MINOR | Implement a complete 2FA system (1p)
Security is a very important aspect of any website. We knew we wanted to choose either the OAuth module or the Two-Factor Authentication and finally chose the latest.

##### Implementation
(To be completed by @mgimon)

<br>

### MINOR | Custom-made design system with reusable components (1p)
Given that we chose the frontend framework module, and Emilie learned how React components work, we thought that designing reusable 10 components was something within our capabilities.

##### Implementation
(To be completed by @EmilieInData)

<br>

### MINOR | A complete notification system for all creation, update, and deletion actions (1p)
(to be completed)

<br>

### :green_book: Total point count - 16 points
With these modules we have the 14 mandatory points and one extra, just in case we fail one of them during evaluation.

<br>

### BONUS modules / yet to decide

####  MINOR | Health check and status page system with automated backups and disaster recovery procedures (1p) - MARTA
####  MINOR | User activity analytics and insights dashboard (1p) - EMILIE + CLÉO
####  MINOR | Support for additional browsers (1p) - EMILIE

<br>

> List of all chosen modules (Major and Minor)

> Point calculation (Major = 2pts, Minor = 1pt)

> Justification for each module choice, especially for custom "Modules of
choice"

> How each module was implemented

> Which team member(s) worked on each module
<br>


## 10. Individual Contributions
> Detailed breakdown of what each team member contributed

> Specific features, modules, or components implemented by each person

> Any challenges faced and how they were overcome

<br>
Cleo
I started implementing the backend using Fastify, organizing the project with a clean and modular architecture by separating routes, schemas, handlers, and database queries into different files. I set up global error handling with custom responses and used schemas both for validation and as a security layer to control request and response formats.

I seeded the database with realistic test data using Faker.js and implemented avatar uploads with Fastify Multipart. I also integrated Swagger UI to document and manually test all API routes.

The main challenge was the integration with the frontend, which required constant adjustments to endpoints, handlers, and error management. Through iterative testing and debugging, I was able to stabilize the communication between both sides and ensure reliable API behavior.

<br>

## 11. The game (EXTRA)
### **How to Play**
Each player controls a brush-like character in a shared falling zone with three lanes:

Left   |   Middle   |   Right

Your goal is to catch falling blossoms while denying them to your opponent.

##### **Basic Controls**

* Move left/right to switch lanes
* Push to shove the opponent sideways
* Activate Perfect Meter abilities when available

You cannot pass through the opponent — lane blocking and physical contact are core to the gameplay.

### **Game Rules**

#### ***Match Format***

* Total match time: 1 minute
* Divided into two 30-second rounds (you either win 2-0 or tie 1-1, might change that)
* No buffs or disadvantages between rounds
* Highest total score after both rounds wins

##### Blossoms
Blossoms fall continuously across the 3 lanes.

:cherry_blossom: Normal Blossom

* Worth 1 point

:cherry_blossom: Middle Lane Blossom
* Worth 2 points
* Middle lane is the high-value battlefield

:blossom: Golden Blossom

* Very rare (only 4 per game)
* Worth 3 points
* Perfect catch bonus: +2 to +3 Perfect Meter points

Golden Blossoms create intense scramble moments.

##### Catching \& Perfects
###### Normal Catch
You touch the blossom anywhere in your character’s catch zone → you get its points.

###### Perfect Catch
You catch the blossom at its exact center timing point → You gain +1 point in the Perfect Meter.\
Perfect catches are vital for activating abilities.

##### Lanes \& Lane Control
There are 3 lanes you can move between:

Left  |  Middle  |  Right

###### Claiming a Lane
Catch 5 blossoms in a row in the same lane to claim it.

When you own a lane:
* Bonus perfects
  
  Perfect catches in that lane grant +1 extra Perfect Meter point\
  (normal perfect = +1, in your lane = +2)

* Contact advantage

  If both players push at the same time in your owned lane, you win the push and the opponent gets knocked back.\
  Lane control creates territorial strategy without overpowering the game.


##### Perfect Meter
The Perfect Meter fills when you catch blossoms perfectly:

* Normal perfect: +1
* Perfect in a lane you own: +2
* Golden perfect: +2 to +3

You can activate special abilities depending on how full your meter is. \
The meter empties to 0 after using an ability.

###### Perfect Meter Abilities

**At 5 Perfects → Reverse Push OR Reverse input**

Your opponent’s push turns into a pull for ~1 second OR inputs are reversed, left becomes right and right becomes left.\
Great for lane steals, repositioning and confusing the opponent.

**At 10 Perfects → Ink Freeze**
Opponent is unable to move or push for ~0.4 seconds (maybe more).\
Use it to secure key blossoms or shove them out.

**At 15 Perfects → Momentum Surge**

Your pushing force is doubled for ~1–2 seconds. This lets you dominate contested lanes, especially the middle.

##### Contact Mechanics

###### Pushing
You may push the opponent sideways to:

* Block them from lanes
* Knock them off a blossom path
* Contest Middle or Golden blossoms

###### Simultaneous Push Logic
If both players push at the same time:

* If one owns the lane → they win the push
* If neither owns the lane → no one is pushed
* Middle lane is neutral (unless a player owns it)

This preserves fairness while rewarding lane control.

##### Dynamic Field Event (Might delete)
Only one environmental event exists:

###### Wind Gust
1–2 times per round, blossoms briefly drift one lane left or right.\
This affects both players equally and forces quick lane decisions.

##### Scoring Summary
Blossom Type					| Points

------------------------------------------------|-----------

Normal Blossom					|   1

Middle Lane Blossom				|   2

Golden Blossom					|   3

Perfect Catch Bonus				| +1 PM

Lane Perfect Bonus				| +1 PM

Golden Perfect Bonus				| +2–3 PM

PM = Perfect Meter

##### Winning
After two rounds of 30 seconds, total scores are compared.\
The player with the highest score wins Blossom Clash.
<br>

## 12. Notes (EXTRA)
> A space to keep track of the things we have learned along the process. 

### Marta's notes
- en la api gateway, no puedo dar direcciones a una misma ruta, prq sino me da un error. se ve asi en los docker logs: 

	/app/node_modules/find-my-way/index.js:291
      throw new Error(`Method '${method}' already declared for route '${pattern}' with constraints '${JSON.stringify(constraints)}'`)
            ^


  Error: Method 'POST' already declared for route '/api/auth/login' with constraints '{}'\
    at Router._on (/app/node_modules/find-my-way/index.js:291:13)\
    at Router.on (/app/node_modules/find-my-way/index.js:139:10)\
    at Object.addNewRoute (/app/node_modules/fastify/lib/route.js:364:16)\
    at Object.route (/app/node_modules/fastify/lib/route.js:255:23)\
    at Object._route [as route] (/app/node_modules/fastify/fastify.js:286:27)\
    at fastifyHttpProxy (/app/node_modules/@fastify/http-proxy/index.js:255:11)\
    at Plugin.exec (/app/node_modules/avvio/lib/plugin.js:125:28)\
    at Boot._loadPlugin (/app/node_modules/avvio/boot.js:432:10)\
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)\


- cuando en la configuracion de la api-gateway, en el index.js ponemos:

      app.listen({ port: 3000, host: "0.0.0.0" });
    Estamos binding el puerto 3000 para que todos los contenedores de la red de docker puedan acceder a ese puerto. 
    Si pusieramos en host: localhost o 127.0.0.1, solo escuchariamos requests al puerto 3000 que vieneran del mismo contenedor de api-gateway. 
    Nginx-front es un contenedor remoto, pertenece a la docker network su IP no pertenece al contenedor de la api-gateway.
    Si quisieramos decir que solo a nginx-front en especifico le escuchamos en el puerto 3000, podriamos poner firewall rules: iptables rules inside container, o verificar headers como 'X-Forwarded-For' o TLS mutua. Chatgpt no lo recomienda. Dice que en mundo real:
    - services bind to 0.0.0.0
    - access is restricted by:
            > VPCs
            > security groups
            > firewalls
            > reverse proxies
<br>

> Any other useful or relevant information is welcome (usage documentation, known limitations, license, credits, etc.).
