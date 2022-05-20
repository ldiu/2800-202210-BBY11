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
    
    let timelinePosts = await posts.json();


    let userPosts = document.createElement('div');
    // parse through the timeline objects
    for (var i = 0; i < timelinePosts.length; i++) {
      let post = document.createElement('div');
      post.className = "post";
      post.id = timelinePosts[i]._id;
      console.log(timelinePosts[i]._id);

      //Create Header and add Date string from timeline and button
      let headerDivElement = document.createElement('div');

      // create edit button to show form for update
      let editButton = document.createElement('button');
      editButton.addEventListener("click", editPost);
      editButton.id = timelinePosts[i]._id;
      headerDivElement.className = "postheader";
      
      console.log(typeof timelinePosts[i].date)
      
      headerDivElement.innerHTML = timelinePosts[i].date;
      headerDivElement.appendChild(editButton);
      let timelineImages = timelinePosts[i].images;

      let imageContainerElement = document.createElement('div');
      imageContainerElement.className = "imageContainer";
      for (var x = 0; x < timelineImages.length; x++) {
        let imageDivElement = document.createElement('div');
        imageDivElement.className = "postImages";

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

  } catch (error) {
    console.log(error);
    document.getElementById("timeline").innerHTML = "There are no posts to display.";
  }
}

loadTimeline();

function editPost() {
  document.getElementById("postEdit").style.display = "block";
  let headerDataID = document.getElementById("postEditHeader");
  headerDataID.setAttribute("data-id", this.id);
  console.log("data id set");
}

function exitEdit() {
  document.getElementById("postEdit").style.display = "none";
}


//Submit function after editing a post. Code follows similar outline to "fetch-example" from 2537 course.
async function submitEditPost(data) { 
  console.log("this is " + data);
  try {
    console.log("submitEditPost was called");
    let responseObject = await fetch("/editOldPost", { 
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data),

    });
    console.log("Response object", responseObject);
    let parsedJSON = await responseObject.json();
    console.log("From the server", parsedJSON);

  } catch (error) {
    console.log(error);
  }
}

//Code follows similar outline to "fetch-example" from 2537 course.
document.getElementById("editPost").addEventListener("click", function (e) {
  let postHeaderElement = document.getElementById("postEditHeader");

  if (document.getElementById("newImg").value == "") {
    submitEditPost({
      text: document.getElementById("newTextInput").value,
      date: Date(),
      images: [{
        name: "",
        path: "noImageUploaded.jpg"
      }],
      _id: postHeaderElement.getAttribute("data-id")
    })
  } else {
  
  submitEditPost({
    text: document.getElementById("newTextInput").value,
    date: Date(),
    images: [{
      name: document.getElementById("newImg").files[0].name,
      path: document.getElementById("newImg").files[0].name
    }],
    _id: postHeaderElement.getAttribute("data-id")
  })
}
  console.log("Data was sent");
});

//From Instructor Arrons "upload-file" Example.
const form = document.getElementById("editForm");
form.addEventListener("submit", findImages);

function findImages(e) {

    const myImages = document.querySelector('#newImg');
    const newData = new FormData();

    for (let index = 0; index < myImages.files.length; index++) {
        
        newData.append("files", myImages.files[index]);
    }
    const methodBody = { 
        method: 'POST',
        body: newData, 
     
    };

    fetch("/saveImagePath", methodBody
    ).then(function (res) {
        console.log(res);
    }).catch(function (error) { ("Error message is:", error) }
    );
}


