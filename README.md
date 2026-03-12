_<p align=center> This project has been created as part of the 42 curriculum by @cle-tron, @esellier, @crmanzan, @mgimon-c and @martalop. </p>_

### <p align=center> **ft_transcendence**</p>
 
# <p align=center> :cherry_blossom: Blossom Clash :cherry_blossom: </p>

## 1. Description

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

## 2. Demo
![Play!](readme_assets/Game_settings.png)
![3...2...1...GO!](readme_assets/Games_infos.png)
![The Blossom Clash](readme_assets/Game_fish.png)
![Profile](readme_assets/Profile_00.png)
![Friends](readme_assets/Friends.png)
![Contacts](readme_assets/Contacts.png)
![Exit](readme_assets/Exit.png)


<br>

## 3. Instructions

To run the project, follow these steps:  
1. **Make sure you have Docker and Git installed on your machine** :package:
   
2. **Clone the repository:** 

   `git clone [repository-url] [name-of-the-directory]`  

3. Set up environment variables:

   - Use `.env.example` to create a `.env` and fill in the required values.
     
   - Copy and fill as well the files in the `secrets.template` folder to create the `secrets` folder.
   

5. **Build and run the project:**

   Execute `make` , `make dev` or `make prod` in the cloned folder.
   
   We have 2 creation modes:
   	- for development -> hot reload on front + back, vite server on 5173 :hammer_and_pick:
    - for production -> recompilation is necessary to see changes, nginx server on 8080 :shield: (*default*) 

	See `make help` to get more information about each `make` command

6. **Open your browser and navigate to** `https://localhost:8080` (*prod*) **or**  `https://localhost:5173` (*dev*)

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

As Technical Lead, he was in charge of deciding which languages and technologies we used, as well as giving insight on how the architecture should be. He also made sure the code quality was high and consistent throughout the whole project.\
He established a pull authorization method in github and reviewed all the pull and merge requests before they were applied to the main branch.

As a developer, he implemented the authentication microservice and the user management system using session-based user authentication. Through the user request flow, he made sure the endpoints were available so the front end could remain consistent. He also implemented an API key to ensure that only requests from the API microservice could reach the data access service.

#### :potted_plant: Cléo |  *Developer (back)*

He was the first member to start working on the project. He had knowldege and a keen interest on APIs, so he worked on the user database and requests related to it. He also worked on the API Gateway container, making sure the redirection of requests went to the proper microservice.

He also had more knowledge on Github and its issues, projects and backlog, so he introduced the team to some great practices that were applied throughout the process and made a big difference.

#### :blossom: Cristina |  *Game developer (front)*

As a computer games enthusiast herself, she was the person who came up with the idea for the game, and later created it in the frontend. The game is based on a mode of the videogame "osu" but she put together an aesthetic for it and a game experience with different settings, functionalities, components and customization options.

She worked closely with Emilie in the frontend to make sure they were on the same page and everything went according to plan.

<br>

## 5. Project Management

Deciding how we were going to divide tasks and the work was difficult because we all had more or less the same level of knowledge.\
All of us except Cristina (our game developer), who had animation notions, came from different areas of studies and had started 42 at aproximately the same time. Some of us had done *webserver* and *irc*, but no one had a deep understanding of how the web works. This made the task distribution harder beacuse we had to take more time to do research and we did not know how much workload each task really implied.

In the end we decided to divide it like so:

- Frontend design and implementation --- Emilie
- System design and Docker management --- Marta
- Backend user logic, including database structure & API --- Cléo
- Game creation with AI oponent and customization --- Cristina
- Authentication, sessions and user management system --- Manu

We assigned the biggest tasks of each module and the basic mandatory rules to each member in GitHub's Backlog. We referenced the Github Issues displayed there in our commits.\
As time went by and the project evolved, we realized how much work the frontend really demanded and how time consuming it was, so, when Cleo finished his part of the backend, he took on the friendship page in the frontend, as well as the Privacy Policy and Terms of Service Page. \
Similarly, when Manu was working on the 2FA, he handled teh rate limiting and part of the api key management.

We all collaborated and helped each other, prioritizing the mandatory elements of the subject and making sure we followed our module's requirements. 

We created a Whatsapp group to communicate with each other and we set up weekly meetings to keep track of our progress and updates. \
In the meetings, everyone went over what they had accomplished so far, explained any new behaviours of the program, and set individual goals for the following week.

