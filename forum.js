const {createClient} = window.supabase;
const supabaseURL = "https://kjwtprjrlzyvthlfbgrq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3RwcmpybHp5dnRobGZiZ3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODk5MDEsImV4cCI6MjA1NDE2NTkwMX0.4wA0k6qly4LPUYae2bQz1To1SImnS00WyB9n3zb6ejE";
const supabase = createClient(supabaseURL, supabaseAnonKey);
//let postId = null;
const currentPage = document.URL.substring(document.URL.lastIndexOf("/") + 1);

window.addEventListener("load",async() => {
    // const userProfile = await fetchProfile(supabase);
    // console.log(userProfile);
    // caches.keys().then((cacheNames) => {
    //     cacheNames.forEach((cacheName) => {
    //         caches.delete(cacheName);
    //     });
    //server stuff -- fix later <<
    // });
//set page title and path
    //const path = window.location.pathname.replace(/\/forum\.html/, '') || "/";
    // const pages = {
    //     "/BookOfTheMonth": {title: "Book Of The Month"},
    //     "/BookChat": {title: "Book Chat"},
    //     "/NewsAndAnnouncements": {title: "News & Announcements"},
    //     "/WritersCorner": {title: "Writers Corner"},
    //     "/BookRecs": {title: "Book Recs"},
    //     //more?
    //
    // }
    // function getPathFromURL() {
    //     const params = new URLSearchParams(window.location.search);
    //     return params.get("path") || "/"; // Default to home if no path is found
    // }
    // function updatePage() {
    //     const path = getPathFromURL(); // Get path from URL
    //     const pageData = pages[path] || { title: "404 Not Found"};
    //     console.log("path", path);

    let currentPageSpaces = "";
    for(i=0; i<currentPage.length; i++) {

        if(currentPage[i] === currentPage[i].toUpperCase()) {
            currentPageSpaces += " ";
        }
        currentPageSpaces += currentPage.charAt(i);

    }
        document.getElementById("blogTitle").textContent = currentPageSpaces+" | The Banned Books Club"
        document.getElementById("page-title").textContent = currentPageSpaces;
    if(document.getElementById("posts").height >314){
        document.getElementById("posts").style.overflowY = "scroll";
    }
    // }
    // updatePage();
    // // Replace the URL to remove the 'path' query parameter
    // // Handle navigation dynamically
    // const basePath = "/BannedBooksClub/forum.html";
    // document.querySelectorAll("a").forEach(link => {
    //     link.addEventListener("click", function(event) {
    //         event.preventDefault(); // Prevent full-page reload
    //         const newPath = this.getAttribute("href");
    //         history.pushState({}, '', basePath + newPath); // Update URL without reload
    //         updatePage(); // Update content dynamically
    //     });
    // });

// Handle browser back/forward buttons
//     window.onpopstate = () => updatePage();
//     // const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname.split('/').slice(0, -1).join('/') + path; //Fix url
//     //
//     // history.replaceState({}, '', newUrl);
//     //
//     // //const pageData = pages[path] || { title: "404 Not found :(" };
//      //may need to edit upon fixing url
//     const path = getPathFromURL();
//     history.replaceState({}, '', window.location.origin + "/BannedBooksClub/forum.html" + path);>>


// load posts
    //console.log(document.URL);
   console.log("currentPage:"+currentPage);
    console.log('Type of currentPage:', typeof currentPage);
    console.log('Value of currentPage:', currentPage);

    console.log("running:", await supabase.auth.getSession());
    console.log(supabase);
    const session = await supabase.auth.getSession();
    if (!session) {
        console.log("No active session found.");
        // return;
    }
    let userProfile = await getUserProfile(session);
    console.log("Profile?",userProfile);

    //mod?
    if(currentPage === "NewsAndAnnouncements" || currentPage === "BookOfTheMonth"){
        if(!userProfile[0].moderator){
            document.getElementById("addPost").style.visibility = "hidden";
        }else{
            document.getElementById("addPost").style.visibility = "visible";
        }

    }else{
        document.getElementById("addPost").style.visibility = "visible";
    }
    // let userProfile = await getUserProfile(session);
    //get posts
    const table = await supabase.from('forumPosts').select('*')
    console.log('table', table);
    console.log("Count", (await supabase.from('forumPosts').select('*',{ count: 'exact', head: true})).count)
    let posts = document.getElementById('posts');
    sizing();
    for (let i = (await supabase.from('forumPosts').select('*', {count: 'exact', head: true})).count; i >0 ; i--) {
        console.log(table.data[i-1]);
        // console.log(currentPage)
        if (table.data[i - 1].forumId === currentPage) {
            console.log('working')
            let post = table.data[i - 1];
            console.log("post:" + post)
            let title = post.title;
            let text = post.text;
            let authorUsername = await supabase.from('forumPosts').select('originalPoster');
            let id = post.id;
            console.log('id', id);
// get name from object
            console.log('Author username', authorUsername.data[i - 1].originalPoster);
            let authorData = await supabase.from('userRecords').select('*').eq('username', authorUsername.data[i - 1].originalPoster);
            //console.log("author data:"+authorData);
            let authorName = authorData.data[0].displayName;
            console.log("author name:" + authorName);
            const timestamp = new Date().getTime(); // Unique value
            // let profilePic = authorData.pfp
            console.log("pfp", authorData.data[0].pfp)
            let image = `${authorData.data[0].pfp}` + `?t=${timestamp}`;
            console.log("image:" + image)
            console.log('author', authorData);
            // if (document.getElementById("posts").childElementCount < 21) { //add code for next pages
                await loadPost(image, title, text, authorName, i, posts, id);
            //     console.log("children", document.getElementById("posts").childElementCount);
            // }
        }
    }

});

