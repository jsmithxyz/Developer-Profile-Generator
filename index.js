// modules required for use
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generateHTML.js");
var pdf = require('html-pdf');


// prompt user function with questions
function promptUser() {
    return inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "Enter your GitHub Username:"
        },
        {
            type: "list",
            name: "favoriteColor",
            message: "What is your favorite color?",
            choices: [
                "green",
                "blue",
                "pink",
                "red"
            ]
        }
    ])
};

// user constructor function
function User(
    profileImg,
    profileName,
    login,
    location,
    profile,
    blog,
    bio,
    repos,
    followers,
    following,
    starred,
    favoriteColor
) {
    this.profileImg = profileImg,
        this.profileName = profileName,
        this.login = login,
        this.location = location,
        this.profile = profile,
        this.blog = blog,
        this.bio = bio,
        this.repos = repos,
        this.followers = followers,
        this.following = following,
        this.starred = starred,
        this.favoriteColor = favoriteColor
};

// prompt user for input (username & color), run two axios calls for github information, and write data to HTML
promptUser()
    .then(function ({ username, favoriteColor }) {
        const queryUrl = `https://api.github.com/users/${username}`;
        const starredUrl = `https://api.github.com/users/${username}/starred`;
        console.log(favoriteColor);

        axios.get(queryUrl).then(function (res) {
            const profileImg = res.data.avatar_url;
            const profileName = res.data.name;
            const login = res.data.login;
            const location = res.data.location;
            const profile = res.data.html_url;
            const blog = res.data.blog;
            const bio = res.data.bio;
            const repos = res.data.public_repos;
            const followers = res.data.followers;
            const following = res.data.following;

            axios.get(starredUrl).then(function (res) {
                const starred = res.data.length;

                const user = new User(
                    profileImg,
                    profileName,
                    login,
                    location,
                    profile,
                    blog,
                    bio,
                    repos,
                    followers,
                    following,
                    starred,
                    favoriteColor
                );
                console.log(user);

                const html = generateHTML(user);
                fs.writeFile("index.html", html, err => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        pdfFile()
                    }
                });

            })

        })

    });

async function pdfFile() {
    console.log('hello')
    try {
        var index = fs.readFileSync("index.html", "utf8");
        var options = { format: 'A3', orientation: 'portrait' };
        pdf.create(index, options).toFile("index.pdf", function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
        });
    }
    catch (err) {
        console.log(err);

    }
}



// async function init() {
//     console.log("hi")
//     try {
//       const user = await promptUser();

//       const html = generateHTML(user);

//       await writeFileAsync("index.html", html);

//       console.log("Successfully wrote to index.html");
//     } catch(err) {
//       console.log(err);
//     }
//   }

// init();