In terms of our Git workflow, we decided to work on individual branches from the main branch and to establish mandatory pull requests whenever we wanted to merge with main. The request had to be review by one of the members of the team, ususally Manu, our *technical lead*. \
Before doing any pull request though, we always had the golden rule of doing a pull from main, to update our branch with any new updates and avoid conflicts during the merge. If there were conflicts, resolve them locally and then do the pull request.
This startegy worked pretty well for us.


<br>

## 6. Technical Stack

### Frontend
- **React 18** with functional components and hooks
- **Vite** as build tool, chosen for exceptional speed and native ES module support
- **Tailwind CSS** for utility-first styling, enabling rapid, consistent UI development
- **SweetAlert2** for polished user notifications and confirmations

### Backend
- **Fastify** as core framework, selected for high performance, low overhead, and built-in schema validation
- **Swagger UI** for automatic API documentation and interactive endpoint testing
- **JWT** for stateless authentication across microservices
- **bcryptjs** for secure password hashing
- **Nodemailer** for 2FA email delivery
- **@fastify/multipart** for file uploads with validation
- **@fastify/cookie** for secure session management
- **@fastify/cors** for cross-origin configuration
- **@fastify/rate-limit** for API protection
- **@fastify/http-proxy** for microservice routing

### Database
- **MariaDB** chosen for:
  - Full MySQL compatibility with enhanced performance
  - Mature Node.js ecosystem integration
  - Strong community support and production reliability

### Additional Technologies
- **Docker** for containerization and service orchestration
- **Nginx** as reverse proxy and static asset server
- **OpenSSL** for SSL/TLS certificate management
- **Swagger** for comprehensive API documentation
- **Nodemon** for hot-reloading during development

### Justification for Key Technical Choices

\- **Microservices Architecture**: Three distinct services (API Gateway, Auth, User) provide separation of concerns, independent scalability, and fault isolation.

\- **Fastify over Express**: Superior performance benchmarks, built-in validation, and modular plugin architecture makes it ideal for Microservices Architecture. Also, Schemas allowed us to implement the Swagger documentation system.

\- **React with Vite**: Near-instant hot module replacement during frontend development and optimized production builds.

\- **Nodemon**: Near-instant hot reloading during backend development and optimized production builds.

\- **Two-Factor Authentication**: Critical security enhancement requiring both password and email verification.

\- **Docker Containerization**: Ensures environment consistency, simplifies deployment, and enables horizontal scaling.

\- **JWT Authentication**: Stateless tokens eliminate server-side storage, enabling horizontal scaling and microservice compatibility.

\- **MariaDB over NoSQL**: Structured relational data made SQL the right choice.

\- **Tailwind CSS**: Utility-first approach accelerates development, enforces design consistency, and produces minimal production CSS.


<br>

### Database system

#### Schema
![Database](readme_assets/database.png)
We have decided to create two tables: one for the user's personal information and another for all friendships.
The friendship table is related to the user table through two foreign keys referencing the user ID.
When a user is deleted from the user table, all friendships associated with that user ID are automatically deleted as well (via cascading delete).

<br>


## 7. Modules

###  MAJOR | Use a framework for both the frontend and backend (2p)
We felt that chosing frameworks would help a lot in the frontend and the backend taking into account the architecture of microservices that we wanted to buildand the use of frameworks is strictly necessary in a company environment, so even though they were new to most of us, we felt that it was a good investment.

##### Implementation
For the frontend we chose **React** & for the backend **Fastify**.\
**Emilie** designed the frontend having the React components in mind while **Cristina** worked on the game in the front in pure Javascript. She choose React because is the most widely used frontend library in the professional environment and there is many of informations & website with components and specific features, quite easy to use and very reusable system\
In the backend, Manu and Cléo both learned how to use Fastify to create and manage the API routes.

<br>

###  MAJOR | A public API to interact with the database (2p)
It has to have a secured API key, ratelimiting, documentation, and at least 5 endpoints.

- Secured with API key authentication for all external requests
- Rate limiting to prevent abuse
- Comprehensive Swagger documentation at `/docs` endpoints
- **20+ RESTful endpoints** covering user management and friendships

Because creating an API was already a necessity, we thought that making it public, well documented and secure would be a plus that would help reinforce the structure we had planned.

##### Implementation
- **Cléo** developed the user-service endpoints with database integration
- **Manu** implemented the auth-service endpoints for authentication flows