async function loadPost(image,title, content, author, i, posts, id) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("posts");
    postDiv.classList.add("hstack");
    if(await supabase.from('userRecords').select('darkMode')){
        postDiv.classList.add("darkMode");
    }
    postDiv.id = `${i}`;
    posts.appendChild(postDiv);
    console.log("Lengths!", content.length, title.length)
    postDiv.style.cssText ='width: 100%; cursor: pointer; white-space: wrap';
    content = purifyUserInput(content);
    title = purifyUserInput(title);
    if(content.length > 200 ){
        content = content.substring(0,200)+"...";
    }
    if(title.length > 175){
        title = title.substring(0,175)+"...";
    }
    postDiv.innerHTML = `
<!--Maybe add in author?-->
       <img src= ${image} class="circularImage" style=" border-color: #303030; border-width: 2px; border-style: solid; margin-left: 5px; min-width: 54px; max-width: 54px; width: 54px; height: 54px" alt="Profile picture">
       <div class="vstack" style="align-items: start">
           <h3 class="closeText" style="font-size: larger; font-family: Lexend, sans-serif; font-weight: 400">${title}</h3>
           <p class="closeText" style="text-align: start; font-size: medium; font-family: Lexend, sans-serif; font-weight: 250"> ${content} </p> <!--Change to only show 200 chars?--> <!--fix on 4/9-->
    `;
    //(await postDiv != null);
    // for(j=0; j<document.getElementById(`${i}`).childElementCount; j++){
    //     if(document.getElementById(`${i}`)[j].tagName.toLowerCase() === "p"){
    //         document.getElementById(`${i}`)[j].id = "content"+ i;
    //     }
    // }
    // if(document.getElementById(`content+ ${i}`) != null){
    //     if(document.getElementById(`content+ ${i}`).l >
    //     document.getElementById(`content+${i}`).style.textOverflow = "ellipsis";
    // }
    // console.log(postDiv);
    document.getElementById(`${i}`).addEventListener('click', async() =>{
      //  postId = id;
        window.localStorage.setItem("postId", id);
        window.location.href = "Post.html?path=/"+id;
    });

}
document.getElementById("addPost").addEventListener('click', async() => {
    //console.log("well it got there at least")
    localStorage.setItem('pageLast', currentPage)
    window.location.href = "EditPost.html";
});

function sizing() {
    if (areTouching(document.getElementById('page-title'), document.getElementById("addPost"))) {
        console.log("MADE IT");
        console.log(document.getElementById('page-title').getBoundingClientRect().width);
        // document.getElementById("page-title").width = '40%';
        document.getElementById("page-title").style.width = "calc(80% - 80px)";
        console.log(document.getElementById('page-title').width);
    }else{
       document.getElementById("page-title").width = 'fit-content' ;
       document.getElementById("page-title").style.width = 'fit-content';
    }
    document.getElementById("headerDiv").style.minHeight = document.getElementById("page-title").offsetHeight + 10 + 'px';
    document.getElementById("headerDiv").offsetHeight = document.getElementById("page-title").offsetHeight + 10;
    console.log("OFFSET", document.getElementById("page-title").offsetHeight);
    console.log("OFFSET", document.getElementById("headerDiv").style.minHeight);
    // console.log("touching:",areTouching(document.getElementById('page-title'), document.getElementById("addPost")))

}

    window.addEventListener("resize", () => {
        sizing();
        if(areTouching(document.getElementById('page-title'), document.getElementById("addPost"))) {
            document.getElementById("page-title").style.width = "calc(80% - 80px)";
        }
        document.getElementById("headerDiv").style.minHeight = document.getElementById("page-title").offsetHeight + 10 + 'px';
        document.getElementById("headerDiv").offsetHeight = document.getElementById("page-title").offsetHeight + 10;
        console.log("OFFSET", document.getElementById("page-title").offsetHeight);
        console.log("OFFSET", document.getElementById("headerDiv").style.minHeight);
    });

function areTouching(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    console.log(rect1, rect2);

    return rect1.right > rect2.left
}

