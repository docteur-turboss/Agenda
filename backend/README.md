# Backend d'avent.

## Routes :

### route utilisateur

- Creation d'un utilisateur :
/api/v1/users/sign/up
En post
avec les paramètres "pseudo", "email", "password"


- Connection d'un utilisateur :
/api/v1/users/sign/in
En post
avec les paramètres "email", "password"

- Deconnection d'un utilisateur :
/api/v1/users/sign/out
En post
avec l'authentification des clé cookie "auth" et clé header "token"

- Modifier le profil d'un utilisateur :
/api/v1/users/update/profile
En put
avec l'authentification des clé cookie "auth" et clé header "token"
Avec un paramètres minimum, "email", "password", "pseudo"

- Oublie de mot de passe :
/api/v1/users/password/forgot
En post
avec le paramètre d'"email".

- Récupération d'un user :
/api/v1/users/@me
En get
Avec le header "token" et le cookie "auth"

- Déstruction de l'user :
/api/v1/users/@me/destroy
En delete
Avec le header "token" et le cookie "auth"

### Les routes d'organisation (agenda / projet) :

- Création d'agenda :
/api/v1/organisation/main
En post
Avec le header "token" et le cookie "auth".
Avec les params : "Nom" et "Type" (type doit être compris entre 0 et 1)

- Modification d'agenda :
/api/v1/organisation/main
En put 
Avec le header "token" et cookie "auth"
Avec les params : "Nom" et "OrganisationID"

- Select un agenda :
/api/v1/organisation/main
En get
avec le header "token" et cookie "auth"
Avec les params : "OrganisationID"

- Destroy un agenda
/api/v1/organisation/main
En delete
Avec les header "token" et cookie "auth"
Avec les params "OrganisationID"

### Les routes de catégories d'organisation :

- Création de catégorie :
/api/v1/organisation/category
En post
Avec les header "token" et cookie "auth"
Avec les params "color", "Name", "OrganisationID"

- Modification de catégorie :
/api/v1/organisation/category
en put
Avec les header "token" et cookie "auth"
Avec les params "Category_ID", "Name", "color", "OrganisationID"

- Select de catégorie :
/api/v1/organisation/category
en get
Avec les header "token" et cookie "auth"
Avec le params : "OrganisationID"

- Destroy de catégorie :
/api/v1/organisation/category
en delete
Avec les header "token" et cookie "auth"
Avec les params "Category_ID" et "OrganisationID"

### Les routes de tâches

- Création de tâches :
/api/v1/organisation/task
En post
Avec les header "token" et cookie "auth"
Avec les paramètres obligatoires : "name", "category_event_ID", "OrganisationID"
Et les paramètres complémentaire : "Datetime" en unix chiffre, "OuCa"

- Modification de tâches :
/api/v1/organisation/task
En put
Avec les header "token" et cookie "auth"
Avec les paramètres obligatoires : "OrganisationID", "ID_Task"
Et les paramètres complémentaire : "category_event_ID", "OuCa", "Datetime", "name"

- Get tâches :
/api/v1/organisation/task
En get
Avec les header "token" et cookie "auth"
Avec les paramètres obligatoires : "OrganisationID"
Et les paramètres complémentaire : "ID" et "category_event_ID"

- Delete tâches :
/api/v1/organisation/task
En delete
Avec les header "token" et cookie "auth"
Avec les paramètres : "OrganisationID", "ID"