<br>

###  MAJOR | Implement a complete web-based game (2p)
Although the project was initially aligned with the previous subject and based on a classic Pong implementation, we decided to fully embrace the new subject requirements and redesign the concept. Rather than pivoting toward a traditional website, we opted to develop a complete browser-based game with richer mechanics and a more modern architecture.

##### Implementation
- Developed a modular game loop using `requestAnimationFrame` for smooth real-time updates.
- Created a collision detection system with bounding boxes to handle interactions between players, abilities, and environmental objects.
- Implemented a lane system to manage player positioning and restrict movement to predefined paths.
- Built ability and Perfect Meter mechanics, allowing dynamic power usage and temporary bonuses.
- Structured the codebase into separate modules for rendering, input management, and game logic to improve maintainability and scalability.

<br>

###  MAJOR | Introduce an AI Opponent for games (2p)
Cristina was not only interested in the game logic, but also in the use of an AI tool to train to act as an oponent to the real player. Beyond implementing core gameplay mechanics, we extended the system to support an AI-controlled opponent capable of reacting dynamically to game events.

##### Implementation
- Developed a decision-making loop for the AI that runs alongside the main game loop.
- Integrated movement prediction, allowing the AI to anticipate player position and adjust lane choice.
- Implemented ability usage logic based on game state, meter level, and cooldowns.
- Added adaptive behavior, so the AI reacts to the player’s current actions and environmental effects (like wind).
- Leveraged the same input management system used for human players to ensure parity between AI and real players.

<br>

### MINOR | Game customization options (1p)
The architecture of the game was designed with configurability in mind. Several gameplay and visual parameters can be modified without altering core logic.

##### Implementation
- Created a theme system allowing users to switch between visual styles at runtime.
- Exposed gameplay parameters such as the number of rounds, the time of the rounds, and ability effects for easier tuning.
- Linked customization options to state management, ensuring all components reflect changes immediately without requiring a reload.
- Designed a UI panel to manage settings interactively and update the game in real time.

<br>

###  MAJOR | Standard user management and authentication (2p)
We implemented a complete user management system with secure authentication flows, including registration, login, 2FA via email, and profile management. User sessions are handled with JWT tokens stored in HTTP-only cookies for security. The system consists of:

- Registration, login/logout with 2FA email verification
- Profile management (username, password, avatar, bio)
- Avatar upload with file validation
- Account deletion with data cleanup

##### Implementation
**Manu** developed the auth-service with 2FA and JWT logic
**Cléo** built the user-service endpoints with database integration

<br>

###  MAJOR | Backend as microservices (2p)
Nowadays microservices are the obvious choice for most big companies or websites with a lot of traffic. Not only is it a great security advantatge to have different services running in different containers, but in terms of CI/CD, having every service in a different container allows developers to work on features in an isolated environment and helps them integrate them into the whole program.\
Moreover, if any of the services ever crashes, it only affects a part of the website, while the rest can continue working. 

##### Implementation
**Marta** was in charge of creating the set of containers and their correct communication. 

Using Docker and Docker-compose we set up two containers for the front and three in the back.\
We decided to have an API Gateway with its own container to further tighten security and protect the containers from the front. The Nginx container then only acts as a server of static files and handles the https connection.\
We distinguish 2 microservices:
- user-service (with its own separate db container)
- auth-service
  
<br>

### MINOR | Implement a complete 2FA system (1p)
We implemented a complete Two-Factor Authentication system using email-based verification. After entering valid credentials, users receive a 6-digit code via email that must be provided to complete login or registration. This adds an essential security layer protecting accounts even if passwords are compromised.

##### Implementation
- **Manu** integrated Nodemailer with Gmail SMTP to deliver 2FA codes
- Temporary in-memory storage (`pending2FA` Map) holds codes with 5-minute expiration
- Codes are required for both `/login/2fa` and `/register/2fa` endpoints before JWT issuance

<br>

### MINOR | Custom-made design system with reusable components (1p)
Given that we chose the frontend framework module, and **Emilie** learned how React components work, we thought that designing reusable 10 components was something within our capabilities.

##### Implementation
**Emilie** created a large list of reusable modules for this project, which she believe is the best way to make good use of React and its strengths! She also used this system for the implementation of typography. 

