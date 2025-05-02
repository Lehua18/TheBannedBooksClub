const {createClient} = window.supabase;
const supabaseURL = "https://kjwtprjrlzyvthlfbgrq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3RwcmpybHp5dnRobGZiZ3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODk5MDEsImV4cCI6MjA1NDE2NTkwMX0.4wA0k6qly4LPUYae2bQz1To1SImnS00WyB9n3zb6ejE";
const supabase = createClient(supabaseURL, supabaseAnonKey);
//const currentPage = document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.lastIndexOf("."));
const previousPage = document.referrer.substring(document.referrer.lastIndexOf("/") + 1); //edit on fix url
let postId = localStorage.getItem("postId"); //fix line
if(postId === null){
    console.log('postid',window.location.href)
    postId = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
}
//let postInfo;


window.addEventListener("load",async() => {
    await loadAllData();
    if(getVisualLineCount(reply,5)<5){
        reply.rows = getVisualLineCount(reply,5);
        reply.style.height = reply.rows*21+'px';
    }else{
        console.log('elsed')
        reply.rows = 5;
        reply.style.height = '105px';
        //bioEdit.style.height = bioEdit.style.lineHeight*10+'px';
    }
});
    // console.log('previospage',previousPage)
    // if(previousPage === null){ //handles refresh
    //     //check all tables for post or fix path so it includes thingie
    //     let tableCheck = await supabase.from("BookOfTheMonth").select('*')
    //     console.log('tablecheck', tableCheck);
    //     for(let i = 0; i < (await supabase.from("BookOfTheMonth").select('*',{ count: 'exact', head: true})).count; i++){
    //         if(tableCheck.data[i].eq('id', postId)){
    //             postInfo = tableCheck.data[i].eq('id', postId);
    //         }
    //     }
    // }else {

