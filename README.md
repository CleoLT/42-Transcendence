_<p align=center> This project has been created as part of the 42 curriculum by @cle-tron, @esellier, @crmanzan, @mgimon-c and @martalop. </p>_

### <p align=center> **ft_transcendence**</p>
 
# <p align=center> :cherry_blossom: Blossom Clash :cherry_blossom: </p>

## 1. Description
> section that clearly presents the project, including its goal and a brief overview.

> should also contain a clear name for the project and its key features.
<br>

## 2. Instructions
> section containing any relevant information about compilation, installation, and/or execution.

> should mention all the needed prerequisites (software, tools, versions, configuration like .env setup, etc.), and step-by-step instructions to run the project.
<br>

## 3. Resources
> section listing classic references related to the topic (documentation, articles, tutorials, etc.), as well as a description of how AI was used — specifying for which tasks and which parts of the project.
<br>

## 4. Team Information
> For each team member mentioned at the top of the README.md, you must provide:
 
 > ◦ Assigned role(s): PO, PM, Tech Lead, Developers, etc.

 > ◦ Brief description of their responsibilities.
<br>

## 5. Project Management
> How the team organized the work (task distribution, meetings, etc.).

> Tools used for project management (GitHub Issues, Trello, etc.).

> Communication channels used (Discord, Slack, etc.).
<br>

## 6. Technical Stack
> Frontend technologies and frameworks used.

> Backend technologies and frameworks used.

> Database system and why it was chosen.

> Any other significant technologies or libraries.

> Justification for major technical choices.
<br>

## 7. Database Schema
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
