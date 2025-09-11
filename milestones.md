# Group Project Milestones

Use these as the overall milestones you need to reach before Demo Day.
Each one should be broken down as tasks to smaller pieces with a kanban board using agile principles.

## REALLY

You want to bring to bear all the various _self-reflective_ learnings y'all have made throughout...

- _"doing more thought up-front would have really helped"_
- _**planning** is DOING_
- _listening to what the instructors were telling us to do step-by-step would have saved us time_
- _making sure everyone was moving along with their **assigned** tasks from the kanban board_
- _doing honest standups and **listening** to others to ensure we are all moving forward_
- _helping stymied/blocked team members **sooner** to keep us all moving_
- _consulting instructors and getting **navigation hints** sooner_
- _if a team member has problems, bringing it up to instructors ASAP to consult_
- _don't let team dysfunction turn into emotional hurt, work it thru_

## Milestone Zero - 6-Spring

As a group, everyone get all 6 spring labs done, and into your personal Github Accounts.
Do this quickly, as a group, ASAP. Clear with instructor before moving onto M1.

## Milestone 1 - Document Phase

Decide on a series of features the project should have.

Build a One-pager, a Data Model doc, and work up some UX/UI mockup diagrams. The more planning done at this phase to the Data Model, the easier the subsequent phases will be.
Tech stack will be 

- FrontEnd - VanillaJS first, and then, -> React
- Middleware - Spring (via spring boot initialzr)
- Backend - MySQL (with possible aws S3 storage for large assets)

What _entities_ will your project manage on behalf of a `User` entity??
What _operations_ will your app do to provide some capabilities to your `User`? Depending on your topic/app area,
you may have entirely different operational ideas than other groups.

## Milestone 2 - Data Model

Two different ways possible:

- Go with "straight" SpringBoot/start.spring.io, create Entity beans, Controllers, Servies, DTOs etc.
- Develop the JDL file to be used with `jhipster`. Carefully discuss the relationships between the entities.

## Milestone 3 - Create Backend/REST Server

Use Spring Initializr or Jhipster to create a rest server backend in Spring.

**Disable the Security beans** so you can test the API without having to handle logins and/or JWT-type authorization/access to the data model.

Be sure to use MySQL for backend.

## Milestone 4 - First Front End (FE)

Build a VanillaJS, simple front end to your REST Server. Show some lists of entities and some entity details. Use very simple CSS styling.

Add a simple posting mechanism for some entity.

## Milestone 5 - Front End in React

Either mimic what jhipster is doing for the UX/UI (with login and JWT support; look for current_user in the typescript HTML templates in the JH front end). OR generate a from scratch React UI, that talks to the JH/Spring server/

## Milestone 6 - Business Logic

Make the services etc, work like they should for your app's main User operations.

## Milestone 7 - Demo Development

You’ll need to work ups demonstration of your project. The end-goal is to have a very polished, tight, and well-crafted demo showing what your software does. You want to demo for success, and working hard on a demo is great way to show off what you’ve been learning.


## Milestone 8 - Get running on XO

Use our XO server to host your project so multiple people can access it at once. This can be very impressive on demo day.

