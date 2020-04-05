# Elsa hilft digital

## Inspiration
In times of crisis, vulnerable people can't always leave their homes from risk of exposure.  To help, "Stiftung Elsa Benz-von Arx", under the supervision of Stadt Baden, has begun a hotline service to offer home delivery. But with high demand, comes lots of paperwork. Joining forces with a young team of bundled computer enthusiasts, our geeks, nerds and dweebs have been working hard at developing "Elsa hilft digital".  

## What it does
Thanks to EDH, "Hans-Ruedi" can call a hotline to share his shopping list. Using a centralised system, our hotline workers can automatically dispatch the order to our platform of volunteers, using Telegram, which is available to everyone. In this case, our volunteer "Peter" will leverage the chatbot to confirm the order, and go out shopping.  Using the same chatbot, "Peter" shares the receipt with our hotline, who is able to cross-check with the original request and inform "Hans-Ruedi" how much cash he should leave "Peter" in the letter box.  Without physical contact, and remaining safe, "Peter" confirms the end of the transaction, closing the order in our EDH system. 

## How I built it
Complete stack, including front-end, back-end and deployment. Full stack built with:

*Postgres
*Docker
*Spring Boot
*JPA
*React/Node.js
*Bootstrap
*NPM
*Redux
*Webpack
*Gradle
*Ansible
*Liquibase
*VM Debian

## Challenges I ran into
Time pressure for full stack development in 48h.

## Accomplishments that I'm proud of
Working proof of concept, ready to be tested by existing organization. Real value in 48 hours.

## What I learned
Preparation before hackathon is essential to get tangible results. Idea generation, verifying concept with real stakeholders, so that results can be tested and used right away.

## What's next for Elsa hilft digital
This system has been developed for any local community searching for a centralised way to communicate with volunteers and track tasks, only needing a hotline. Features like billing or more possibilities for action other than purchase will be considered. All in all, the next helping call agent could be you. The only other thing you'll need is a phone. 


### Telegram

You need a [telegram bot](https://core.telegram.org/bots#6-botfather). Export
the token into the `TELEGRAM_TOKEN` environment variable of the backend java
process.

You need two group chats: One for volunteers, one for moderators.

Find the Telegram chat IDs of both chats and insert them into the DB table
`organization.telegram_group_chat_id` for the volunteer's group chat and
`organization.telegram_moderator_group_chat_id` for the moderator group chat.
Generate a Join Link for the volunteer chat and put it into
`organization.url_group_chat`. You learn these IDs by inviting the bot to the
group. It will log the group ID and name on joining.
