const {createClient} = window.supabase;
const supabaseURL = "https://kjwtprjrlzyvthlfbgrq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3RwcmpybHp5dnRobGZiZ3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODk5MDEsImV4cCI6MjA1NDE2NTkwMX0.4wA0k6qly4LPUYae2bQz1To1SImnS00WyB9n3zb6ejE";
const supabase = createClient(supabaseURL, supabaseAnonKey);
//let postId = null;
const currentPage = document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.lastIndexOf("."));
let previousPage = localStorage.getItem('pageLast')
//allow for editing too?
document.getElementById('submitProfile').addEventListener('click', async() => {
    console.log('???')
    if(document.getElementById('title').value === "" || document.getElementById('postText').value === ""){
        //error
    }else{
        const session = await supabase.auth.getSession();
        console.log('gotit');
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
})