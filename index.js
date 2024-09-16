document.body.classList.add("dark-mode");

// how to the ability to search when the user press enter/return button
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        document.querySelector('.search-btn').click();
    }
});

document.getElementsByClassName("themes")[0].addEventListener("click", (e) => {
  if (document.body.classList.contains("light-mode")) {
    document.body.classList.replace("light-mode", "dark-mode");
    document.getElementsByClassName("mode")[0].innerHTML = "LIGHT";
  } else {
    document.body.classList.replace("dark-mode", "light-mode");
    document.getElementsByClassName("mode")[0].innerHTML = "DARK";
  }
});

document.querySelector(".search-btn").addEventListener("click", () => {
  const inputText = document.querySelector(".search-input").value;
  getUserInfo(inputText);
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

searchInput.addEventListener("input", toggleButtonState);

toggleButtonState();

//get user info
function getUserInfo(username) {
    fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((data) => {
        if (data.message === "Not Found") {
            alert("User not found");
            return;
        }
        // Clear any existing user info
            // document.getElementsByClassName("user-box")[0].innerHTML = "";
        const container = document.getElementsByClassName("container")[0];
        const userInfoBox = document.createElement("div");
        userInfoBox.classList.add("user-box");
        // const userInfoBox = document.querySelector(".user-box");

        // Create user info div
        const userInfoDiv = document.createElement("div");
        userInfoDiv.classList.add("user-info");

        // Create profile section
        const profileDiv = document.createElement("div");
        profileDiv.classList.add("profile");

        // Create avatar section
        const avatarDiv = document.createElement("div");
        avatarDiv.classList.add("avatar-section");

        const avatar = document.createElement("img");
        avatar.classList.add("avatar");
        avatar.src = data.avatar_url;
        avatar.alt = "User Avatar";
        avatarDiv.appendChild(avatar);

        const userDetails = document.createElement("div");
        userDetails.classList.add("user-details");

        const name = document.createElement("h2");
        name.classList.add("name");
        name.textContent = data.name || "No Name";

        const usernamePara = document.createElement('a');
        usernamePara.classList.add('username');
        usernamePara.href = `https://github.com/${username}`;
        usernamePara.target = '_blank';
        usernamePara.textContent = `@${data.login}`;

        const bio = document.createElement("p");
        bio.classList.add("bio");
        bio.textContent = data.bio || "This profile has no bio";

        const joinedDate = document.createElement("p");
        joinedDate.classList.add("joined-date");
        joinedDate.textContent = `Joined ${new Date(
            data.created_at
        ).toDateString()}`;

        // Append name and date joined together
        const nameAndDate = document.createElement("div");
        nameAndDate.classList.add("name-date-box");
        nameAndDate.appendChild(name);
        nameAndDate.appendChild(joinedDate);

        // Append user details to profile section
        userDetails.appendChild(nameAndDate);
        userDetails.appendChild(usernamePara);
        userDetails.appendChild(bio);

        // profileDiv.appendChild(avatar);
        profileDiv.appendChild(userDetails);

        // Create stats section
        const statsDiv = document.createElement("div");
        statsDiv.classList.add("stats");

        const statRepos = createStatItem("Repos", data.public_repos);
        const statFollowers = createStatItem("Followers", data.followers);
        const statFollowing = createStatItem("Following", data.following);

        statsDiv.appendChild(statRepos);
        statsDiv.appendChild(statFollowers);
        statsDiv.appendChild(statFollowing);

        // Create additional info section
        const additionalInfoDiv = document.createElement("div");
        additionalInfoDiv.classList.add("additional-info");

        const location = createInfoItem(
            data.location || "Not Available",
            "location"
        );
        const blog = createInfoItem(data.blog || "Not Available", "blog");
        const twitter = createInfoItem(
            data.twitter_username ? `@${data.twitter_username}` : "Not Available",
            "twitter"
        );
        const company = createInfoItem(
            data.company || "Not Available",
            "company"
        );

        const locationXBox = document.createElement("div");
        const blogCompanyBox = document.createElement("div");
        locationXBox.classList.add("additional-info-box");
        blogCompanyBox.classList.add("additional-info-box");

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
        // clear any existing user info
            // document.getElementsByClassName("user-box")[0].innerHTML = "";
        if (document.getElementsByClassName("user-box")[0]) {
            // delete all existing divs with class name "user-box", there might be more than one
            const userBoxes = document.getElementsByClassName("user-box");
            for (let i = 0; i < userBoxes.length; i++) {
                userBoxes[i].remove();
            }
        }
                    
        // Append the user info box to the body
        // clear any existing user info
        if (container.getElementsByClassName("user-box").length > 0) {
            container.getElementsByClassName("user-box")[0].remove();
            }
        // append the user info box to the container
        container.appendChild(userInfoBox);
        // document.getElementById('user-info-container').appendChild(userInfoBox);
        })
        .catch((error) => console.error("Error:", error));
}

// Helper functions to create reusable DOM elements
function createStatItem(label, value) {
  const statItem = document.createElement("div");
  statItem.classList.add("stat-item");

  const labelElem = document.createElement("p");
  labelElem.textContent = label;

  const valueElem = document.createElement("p");
  valueElem.classList.add("stat-value");
  valueElem.textContent = value;

  statItem.appendChild(labelElem);
  statItem.appendChild(valueElem);

  return statItem;
}

function createInfoItem(content, type) {
    const infoItemBox = document.createElement("div");
    infoItemBox.classList.add("info-item-box");

    const icon = document.createElement("img");
    const iconInfo = getIconInfo(type);

    icon.src = iconInfo.src;
    icon.alt = iconInfo.alt;

    const href = type === "location" || type === "company" ? null : type === "blog" ? content : `https://twitter.com/${content}`;
    const infoItem = getInfoItemElement(type, content, href);

    if (href) {
        infoItem.classList.add("link");
    }
    
    infoItemBox.addEventListener("click", (e) => {
        if (href) {
            window.open(href, '_blank');
        }
    });

    infoItemBox.appendChild(icon);
    infoItemBox.appendChild(infoItem);

    return infoItemBox;
}

function getInfoItemElement(type, content, href = null) {
    // given the type of the element, return the element
    switch (type) {
        case "location":
            const location = document.createElement("p");
            location.textContent = content;
            return location;
        case "blog":
            const blog = document.createElement("a");
            blog.href = content;
            blog.target = "_blank";
            blog.textContent = content;
            blog.classList.add('username')
            return blog;
        case "company":
            const company = document.createElement("p");
            company.textContent = content;
            return company;
        case "twitter":
            const twitter = document.createElement("a");
            twitter.href = href;
            twitter.target = "_blank";
            twitter.textContent = content;
            twitter.classList.add('username')
            return twitter;
    }
}

function getIconInfo(type) {
  const iconMap = {
    location: { src: "/assets/icon-location.svg", alt: "Location" },
    blog: { src: "/assets/icon-website.svg", alt: "Personal Blog" },
    company: { src: "/assets/icon-company.svg", alt: "Company" },
    twitter: { src: "/assets/icon-twitter.svg", alt: "Twitter Handle" },
  };

  return iconMap[type] || { src: "", alt: "" };
}