```
#typography.jsx
01.SixtyFour({children, className = "", onClick})
02.CorbenBold({children, className = ""})
03.CorbenRegular({children, className = "", onClick})
04.P({children})
05.H4({children})
06.H3({children})
07.H2({children})
08.LI({children})
09.UL({children})

#icon.jsx
10.Icon(props)

#footer.jsx
11.FooterButton({text, onClick})

#circleUtils.jsx
12.Circle({children, className=""})
13.SmallCircle()
14.CenterText({text, onClick, className = "", interactive = true})
15.PlaceholderInput({placeholder, className = "", value, onChange, type, autoComplete})

#iconUtils.jsx
16.IconText({text, className=""})
17.Icon(props)
18.IconsOverlayFrame()
19.ProfilePicture({src, className=""})
20.ChopstickButton({text, onClick})
21.OverlayPage({children, onClose})
22.DisplayDate(string)
23.DisplayIcon({children, avatar, setAvatar})
24.LargeButton({children, onClick})

#friends.jsx
25.Button({text, onClick, src})

-->footer
-->header
-->content
```

For colours, she created variables in the Tailwind index, one part based on colours from the Tailwind range and another part with hexadecimal colour codes.
```
shell "#FFFEF4" -> CREATED
yellowish "#FDD28B" -> CREATED
palePink "#E8B0A3" -> CREATED
greyish "#C8C6B8" -> CREATED
greenish: "#719a79" -> CREATED

brightRed -> red-600 -> from Tailwind
darkRed -> red-900 -> from Tailwind
```
<br>

### MINOR | A complete notification system for all creation, update, and deletion actions (1p)

##### Implementation
**Emilie** chose to use SweetAlert2 to create attractive alerts for all phases of the project. It's a JavaScript library that allows you to create attractive, customisable pop-up windows/alerts and notifications. It's easy to install with NPM!

<br>

#### MINOR | Support for additional browsers (1p) - EMILIE

##### Implementation
**Emilie** , the website was tested and validated on Google Chrome, Mozilla Firefox, and Brave to ensure cross-browser compatibility and a consistent user experience. Chrome, was used as the reference browser during development.

Chrome and Brave share the Chromium engine and offer almost identical compatibility for CSS rendering and JavaScript execution. Brave is faster thanks to tracker blocking but consumes more RAM. He blocks third-party cookies, unlike the other two.
Mozilla Firefox uses the Gecko engine, making it the only one to offer specific tools for CSS Grid, facilitating the debugging of complex layouts. Although standardised, pixel rounding and alignment may vary slightly between the Chromium and Gecko (Firefox) engines.

All core features remain fully functional across all supported browsers, ensuring a consistent user experience.

<br>

### :green_book: Total point count - 17 points
With these modules we have the 14 mandatory points and 3 extra, just in case we fail any of them during evaluation.

<br>


## 8. Features List 

We'll start by listing the core gameplay features: 

### Game Features

#### 🌺 Falling Blossom System
- Continuous blossom spawning across three lanes (Left, Middle, Right)
- Multiple blossom types:
  - **Normal Blossom** – 1 point
  - **Middle Lane Blossom** – 2 points (high-value lane)
  - **Golden Blossom** – 3 points (rare, +2–3 Perfect Meter on perfect catch)
- Real-time scoring system

#### 🎯 Precision-Based Catching System
- Standard catch detection
- **Perfect Catch** mechanic (center-timed capture)
- Perfect Meter gain system
- Golden blossom bonus meter boosts

#### 🏁 Lane Control System
- Claim a lane after catching 5 consecutive blossoms in it
- Owned lanes grant:
  - Bonus Perfect Meter points
  - Push priority during simultaneous contact
- Encourages strategic territorial gameplay

#### ⚡ Perfect Meter & Ability System
The Perfect Meter unlocks abilities at thresholds:

- **5 Perfects** → Reverse Input / Reverse Push
- **10 Perfects** → Ink Freeze (temporary movement lock)
- **15 Perfects** → Momentum Surge (enhanced pushing power)

Meter resets after ability activation.

#### 🥊 Contact & Push Mechanics
- Physical collision system
- Simultaneous push resolution:
  - Lane owner wins
  - Neutral lane → no movement
- Competitive lane blocking

#### 🌬 Dynamic Field Event
- **Wind Gust** event (1–2 times per round)
- Temporary blossom drift to adjacent lanes
- Forces rapid adaptation

#### ⏱ Match Structure
- Total match time: 1 minute
- Two 30-second rounds
- Highest total score wins


