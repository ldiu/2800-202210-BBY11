"use strict";

//The following code follows a demo represented by the instructor's in 1800 course Projects. 
function update() {
  
  document.getElementById("userFields").disabled = false;
}

async function loadTimeline() {
  try {
    let posts = await fetch("/getTimelinePosts", {
      method: 'GET'
    });
    if (posts.status === 200) {
      let timelinePosts = await posts.json();


      let userPosts = document.createElement('div');
      // parse through the timeline objects
      for (var i = 0; i < timelinePosts.length; i++) {
        let post = document.createElement('div');
        post.className = "post";

        //Create Header and add Date string from timeline and button
        let headerDivElement = document.createElement('div');
        let editButton = document.createElement('button');
        headerDivElement.className = "postheader";
        headerDivElement.innerHTML = timelinePosts[i].date;
        headerDivElement.appendChild(editButton);
        let timelineImages = timelinePosts[i].image;


        //Create Image Section adapted from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_slideshow
        let imageContainerElement = document.createElement('div');
        imageContainerElement.className = "imageContainer";
        for (var x = 0; x < timelineImages.length; x++) {
          let imageDivElement = document.createElement('div');
          imageDivElement.className = "postImages";
          imageDivElement.style = "";

          let imageElement = document.createElement('img');
          imageElement.src = timelineImages[x].path;
          imageDivElement.appendChild(imageElement);
          imageContainerElement.appendChild(imageDivElement);
  
        }

        //Create Body Section and add text field from timeline
        let bodyDivElement = document.createElement('div');
        bodyDivElement.className = "postbody";
        bodyDivElement.innerHTML = timelinePosts[i].text;

        post.append(headerDivElement, imageContainerElement, bodyDivElement);

        userPosts.append(post);
      }
      document.getElementById("timeline").appendChild(userPosts);
    } else {
      console.log(posts.status);
      console.log(posts.statusText);
    }
  } catch (error) {
    console.log(error);
    document.getElementById("timeline").innerHTML = "There are no posts to display.";
  }
}

loadTimeline();
