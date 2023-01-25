# Simple Auth Server


# Installation

Node.js required > v16.0

```sh
npm Install

npm run dev
```


## /signup 

params 
{username, password, phone, email}

returns id of inserted row

## /signin

Params
{ username, password }

returns token


## /info

Authorized Users Only

[GET]
parmas not required

returns user info 

[PUT]

params

{phone, email}
requires both param in body of request




## /latency

Authorized Users Only

parmas not required

returns user `pinged host data `

## /token

Authorized Users Only

parmas not required

returns none disabled current token for relogin visit signin page and update token lifetime

## /info

Authorized Users Only

parmas not required

returns user info 