### Artificial Intelligence Opponent
- Lane switching decisions
- Perfect timing attempts
- Strategic ability activation
- Push conflict resolution
- Adapts to dynamic field events
- Simulates human-like constraints and can win matches


### Game Customization
- Adjustable gameplay parameters:
  - Ability activation behavior
  - Field configuration settings
  - Match dynamics options
- Default configuration always available

---

These are the rest of the features of the project:

### 👤 User Management & Security

#### Secure Authentication System
- Email + password registration
- Password hashing with secure algorithms
- Two-Factor Authentication (2FA)
- JWT-based session management
- Protected API routes

#### HTTPS Everywhere
- Full HTTPS infrastructure
- Secure backend communication
- Encrypted inter-service communication

#### Input Validation
- Client-side form validation
- Server-side request validation
- Route protection middleware

---

### 🏗 System Architecture
- Microservices architecture:
  - `nginx-front` – frontend + game logic
  - `api_gateway`
  - `auth` service
  - `user` service
  - `mariadb` database
  - `cert-generator`
- Clear separation of responsibilities and secure inter-service communication

#### Technology Stack
**Frontend:** React, Tailwind CSS, Vite  
**Backend:** Fastify (Node.js), MariaDB  
**Documentation:** Swagger for Auth & User microservices

---

### 🐳 DevOps & Deployment
- Fully containerized with Docker
- Single-command deployment
- Development and Production modes
- Environment variables stored securely in `.env` and docker secrets
- HTTPS certificate automation

---

### 📜 Legal & Compliance
- Privacy Policy page
- Terms of Service page
- Easily accessible in the application

<br>

## 9. Individual Contributions

Here you can see who implemented each feature, the issues we faced, and how we solved them:

#### Marta – DevOps & Architecture
- Designed and implemented microservices architecture
- Dockerized infrastructure (dev & prod modes)
- HTTPS configuration and certificate automation
- Service communication and API gateway integration

My first objective as the Dev-Ops designated person was to provide a basic structure of containers for the whole team that was funcional, easy to scale, and easy for them to work on independently.

In order to do that, I had to learn what was actually strictly necessary for each service to work, and then learn about the frameworks and libraries we were gonna use, and how to install and configure them properly. That's why I started creating my own mini react projects and testing how Node.js worked. It was very overwhelming in the beggining, because all of these languages and technologies were new to me as well, but after some research and tests I was able to create the following structure:

    > Makefile
	 > docker-compose.yml
	 > srcs/
		- nginx_front (no front logic yet, serving pure .html, would later add node and vite)
 		- api_gateway (node, redirecting to user & auth microservices)
 		- user-service (node)
  		- auth-service (node)
  		- user-db (mariadb)
		
With time, I added the React and Tailwind in the frontend, in a multi-stage Dockerfile.
One of the things that has taken me the most time to do proprely are the two modes: DEV and PROD.

From the start I only considered having the project be production-ready, but as the project grew, the files multiplied, and compiling time got longer, the front and back developers needed to work and see changes in the moment, not recompile images and wait. That was when I decided to create the DEV mode, where vite runs as server, we have hot module reload, and nodemon runs in the backend, also giving immediate updates that eliminate the need to recompile.

After that, and after we connected the front with the back (which was fun to say the least), I focused more on security: docker networks, volumes, ports, secrets and HTTPS connection.

#### Manu – Authentication & Security
- Implemented 2FA authentication flow
- JWT-based session management
- Route protection middleware
- Secure password handling

I was tasked with the developing of the authentication service, which required implementing and maintaining a session system based on JSON Web Tokens (JWT). Since security was an important concern, the tokens were saved into HttpOnly cookies in the browser. The launch of the user authentication flow started with the 2FA. Since we needed to use the Simple Mail Transfer Protocol, we had to use a mailing provider that allowed us to send the 2FA authentication email, for which we configured a Gmail SMTP account: **theblossomclash@gmail.com**

Maintaining the sessions consistency throughout the user experience in our site was the main challenge I faced. Both the back and the front had to maintain the same session truth through all the possible actions the user could make in the front: registering, deleting, logging in/out, updating, etc.

#### Cléo – Backend & Database
- Fastify backend implementation
- MariaDB schema design
- User service implementation
- Swagger documentation
  
