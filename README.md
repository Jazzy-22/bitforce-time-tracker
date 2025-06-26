TimeTrack by BitForce
===
Beta: 0.1

## Dependence
- MySQL Server
- NodeJS

## Database

### Install
First of all, we need to configure a local database server. Here's the link of the mysql community server, that works perfectly:

[MySQL Server](https://dev.mysql.com/downloads/mysql/)

### Configure

After the installation, we need to create a new database called `tt` and execute these two lines for the local database, in order to grant the right access:

```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
flush privileges;
```

### Local Connection

Create a file with name `.env.development.local` in apps/tt-server/ with this content:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=1234
DB_NAME=tt
```

### Data Injection

We don't have data yet, so we'll need to manually create the needed information.
More on that below.

## First Run
1. Install modules
   ```
   npm i
   ```
2. Complete you `env.development.local` file with these variables:
   ```
   JWT_SECRET
   CRYPTO_SECRET
   EMAIL_HOST
   EMAIL_USERNAME
   EMAIL_PASSWORD
   ```
   You will need to assign appropriate values for all of them. 
3. Start turbo
   ```
   npm run dev
   ```
4. Open the [Initialization URL](http://localhost:3001/auth/baseline/data/generation) in your browser to generate entries for status, permissions, profiles, roles, users, accounts, projects, members and tasks.
   - Ten users will be created, with random profiles, roles, names and email addresses (matching, of course, their names); "password" is the password for all of them (might be expired).
   - You can use any of these user accounts to log in, or create a new one (see below). Bear in mind that you won't be able to complete password resets, since you don't have access to the email accounts (workaround below).
   - At the time, email addresses cannot be changed once inserted into the database.
5. (Optional) Open the [Registration Page](http://localhost:3000/register) in your browser and create your user WITH YOUR EMAIL ADDRESS. Consider the following:
   - Upon user registration, an email will be sent to the email address with an activation link;
   - The email service will not work unless you provide valid credentials in your `env.development.local` file;
   - If the email service is not working, there's a workaround:
     - Check `apps\tt-server\src\email\templates\temaplates.ts` for the activation URL format;
     - Retrieve the `recovery_token` from the user table, and use it alongside your email address to obtain the activation URL;
     - Navigate to the activation URL on a browser window;
   - Users created via registration are assigned standard (limited) role and profile by default. If you need to change any of them, just modify the values for `role_id` and/or `profile_id` in the `Users` table.


## References
- [NextJS](https://nextjs.org/docs/pages/api-reference)
- [NestJS](https://docs.nestjs.com/)
- [MaterialUI](https://mui.com/material-ui/getting-started/)
  
## License

No License yet
