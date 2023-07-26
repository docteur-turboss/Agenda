# Avent 
---

> Je me dois de vous prévenir que ce projet n'est pas terminé.


- Choses à fini : 

    - Lier le front et le back;
    - Gérer la création d'évènement;
    - Lister les évènement correctement;
    - Améliorer l'ux et l'ui;

- Quelques idée déjà en tête : 
    - filtrages des évènements;
    - gestions des permissions;


## Features
---
#### backend
- login, signup, logout
- create update delete agenda/projet
- create update delete category event
- create update delete event
- update delete user

### frontend
- voyager entre les pages, c'est déjà ça...


## Tech
---
Avent utilise quelques library pour fonctionner correctement :

- nodejs
    - all :
        - concurrently (dev : pour lancer deux commande en même temps)
    - front :
        - react
        - react-dom
        - react-router-dom
        - react-scripts
        - web-vitals
    - back :
        - bcryptjs (prod : pour chiffrer les mdp users)
        - cookie-parser : (prod : pour la gestion de cookies)
        - dotenv (pred : pour récurer les fichiers .env)
        - email-validator (prod : valider si c'est une email valide)
        - express 
        - formidable (prod : récupère les forms mutidata)
        - knex (prod : sql constructeur)
        - mysql2 (prod : discute souvent avec la db)
        - nodemailer (prod : bonne prise de tête avec les emails) 
        - nodemon (dev : pour redémarrer le serveur pendant les modifications)

## Installation
--- 

Avent demande la dernière version de [Node.js](https://nodejs.org/) 

Installez les differentes dependences et devDependences.
```sh
    npm i
    cd backend/
    npm i
    cd ../frontend/
    npm i
    cd ../
```

Allez dans le dossier backend/config/
Créez le fichier .env qui contiendra : 
```env
    HOSTDB='localhost'
    PORTDB='3305'
    USERDB=<l'utilisateur de la db>
    Database=<La base de donnée>
    PASSWORDDB=<Le mot de passe de base de données>
    NODE_ENV=["production" | 'dev' ...]
    PORTEXPRESS=3000
    SERVICE_EMAIL='gmail' :3
    EMAIL_IDENTIFIANT=<votre email>
    EMAIL_PASS=<la clé pour s'y connecté en tant qu'appli>
```

Une fois ceci fait, (/!\ fait attention d'avoir entrer le nom de votre database vide.)

puis aller dans votre le terminal et tapez :
```sh
    cd backend/
    npm run createDB
```

## Avancé du projet :
---
Version du projet : 0.0.1
- y.x.x = la version y du projet est fini
- x.y.x = l'étape y est arrivé 
    - 0 : construction
    - 1 : alpha
    - 2 : beta protype
    - 3 : beta
    - 4 : test prod

- x.x.y = commit numéro y de la version x.x
- 

### Petit mot 
--- 

Merci bien, c'est un plaisir,
Doc