I started implementing the backend using Fastify, organizing the project with a clean and modular architecture by separating routes, schemas, handlers, and database queries into different files. I set up global error handling with custom responses and used schemas both for validation and as a security layer to control request and response formats.

I seeded the database with realistic test data using Faker.js and implemented avatar uploads with Fastify Multipart. I also integrated Swagger UI to document and manually test all API routes.

The main challenge was the integration with the frontend, which required constant adjustments to endpoints, handlers, and error management. Through iterative testing and debugging, I was able to stabilize the communication between both sides and ensure reliable API behavior.


#### Emilie – Frontend & UI
- React + Tailwind interface
- Game UI design
- Input validation (frontend)
- User experience flow

As a product owner,  my principal objectiv was to define a precise vision of the project, especially focus to the design part. As the front-designer developer of the project, it was quite natural for me to commit myself to the PO role. 
With my professional experience, I already devellop a palet of organisational skills useful for the position :

→ define project vision and objectivs
→ prioritize tasks between team members
→ manage backlog
→ express users & clients needs (here 42 subject)
→ validate the website and all his options to make sure that it adds maximum value to the project
→ ensuring a good customer experience

To help me in that task, I began the project with differents models I created in Figma. We choose with all team members our favorite visual and I created all the differents pages related based on this model.

During all the project development, we met every week to ensure good progresses and consistency on our differents parts. Since the beginning we work on the same website, with differents Github branches of course, to avoid any final connexions troubles.

Another very important part of the project was managing the responsiveness of the site with Tailwind breakpoints, which is not so easy to do. We chose these four formats for all our tests:

	 mobile -> 320/375 -> Iphone 12 Pro
	 sm → 640px
	 md → 768px ->Ipad Mini
	 lg → 1024px -> nest Hub
	 xl → 1280px -> nest Hub max (our screen)

	 --> mobile, md & xl (& lg for personal use)

I was especially implicated in the design part, as an ex-fashion designer it was amazing and really important for me to propose a project with a true design vision.
All the team enjoyed working on this Vintage Japonese Botanical theme and enriched the project with their ideas!
→ [figma project](https://www.figma.com/site/eAmGTsUXKVOWK3iayg7CO8/Transcendance?node-id=0-1&t=pvRTo1eR0cpAlGys-1).


#### Cristina – Game Logic & AI
- Blossom Clash gameplay implementation
- Collision & lane system
- Perfect Meter & ability mechanics
- AI opponent logic
- Wind event implementation
As the game developer, my main goal was to create a complete, interactive, and fun web-based game. I started by designing the core gameplay mechanics, defining how players interact, how scoring works, and the conditions for victory. This required planning a lane system to structure movement and a collision detection system to handle interactions between players, abilities, and environmental elements.

Once the base gameplay was functional, I implemented the Perfect Meter and ability mechanics, allowing players to perform special actions depending on their in-game performance. This required balancing meter growth and ability effects to make gameplay fair and dynamic.

Next, I focused on the AI opponent, which involved building a decision-making loop capable of predicting player movement, choosing lanes strategically, and using abilities effectively. The AI needed to operate within the same constraints as human players to ensure balanced and competitive gameplay. Integrating the AI required careful testing and iterative adjustments to make it responsive yet beatable.

Finally, I added the wind event system, an environmental mechanic that affects movement and abilities. This introduced variability into each match and required updating both the player and AI movement logic to handle dynamic environmental changes.

The biggest challenges were balancing gameplay for fairness, integrating AI behavior without creating glitches, and ensuring all components (player input, AI, abilities, and environmental effects) worked seamlessly together in real-time.


<br>

## 10. Game rules (bonus section)
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
Catch 3 blossoms in a row in the same lane to claim it.

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

**At 2 Perfects → Reverse Push OR Reverse input**

Your opponent’s push turns into a pull for ~1 second OR inputs are reversed, left becomes right and right becomes left.\
Great for lane steals, repositioning and confusing the opponent.

**At 4 Perfects → Ink Freeze**
Opponent is unable to move or push for ~0.4 seconds (maybe more).\
Use it to secure key blossoms or shove them out.

**At 6 Perfects → Momentum Surge**

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

##### Dynamic Field Event
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
After two rounds of 20 seconds (customizable), total scores are compared.\
The player with the highest score wins Blossom Clash.
<br>


## 11. Resources

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
- https://blog.nginx.org/blog/rate-limiting-nginx
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

Thanks for making it all the way to the end! 

Enjoy the game ;)

<br>


