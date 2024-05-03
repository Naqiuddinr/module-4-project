# Tadel (Task Delegation Management App) 📝

Hi! Tadel is my second full-stack project that I build from scratch as part of my Coding Bootcamp requirement to graduate.

Tadel utilised React.js and Node.js. This repo specifically store the code that I wrote for the front-end.

+ If you want to see the back-end code, you can find it [here](https://github.com/Naqiuddinr/module-4-project-tadel)
+ Tadel is also live hosted using vercel, you can try it out [here](https://module-4-project-naqiuddinr.vercel.app/)
+ Since I was required to record a 2 min video demonstration for my presentation during the bootcamp, might as well include it [here](https://youtu.be/ynBE71BIlX4?si=n1fPAdOf8rnLZ0uR)

This project took me about 3 weeks to completed after learning the tech stack about 2 months. Minor improvement might still be added later on.

*DISCLAIMER: Due to using the free version of Render(live host for backend), the app might take some time to load.*

## Inspiration
I used to work in the construction industry and was once held the Head of Department position for a project. While I was the HOD, I sometimes get overwhelmed with what are the task given to my team. So when we(bootcamp student) were required to build an app from scratch, I decided to tackle one of the problem I used to face.

## Key Features
+ User Interaction : Tadel is not only to monitor your own task but to delegate task as well. You can add a team member and create a task for that user. You can track the status of the task whether it is still pending / in-progress / completed.
  
+ Task monitoring : Just viewing a task can get boring, with Tadel you can tracj the overall status and also monitor the progress persentage of your tasks, giving you the right temperature of whether yourself or your team is progressing right.

## Tech Stack
| Fron-End                 | Back-End                  | Additional         |
|--------------------------|---------------------------|--------------------|
| ReactJS                  | NodeJS / ExpressJS        | MailgunJS          |
| Bootstrap / MUI / Framer | Firebase                  | Vercel (Front-End) |
| Redux                    | Neon Console (PostgreSQL) | Render (Back-End)  |

## Challenges
+ *User signup synchronizing* : Since Tadel uses Firebase Authentication, when user signup it updates the Firebase but does not transfer the data into the databse.
  - *Overcome* : API Endpoint was written so when user signup it will also send the data back to the database. However, if Firebase caught any duplication, it will not send the data back to the database.
+ Implementing MailgunJS : First time using mailgunJS (new and unfamiliar to me).
  - *Overcome* : Took the time to understand writing code on nodeJS

## Future Improvement
+ Add a toggle button to switch between kanban board mode to list mode
+ Hide Team Member progress bar if user decide to use it for own task only
+ Filter function to select specific team member task
