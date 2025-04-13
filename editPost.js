const {createClient} = window.supabase;
const supabaseURL = "https://kjwtprjrlzyvthlfbgrq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3RwcmpybHp5dnRobGZiZ3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODk5MDEsImV4cCI6MjA1NDE2NTkwMX0.4wA0k6qly4LPUYae2bQz1To1SImnS00WyB9n3zb6ejE";
const supabase = createClient(supabaseURL, supabaseAnonKey);
//let postId = null;
const currentPage = document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.lastIndexOf("."));
let previousPage = localStorage.getItem('pageLast')
window.addEventListener('load', ()=>{
    console.log("COUNT", getVisualLineCount(contentEdit));
    if(getVisualLineCount(contentEdit)<10){
        contentEdit.rows = getVisualLineCount(contentEdit);
        contentEdit.style.height = contentEdit.rows*21+'px';
    }else{
        console.log('elsed')
        contentEdit.rows = 10;
        contentEdit.style.height = '210px';
        //bioEdit.style.height = bioEdit.style.lineHeight*10+'px';
    }
})
//allow for editing too?
document.getElementById('submitProfile').addEventListener('click', async() => {
    // console.log('???')
    if(document.getElementById('title').value === "" || document.getElementById('postText').value === ""){
        document.getElementById("error-msg").innerText = "Please fill out all fields"
    }else{
        const session = await supabase.auth.getSession();
        if (!session) {
            console.log("No active session found.");
        }
        let userProfile = await getUserProfile(session);
        console.log("profile", userProfile);
        let title = document.getElementById("title").value;
        let content = document.getElementById("postText").value
        let forumId =  previousPage; //fix to allow for refresh and stuff
        const{data, error} = await supabase.from("forumPosts").insert({'title': title, 'forumId': forumId, 'originalPoster': userProfile[0].username, 'text': content });
        let timestamp = new Date().getTime();
        if(error){console.log("error",error)}
        let id = ((await supabase.from("forumPosts").select('*').order('created_at', {ascending: false})).data[0].id);
        console.log(id);

        window.location.href = "Post.html?path=/"+id;
    }
});

const contentEdit = document.getElementById('postText');
contentEdit.addEventListener('input', ()=>{
    // const value = contentEdit.value;
    // contentEdit.value = '';
    // contentEdit.value = value;
    console.log("COUNT", getVisualLineCount(contentEdit));
    if(getVisualLineCount(contentEdit)<5){
        contentEdit.rows = getVisualLineCount(contentEdit);
        contentEdit.style.height = contentEdit.rows*21+'px';
    }else{
        console.log('elsed')
        contentEdit.rows = 5;
        contentEdit.style.height = '105px';
        //bioEdit.style.height = bioEdit.style.lineHeight*10+'px';
    }
});
// const reply = document.getElementById('');
// bioEdit.addEventListener('input', ()=>{
//     console.log("COUNT", getVisualLineCount(bioEdit));
//     if(getVisualLineCount(bioEdit)<10){
//         bioEdit.rows = getVisualLineCount(bioEdit);
//         bioEdit.style.height = bioEdit.scrollHeight+'px';
//     }else{
//         console.log('elsed')
//         bioEdit.rows = 10;
//         //bioEdit.style.height = bioEdit.style.lineHeight*10+'px';
//     }
// });
//
// function getVisualLineCount(textarea) {
//     const style = window.getComputedStyle(textarea);
//     console.log('Style',style)
//     const lineHeight = parseFloat(textarea.style.lineHeight);
//     console.log('lineheight',lineHeight);
//     const height = textarea.scrollHeight;
//     console.log('height',height);
//
//     return Math.floor(height / lineHeight);
// }