async function loadAllData(){
    //delete all previous children
    const parent = document.getElementById("replies");
    while(parent.childElementCount >0){
        parent.removeChild(parent.firstChild);
    }

        let postInfo = await supabase.from('forumPosts').select('*').eq('id', postId);
    console.log("post info",postInfo);
    const title = postInfo.data[0].title;
    document.getElementById("postTitle").innerHTML = purifyUserInput(title) + " | The Banned Books Club";
    document.getElementById("title").innerHTML = purifyUserInput(title);
    document.getElementById("postText").innerHTML = purifyUserInput(postInfo.data[0].text);
    // const clean = DOMPurify.sanitize('<b>hello there</b>');
    // console.log('Purified?',clean);
   // let userProfile = await getUserProfile(session);
   //  const originalPoster = await supabase.from(previousPage).select('originalPoster').eq('id', postId);
    const originalPosterData = await supabase.from("userRecords").select('*').eq('username', postInfo.data[0].originalPoster);
    console.log("originalPoster",originalPosterData);
    const timestamp = new Date().getTime(); // Unique value
    document.getElementById("profile-pic").src = originalPosterData.data[0].pfp +`?t=${timestamp}`;
    console.log('pfp', originalPosterData.data[0].pfp);
    document.getElementById("author").textContent = originalPosterData.data[0].displayName;
    document.getElementById("authorUser").textContent = "@"+ originalPosterData.data[0].username
    console.log('timestamp', originalPosterData.data[0].created_at)
    let dateInfo = await formatTimestamp(postInfo.data[0].created_at);
    console.log(dateInfo);
    document.getElementById('datePosted').innerHTML = `${dateInfo.dayOfWeek},<br>${dateInfo.monthStr} ${dateInfo.day}, ${dateInfo.year}<br>@${dateInfo.twelveHour}:${dateInfo.minute} ${dateInfo.am}`;
    document.getElementById("postAuthor").addEventListener('click', () =>{
        goToProfile(originalPosterData.data[0].id);
    });
    // document.getElementById("profile-pic").src = userProfile[0].pfp + `?t=${timestamp}`;
    // document.getElementById("author").textContent = userProfile[0].displayName;
    // document.getElementById("authorUser").textContent = "@" + userProfile[0].username;
    // console.log("title",title);
    // console.log("id",postId);
    // console.log(document.referrer);
    // console.log(previousPage);

    //loadcomments
    let commentsData = await supabase.from("postComments").select('*').eq('postId', `${postId}`);
   // console.log(await supabase.from("postComments").select('*'));
    // if(error){
    //     console.log("error",error)
    // }
    console.log("postid",`${postId}`);
    //start editing here
    console.log("commentsData",commentsData);
    for (let i = 1; i <=commentsData.data.length ; i++) {
        console.log('i',i)
        console.log(commentsData.data[i-1]);
            let comment = commentsData.data[i - 1];
            console.log("comment:" + comment)
            let content = comment.content;
            let posterUsername = comment.poster;
            let id = comment.id;
            let time = await formatTimestamp(comment.created_at);
            console.log('id', id);
// get name from object
            console.log('Author username', posterUsername);
            let posterData = await supabase.from('userRecords').select('*').eq('username', posterUsername);

            console.log("author data:"+posterData);
            let posterName = posterData.data[0].displayName;
            console.log("author name:" + posterName);
            const timestamp = new Date().getTime(); // Unique value
            // let profilePic = authorData.pfp
            console.log("pfp", posterData.data[0].pfp)
            let image = `${posterData.data[0].pfp}` + `?t=${timestamp}`;
            console.log("image:" + image)
            console.log('author', posterName);
        let replies = document.getElementById('replies');
           // if (document.getElementById("replies").childElementCount < 21) {//add code for next pages
                console.log('made it')
                await loadComment(image, content, posterName, i, replies, id, time,posterUsername);
                console.log("children", document.getElementById("replies").childElementCount);
            //}
        }
    //your comment has been posted pop up?
}
async function loadComment(image, content, author, i, replies, id, dateInfo,memberUsername) {
    author = purifyUserInput(author);
    content = purifyUserInput(content);
    memberUsername = purifyUserInput(memberUsername);//can member username even be used for malicious purposes w/ char restrictions?
    console.log(author, content);
    const postDiv = document.createElement("div");
    // postDiv.classList.add("replies");
    postDiv.classList.add("vstack");
    postDiv.id = `${i}`;
    replies.appendChild(postDiv);
    //postDiv.style.cssText ='width: 100%';
    postDiv.style.cssText ='align-items: start; width: 100%';
    postDiv.innerHTML = `
<hr style="width: 100%; margin-top: 2%; margin-bottom: 2%">
<div class="hstack" style="align-items: start">
    <div class="goToProfile" style="cursor: pointer; align-items: center">
    <div class="hstack " style="align-items: start; width: fit-content">
     <div class="vstack" style="align-items: center; margin-right: 10px">
       <img src= ${image} class="circularImage" width="55px" height="55px" style=" border-color: #303030; border-width: 2px; border-style: solid; margin-left: 5px" alt="Profile picture">
    
<!--       <div class="hstack">-->
   
       <b class="closeText" style="font-size: small; font-family: Boldonse, sans-serif; font-weight: normal; text-align: center">${author}</b>
       <p class="closeText" style="font-size: small; font-family: Lexend, sans-serif; font-weight: 300">@${memberUsername}</p>
       </div>
       <p class="closeText date" style=" text-align: center; margin-right: 0; width: 90px; margin-left: -15px">${dateInfo.dayOfWeek},<br>${dateInfo.monthStr} ${dateInfo.day},<br>${dateInfo.year}<br>@${dateInfo.twelveHour}:${dateInfo.minute} ${dateInfo.am}</p>
    </div>
    </div>
<!--    </div>-->
    <p class="closeText" style="text-align: start; font-size: 15px;"> ${content} </p>
</div>
    `;
    // document.getElementById("author").id = `author${i}`;

    postDiv.getElementsByClassName("goToProfile")[0].id = `author${i}`;
    console.log("Post:",postDiv.getElementsByClassName("goToProfile")[i]);
    document.getElementById(`author${i}`).addEventListener('click', async() => {
        console.log("clicked")
       let memberId = await supabase.from("userRecords").select('id').eq('username', memberUsername);
        console.log("id",memberId);
        goToProfile(memberId.data[0].id);
    });
    //(await postDiv != null);
    console.log(postDiv);

}

document.getElementById("submitBtn").addEventListener('click', async() =>{
    if(document.getElementById("commentTextBox").value != null){
        const session = await supabase.auth.getSession();
        if (!session) {
            console.log("No active session found.");
        }
        let userProfile = await getUserProfile(session);
        console.log("profile", userProfile);
        let content = document.getElementById("commentTextBox").value
        let forumId =  (await supabase.from("forumPosts").select("forumId").eq("id", postId)).data[0].forumId;
        const{data, error} = await supabase.from("postComments").insert({'postId': postId, 'forumId': forumId, 'poster': userProfile[0].username, 'content': content });
        if(error){console.log("error",error)}
        document.getElementById("commentTextBox").value = "";
        await loadAllData();

        //pop up "your comment has been saved"
    }else{
        //error?
    }
});

const reply = document.getElementById('commentTextBox');
reply.addEventListener('input', ()=>{
    console.log("COUNT", getVisualLineCount(reply,5));
    if(getVisualLineCount(reply,5)<5){
        reply.rows = getVisualLineCount(reply,5);
        reply.style.height = reply.rows*21+'px';
    }else{
        console.log('elsed')
        reply.rows = 5;
        reply.style.height = '105px';
        //bioEdit.style.height = bioEdit.style.lineHeight*10+'px';
    }
});



