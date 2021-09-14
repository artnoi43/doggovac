# [DoggoVac](https://doggovac.artnoi.com)
## An internal vaccination date tracker for SME veterinary businesses, written in JavaScript

DoggoVac features [React](https://reactjs.org) frontend, [Express](https://expressjs.com) HTTP backend, and [Sequelize](https://sequelizejs.org) ORM. DoggoVac also uses [Passport](https://passportjs.org) for user authentication, and [Luxon](https://moment.github.io/luxon/) to work with dates.

It's meant to be fast, small, and lightweight, suitable for use on computers with low computing resources like the ones you'd likely find at Thai veterinary businesses.

DoggoVac is currently written in JavaScript, although I plan to port the backend code to Go.

It is my final project for the JavaScript course I took.

## Why DoggoVac?
Most Thai SME veterinary businesses still manually manage their vaccination dates (i.e. using Excel sheets and manual screening). Not all vet shops have employees that are very good at Excel, too.

Traditional vaccine tracking is tiresome and inefficient, especially if the the vet serve canine and feline animals numbering in the hundreds or thousands.

This also wastes valuable employee time, and may cause human errors, which may lead to the animals not receiving vaccination shots timely and thus reducing the shots' effectiveness, or even worse, the animals may be given the vaccines which they are allergic to.

## System features

- JWT user authentication

- [Bcrypt](https://en.wikipedia.org/wiki/Bcrypt) password hash

- Basic CRUD for all database tables

- Pages for (1) creating new customers and their pets, (2) tracking vaccination history and schedule, (3) updating vaccination information

### Using DoggoVac on [doggovac.artnoi.com](https://doggovac.artnoi.com)
You must first create a user account for DoggoVac. After a user account is registered, create Customers and Pets respectively. Vaccination schedules will be created automatically by the Express server based on the pet's date of birth.

**All 3 Sequelize models (`Customer`, `Pet`, `Schedule`) is associated with a `User` instance**, so a user can only access his or her `Customer`, `Pet`, and `Schedule`. In small vet shop, you should only create one user account (i.e. an *admin* account), and share the login credentials amoung the employees.

## Deploying your own DoggoVac
You can also deploy your own DoggoVac. To do so, clone the [repository](https://github.com/artnoi43/doggovac), make it yours by modifying the code, and start using it.

<a name="build_frontend"></a>
### Frontend
After you have cloned the repository, you can edit the frontend code in `doggovac/frontend`. After you are done with the code, build the production version with:

    $ cd frontend;
	$ npm install;
    $ npm run build;

### Backend
#### `backend/.env`
File `backend/.env` contains environment variables that control how your backend behaves, for example, listen port and databsse authentication method. It also contains the `SECRET_OR_KEY` string used by the backend to sign JWT tokens. For example, to make the backend force sync the database every time it runs and listen on port 8080, edit `backend/.env` to:

    PORT = 8080
    SECRET_OR_KEY = mySuperSecretKey
    # Use SYNC to force sync database, and use AUTH to authenticate database
    DB = SYNC
    #DB = AUTH

#### Running the backend
You can simply use `node` to run the backend manually just like any other Node servers:

    $ cd /backend;
	$ npm install;
    $ node backend/app.js;

Or you can configure `pm2` to run file `app.js`.

#### Database
The repository does not include Sequelize database configuration `doggovac/backend/config/config.json`, but it does include an example `doggovac/backend/config/config.json.example`, and we can use that as our template by copying the example file:

    $ cd backend;
    $ cp -a config/config.json.example config/config.json;

Now you can populate the file with your own database connection.

### HTTPS proxies for backend and frontend
In this example, we will have 2 computers serving DoggoVac.

- `10.8.0.1` - HTTP webserver for frontend

- `10.8.0.2` - HTTPS proxies for both the backend and frontend (port 443), and HTTP backend (port 8888)

> I'm going to assume that the network `10.8.0.0/24` is actually a VPN network.

#### Serving the frontend with plaintext HTTP on host 10.8.0.1
[After you have built the frontend](#build_frontend), you can copy the `build` directory to your webserver root:

    # cp -a build /srv/http/doggovac;

I'm going to use NGINX for serving and reverse proxying. Let's say our site root is at `/srv/http/doggovac`, then we can setup a simple HTTP server that serve this directory:

    http {
      server {
        listen 10.8.0.1:8080;
        root /srv/http/doggovac;
        error_page 404 /index.html;
      }
    }

Now open your browser, and go to the URL `http://10.8.0.1:8080`, and you should see DoggoVac in the browser.
You can put the backend behind a HTTPS reverse proxy to secure your connection. In this case, the sever `10.8.0.2` has Let's Encrypt certificates for `doggovac.example.com`.

#### HTTPS proxies and backend on host 10.8.0.2
Let's assume that both the HTTPS reverse proxy (path `/api`) and the plain HTTP backend (port 8888) are running on the same server whose public IP address is `1.2.3.4`.

Before you begin, make sure that the server `10.8.0.1` has TLS certificates for the domain `doggovac.example.com`. In my case, I use Let's Encrypt's `certbot` to obtain the certificates.

To relay HTTPS connections from clients to the backend, add this HTTP server block to NGINX configuration:

    http {
      server {

        # frontend reverse proxy
        # (frontend host 10.8.0.1)

        location / {
          proxy_pass http://10.8.0.1:8080;
        }

        # backend reverse proxy
        # proxy and backend running on the same host

        location /api {
          proxy_set_header X-Forwarded-For $remote_addr;
          proxy_set_header Host $http_host;
          proxy_pass http://127.0.0.1:8888;
        }

        server_name doggovac.example.com;
        listen 1.2.3.4:443 ssl http2;
        ssl_certificate /etc/letsencrypt/live/doggovac.example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/doggovac.example.com/privkey.pem;

        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
      }
    }

You should also reflect these changes in the frontend. It should send its requests to `https://doggovac.example.com/api`, and the requests sent over HTTPS will be forwarded to `10.8.0.2:8888` over HTTP.

You can apply these changes to the frontend by editing `doggovac/frontend/src/config/axios.js`:

    // Change backend URL to https://doggovac.example.com/api
    axios.defaults.baseURL = "https://doggovac.example.com/api";

Now your DoggoVac connections are secured, if the network `10.8.0.0/24` is a VPN. If not, you can follow [this guide to easily deploy a WireGuard VPN](https://artnoi.com/blog/2020/wireguard/).
