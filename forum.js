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
    // let userProfile = await getUserProfile(session);
    const table = await supabase.from('forumPosts').select('*')
    console.log('table', table);
    console.log("Count", (await supabase.from('forumPosts').select('*',{ count: 'exact', head: true})).count)
    let posts = document.getElementById('posts');
    for (let i = (await supabase.from('forumPosts').select('*', {count: 'exact', head: true})).count; i >0 ; i--) {
        console.log(table.data[0]);
        console.log(currentPage)
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
            if (document.getElementById("posts").childElementCount < 21) { //add code for next pages
                await loadPost(image, title, text, authorName, i, posts, id);
                console.log("children", document.getElementById("posts").childElementCount);
            }
        }
    }
});

async function loadPost(image,title, content, author, i, posts, id) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("posts");
    postDiv.classList.add("hstack");
    postDiv.id = `${i}`;
    posts.appendChild(postDiv);
    postDiv.style.cssText ='width: 100%; cursor: pointer';
    postDiv.innerHTML = `
<!--Maybe add in author?-->
       <img src= ${image} class="circularImage" width="50px" height="50px" style=" border-color: #303030; border-width: 1px; border-style: solid; margin-left: 5px" alt="Profile picture">
       <div class="vstack" style="align-items: start">
           <h3 class="closeText" style="font-size: larger;">${title}</h3>
           <p class="closeText" style="text-align: start; font-size: medium;"> ${content} </p> <!--Change to only show 200 chars?-->
    `;
    //(await postDiv != null);
    console.log(postDiv);
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

