document.body.classList.add("dark-mode");

document.getElementsByClassName("themes")[0].addEventListener('click', e => {
    if (document.body.classList.contains("light-mode")) {
        document.body.classList.replace("light-mode", "dark-mode");
        document.getElementsByClassName("mode")[0].innerHTML = "LIGHT";
    } else {
        document.body.classList.replace("dark-mode", "light-mode");
        document.getElementsByClassName("mode")[0].innerHTML = "DARK";
    }
});

document.querySelector(".search-btn").addEventListener('click', () => {
    const inputText = document.querySelector(".search-input").value;
    getUserInfo(inputText);
    console.log(inputText);
});

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");

const toggleButtonState = () => {
    if (searchInput.value.trim() === "") {
        searchBtn.disabled = true;
    } else {
        searchBtn.disabled = false;
    }
};

searchInput.addEventListener('input', toggleButtonState);

toggleButtonState();

//get user info
function getUserInfo(username) {
    fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(data => {
        if (data.message === "Not Found") {
            alert("User not found");
            return;
        }
        // Clear any existing user info
        document.getElementsByClassName('user-box')[0].innerHTML = '';
        const userInfoBox = document.querySelector(".user-box");

        // Create user info div
        const userInfoDiv = document.createElement('div');
        userInfoDiv.classList.add('user-info');

        // Create profile section
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile');

        // Create avatar section
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar-section');

        const avatar = document.createElement('img');
        avatar.classList.add('avatar');
        avatar.src = data.avatar_url;
        avatar.alt = "User Avatar";
        avatarDiv.appendChild(avatar);

        const userDetails = document.createElement('div');
        userDetails.classList.add('user-details');

        const name = document.createElement('h2');
        name.classList.add('name');
        name.textContent = data.name || "No Name";

        const usernamePara = document.createElement('p');
        usernamePara.classList.add('username');
        usernamePara.textContent = `@${data.login}`;

        const bio = document.createElement('p');
        bio.classList.add('bio');
        bio.textContent = data.bio || "This profile has no bio";

        const joinedDate = document.createElement('p');
        joinedDate.classList.add('joined-date');
        joinedDate.textContent = `Joined ${new Date(data.created_at).toDateString()}`;

        // Append name and date joined together
        const nameAndDate = document.createElement('div');
        nameAndDate.classList.add('name-date-box')
        nameAndDate.appendChild(name);
        nameAndDate.appendChild(joinedDate);

        // Append user details to profile section
        userDetails.appendChild(nameAndDate);
        userDetails.appendChild(usernamePara);
        userDetails.appendChild(bio);

        // profileDiv.appendChild(avatar);
        profileDiv.appendChild(userDetails);

        // Create stats section
        const statsDiv = document.createElement('div');
        statsDiv.classList.add('stats');

        const statRepos = createStatItem('Repos', data.public_repos);
        const statFollowers = createStatItem('Followers', data.followers);
        const statFollowing = createStatItem('Following', data.following);

        statsDiv.appendChild(statRepos);
        statsDiv.appendChild(statFollowers);
        statsDiv.appendChild(statFollowing);

        // Create additional info section
        const additionalInfoDiv = document.createElement('div');
        additionalInfoDiv.classList.add('additional-info');

        const location = createInfoItem(data.location || "Not Available", "location");
        const blog = createInfoItem(data.blog || "Not Available", "blog");
        const twitter = createInfoItem(data.twitter_username ? `@${data.twitter_username}` : "Not Available", "twitter");
        const company = createInfoItem(data.company || "Not Available", "company");

        const locationXBox = document.createElement('div');
        const blogCompanyBox = document.createElement('div');
        locationXBox.classList.add('additional-info-box')
        blogCompanyBox.classList.add('additional-info-box')

        locationXBox.appendChild(location);
        locationXBox.appendChild(twitter);

        blogCompanyBox.appendChild(blog);
        blogCompanyBox.appendChild(company);

        additionalInfoDiv.appendChild(locationXBox);
        additionalInfoDiv.appendChild(blogCompanyBox);

        // Append all section to the user info div
        userInfoDiv.appendChild(profileDiv);
        userInfoDiv.appendChild(statsDiv);
        userInfoDiv.appendChild(additionalInfoDiv);

        // Append all sections to the user info box
        userInfoBox.appendChild(avatarDiv);
        userInfoBox.appendChild(userInfoDiv);

        // Append the user info box to the container
        // document.getElementById('user-info-container').appendChild(userInfoBox);
    })
    .catch(error => console.error('Error:', error));
}

// Helper functions to create reusable DOM elements
function createStatItem(label, value) {
    const statItem = document.createElement('div');
    statItem.classList.add('stat-item');

    const labelElem = document.createElement('p');
    labelElem.textContent = label;

    const valueElem = document.createElement('p');
    valueElem.classList.add('stat-value');
    valueElem.textContent = value;

    statItem.appendChild(labelElem);
    statItem.appendChild(valueElem);

    return statItem;
}

function createInfoItem(content, type) {
    const infoItemBox = document.createElement('div');
    infoItemBox.classList.add('info-item-box');

    const icon = document.createElement('img');

    if (type === 'location') {
        icon.src = '/assets/icon-location.svg';
        icon.alt = 'location alt';
    } else if (type === 'blog') {
        icon.src = '/assets/icon-website.svg';
        icon.alt = 'personal blog';
    } else if (type === 'company') {
        icon.src = '/assets/icon-company.svg';
        icon.alt = 'company';
    } else if (type === 'twitter') {
        icon.src = '/assets/icon-twitter.svg';
        icon.alt = 'twitter handle';
    }

    const infoItem = document.createElement('p');
    infoItem.textContent = content;

    infoItemBox.appendChild(icon);
    infoItemBox.appendChild(infoItem);

    return infoItemBox;
}