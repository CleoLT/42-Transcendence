# Transcendence

1. Basic requirements
2. Bonuses

## Basic requirements
Incluidas las cosas básicas dentro de nuestros modulos elegidos:

- Single-page application + use of *Back* and *Forward* buttons 
- Compatibility with the latest stable up-to-date version of Mozilla Firefox
- Juego Pong entre 2 jugadores con el mismo teclado (CRIS)
  >  All players must adhere to the same rules, including having identical paddle speed

  >  While the visual aesthetics can vary, the game must capture the essence of the original Pong (1972).
  
- Tournament system: (EMILIE, design + frontend) 
  >   multiple players take turns playing against each other
  
  >   display name of adversary & order of games
  
  >   matchmaking system:  the tournament system should organize the matchmaking of the participants, and announce the next match.

- **Standard User Management MODULE:** User registration (major) (MANU)
  
  > Users can securely subscribe to the website.
  
  > Registered users can securely log in.
  
  > Users can select a unique display name to participate in tournaments.
  
  > Users can update their information.
  
  > Users can upload an avatar, with a default option if none is provided.
  
  > Users can add others as friends and view their online status.
  
  > User profiles display stats, such as wins and losses.
  
  > Each user has a Match History: including 1v1 games, dates, and relevant details, accessible to logged-in users.
  
  >  aliases are linked to registered accounts, allowing persistent stats and friend lists


- Use of Docker to run the website (one command launches everything)
- **DevOps MODULE:** Backend as microservices with Docker (major) (MARTA)
        
  >   Divide the backend into smaller, loosely-coupled microservices, each responsible for specific functions or features.
  
  >   Define clear boundaries and interfaces between microservices to enable independent development, deployment, and scaling.
  
  >   Implement communication mechanisms between microservices, such as RESTful APIs or message queues, to facilitate data exchange and coordination.
  
  >   Ensure that each microservice is responsible for a single, well-defined task or business capability, promoting maintainability and scalability.

- BASIC SECURITY! (falta decidir quien lo hace!)
  >  Any password stored in your database, if applicable, must be hashed.
  
  >  Your website must be protected against SQL injections/XSS attacks.
  
  > If you have a backend or any other features, it is mandatory to enable an HTTPS connection for all aspects (use wss instead of ws for example).
  
  > You must implement validation mechanisms for forms and any user input, either on the base page if no backend is used, or on the server side if a backend is employed.
  
  > Regardless of whether you choose to implement the JWT Security module with 2FA, it’s essential to prioritize the security of your website. For instance, if you choose to create an API, ensure your routes are protected. Even if you decide not to use JWT tokens, securing the site remains critical.
  
  > Please make sure you use a strong password hashing algorithm!

  > any credentials, API keys, env variables etc., must be saved locally in a .env file and ignored by git. Publicly stored credentials will cause your project to fail.

- **Framework for backend MODULE:**    (major) (CLÉO)
    > Fastify with Node.js
    
- **Framework for frontend MODULE:**    (minor) (EMILIE)
    > Tailwind CSS in addition of the Typescript, and nothing else!
    
-  **Database for backend MODULE:**    (minor) (CLÉO)
    > The designated database for all DB instances in your project is SQLite. This choice ensure data consistency and compatibility across all project components and may be a prerequisite for other modules, such as the backend Framework module.

A partir de aquí ya tenemos 7 puntos, con esto APROBAMOS, así que pasamos a los bonus.

## Bonuses

- **Game customization MODULE:** (minor) (CRIS, EMILIE, MARTA ?)
    > This module aims to give users the flexibility to tailor their gaming experience across all available games by providing a variety of customization options while also offering a default version for those who prefer a straightforward gameplay experience:
    
    > Offer customization features, such as power-ups, attacks, or different maps, that enhance the gameplay experience.
    
    > Allow users to choose a default version of the game with basic features if they prefer a simpler experience.
    
    > Ensure that customization options are available and applicable to all games offered on the platform.
    
    > Implement user-friendly settings menus or interfaces for adjusting game parameters.
    
    >  Maintain consistency in customization features across all games to provide aunified user experience.

 - **User and Game Stats Dashboards MODULE** (minor) (EMILIE ?)
    > In this minor module, the goal is to introduce dashboards that display statistics for individual users and game sessions. Key features and objectives include:
    
    > Create user-friendly dashboards that provide users with insights into their gaming statistics.
    
    > Develop a separate dashboard for game sessions, showing detailed statistics, outcomes, and historical data for each match.
    
    > Ensure that the dashboards offer an intuitive and informative user interface for tracking and analyzing data.
    
    > Implement data visualization techniques, such as charts and graphs, to present statistics in a clear and visually appealing manner.
    
    > Allow users to access and explore their own gaming history and performance metrics conveniently.
    
    > Feel free to add any metrics you deem useful
    
    > This minor module aims to empower users with the ability to monitor their gaming statistics and game session details through user-friendly dashboards, providing a comprehensive view of their gaming experience.

- **Two factor Auth & JWT MODULE:** (major) (MANU)
    > Implement Two-Factor Authentication (2FA) as an additional layer of security for user accounts, requiring users to provide a secondary verification method, such as a one-time code, in addition to their password.
    
    > Utilize JSON Web Tokens (JWT) as a secure method for authentication and authorization, ensuring that user sessions and access to resources are managed securely.
    
    > Provide a user-friendly setup process for enabling 2FA, with options for SMS codes, authenticator apps, or email-based verification.
    
    > Ensure that JWT tokens are issued and validated securely to prevent unauthorized access to user accounts and sensitive data.

Con estos bonuses sumamos 3 puntos más, haciendo un total de 10 puntos.
Hay 3 modulos minors de accessibility de la parte de web/front que nos sumarian 1'5 puntos más.
