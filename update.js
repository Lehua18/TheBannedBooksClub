//initialize supabase
//import { decode } from 'base64-arraybuffer';
//const { decode } = require('base64-arraybuffer');

const {createClient} = window.supabase;
    const supabaseURL = "https://kjwtprjrlzyvthlfbgrq.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqd3RwcmpybHp5dnRobGZiZ3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODk5MDEsImV4cCI6MjA1NDE2NTkwMX0.4wA0k6qly4LPUYae2bQz1To1SImnS00WyB9n3zb6ejE";
    const supabase = createClient(supabaseURL, supabaseAnonKey);
    uploadedImg = null;


window.onload = async() => { //specify for profile vs edit profile
    console.log("running:", getSession());
    console.log(supabase);
    const session = await getSession();
    if (!session) {
        console.log("No active session found.");
        // return;
    }

    let userProfile = await getUserProfile(session);

    if (!userProfile || userProfile.length === 0) {
        console.log('No user profile found.');
        return;
    }
    console.log('User profile:', userProfile);


    if (userProfile) {
        const imgUrl = JSON.stringify(await supabase.storage.from('pfps').getPublicUrl(userProfile[0].username+'.png'));
        console.log(imgUrl);
        // const time = new Date().getTime();
        // let pic = await supabase.storage.from('pfps').getPublicUrl(userProfile[0].username+'.png'+`?t=${time}`);
        //
        // //   const email = document.getElementById("update-email").value;
        // const userId = pic.data[0].id;
        // document.getElementById("displayName-edit").value = await supabase.from('userRecords').select('displayName').eq('id', userId)[0];
        // document.getElementById("username-edit").value = await supabase.from('userRecords').select('username').eq('id', userId)[0];
        // document.getElementById("bioEdit").value = await supabase.from('userRecords').select('bio').eq('id', userId)[0];
        // document.getElementById("pronounsEdit").value = await supabase.from('userRecords').select('pronouns').eq('id', userId)[0];
        // document.getElementById("booksRead").value = await supabase.from('userRecords').select('booksRead').eq('id', userId)[0];
        // document.getElementById("dateJoined").value = "Joined "+await supabase.from('userRecords').select('dateJoined').eq('id', userId)[0]; //not .value?
        document.getElementById("displayName-edit").value = userProfile[0].displayName;
        document.getElementById("username-edit").textContent ="@"+userProfile[0].username;
        document.getElementById("bioEdit").value = userProfile[0].bio;
        document.getElementById("pronounsEdit").value = userProfile[0].pronouns;
        let dateInfo = await formatTimestamp(userProfile[0].created_at);
        document.getElementById("dateJoined").textContent = "Joined "+dateInfo.monthStr + " " +dateInfo.day +", "+dateInfo.year;
        const bioEdit = document.getElementById('bioEdit');
        if(getVisualLineCount(bioEdit)<10){
            bioEdit.rows = getVisualLineCount(bioEdit);
            bioEdit.style.height = bioEdit.scrollHeight+'px';
        }else{
            bioEdit.rows = 10;
            bioEdit.style.height = bioEdit.style.lineHeight*10+'px';
        }
        // document.getElementById("booksRead").textContent = userProfile[0].booksRead.stringify();
        // document.getElementById("dateJoined").textContent = "Joined "+ userProfile[0].dateJoined.stringify();


        // let imgPath = userProfile[0].pfp;
        // imgPath = imgPath.substring(71);
        // console.log("Image Path:", imgPath);
        // const img =  await supabase.storage.from('pfps').download(imgPath).then(({ data, error }) => {
        //
        //     if (error) {
        //         console.error('Error downloading file:', error);
        //     } else {
        //         console.log('File downloaded:', data);
        //     }
        // });
        // console.log(img);
        //  = userProfile[0].pfp;
        // console.log("Data:", data);
        userProfile = await getUserProfile(session);
        const timestamp = new Date().getTime(); // Unique value
        document.getElementById("profile-pic").src = imgUrl.substring(imgUrl.indexOf('h'), imgUrl.lastIndexOf("\""))+`?t=${timestamp}`;

        //document.getElementById("profile-pic").src = ;
         }
}
function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    console.log(regex.test(uuid));
    return regex.test(uuid);
}


//let session = null
async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.log('Error fetching session:', error);
        return null;
    }
    return session;
}


async function getUserProfile(){
    const {data: userProfile, error2} = await supabase.from('userRecords').select('*')
    if(error2){
        console.log('Error fetching user data:',error2);
        return null;
    }
    return userProfile;
}


async function fetchUpdatedUserProfile(userId) {
    const { data, error } = await supabase
        .from('userRecords')
        .select('id, displayName, bio, pronouns, pfp')
        .eq('id', userId);

    if (error) {
        console.error('Error fetching updated profile:', error);
        return null;
    }
    return data;
}
//add other non-image elements
async function updateUserProfile( userId, displayName, bio, pronouns) {
    console.log('Updating user profile for ID:', userId);
 //   console.log('Updating user profile for email:', email);
    console.log("userId is of type:", typeof userId);
    if(userId){
        // Perform the update without relying on .select() for now
        console.log('About to UPDATE');
        const jsonObject = {
            displayName: displayName,
            bio: bio,
            pronouns: pronouns,
            // pfp: pfp,
        };

// Converting to a JSON string if needed
        const jsonString = JSON.stringify(jsonObject);
        console.log(jsonString);
        console.log(jsonObject);
        console.log( 'Update', await supabase
            .from('userRecords')
            .update(jsonObject)
            .eq('id', userId));

        const {error} = await supabase
            .from('userRecords')
            .update(jsonObject)
            .eq('id', userId);

    }

    //return true;
}
const updateBtn=document.getElementById("submitProfile");
updateBtn?.addEventListener("click",async () => {

       console.log(supabase);
        const session = await getSession();
        if (!session) {
            console.log("No active session found.");
            // return;
        }

        let userProfile = await getUserProfile(session);

        if (!userProfile || userProfile.length === 0) {
            console.log('No user profile found.');
            return;
        }
        console.log('User profile:', userProfile);

        if (userProfile) {
            //   const email = document.getElementById("update-email").value;
            const displayName = document.getElementById("displayName-edit").value;
            const bio = document.getElementById("bioEdit").value;
            const pronouns = document.getElementById("pronounsEdit").value;
           // const pfp = document.getElementById("pfpEdit").value; //need to edit


            const userId = userProfile[0].id;
           // const email = userProfile[0].email;
            if (!userId) {
                console.log('No user ID found in session.');
                // return;
            }
            console.log('User ID: ' + userId)
            if (!isValidUUID(userId)) {
                console.error('Invalid UUID format:', userId); // Log error if invalid
                //  return; // Exit the function if userId is not valid
            }

            //Update image
            await supabase.auth.getSession()
            // const prePfp = await supabase.storage.from('pfps').download(await supabase.from('userRecords').select('pfp'));
            // const preImg = new Image();
            // const newImg = new Image();
            // preImg.src = prePfp;
            // newImg.src = document.getElementById('profile-pic').src;
            // const preBase64 = getBase64Image(preImg);
            // const newBase64 = getBase64Image(newImg)
            // if(preBase64 !== newBase64){
            //     const {data, error} = await supabase.storage.from('pfps').upload(preImg);
            //     const imgName = document.getElementById("pfpEdit").src;
            //     const imgUrl = supabase
            //         .storage
            //         .from('pfps')
            //         .getPublicUrl(imgName);

               // await supabase.from('userRecords').update({pfp: imgUrl /* image path from bucket */}).eq('id', userId);




            console.log('User profile:', userProfile);  //USER PROFILE PRINT 1
            await updateUserProfile( userId, displayName, bio, pronouns);

            const updatedProfile = await fetchUpdatedUserProfile(userId);
            console.log('Fetched Updated Profile:', updatedProfile);

            const newSessions = await supabase.auth.getSession();
            console.log('Session: ' + session); //SESSION PRINT 2
            //   console.log(await getUserProfile(sessions));
            console.log(await getUserProfile(newSessions));
            //   console.log('User profile after: ' + newUserProfile);
            //console.log('Data: ' + success);
            console.log('Session:', JSON.stringify(session)); // This will print the full session object
            console.log('User profile:', JSON.stringify(userProfile)); // Log profile properly

            if((`${document.referrer}`).includes("Signup")){
                window.location.href = 'Home.html';
            }else {
                window.location.href = 'Profile.html';
            }

        }

    }
);
// function getBase64Image(img) {
//     // Create an empty canvas element
//    // img.crossOrigin = 'Anonymous';
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//
//     // Copy the image contents to the canvas
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0);
//
//     // Get the data-URL formatted image
//     // Firefox supports PNG and JPEG. You could check img.src to
//     // guess the original format, but be aware the using "image/jpg"
//     // will re-encode the image.
//     const dataURL = canvas.getPublicUrl("image/png");
//
//     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
// }

document.getElementById('editPencil').addEventListener('click', async() => {
//     Start next
    let done = false;
    uploadedImg = null;
    const popup = await window.open('fileChooser.html', '_popup', 'popup');

    // while (!done) { //using all memory?
    //     console.log(uploadedImg);
    //     if (uploadedImg != null) {
    //         done = true;
    //     }
    // }
    const interval = setInterval(async() => {
        console.log(uploadedImg);
        if (uploadedImg != null) {
            done = true;
            clearInterval(interval); // Stop the loop once done
            await uploadImg();
        }
    }, 500); // Adjust the interval time (in milliseconds) as needed

    const session = await getSession();
    console.log(session);
    let userProfile = await getUserProfile(session);

});

async function uploadImg(){
    const session = await getSession();
    console.log(session);
    let userProfile = await getUserProfile(session);
        console.log("Uploaded img:", uploadedImg);
    console.log("Type:", uploadedImg.type);
        // const {data, error} = await supabase
        //     .storage
        //     .from('pfps')
        //     .upload(userProfile[0].username + '/png', new Image(uploadedImg));
     const uploadedImgFile = await base64ToFile(await toBase64(uploadedImg));
     console.log("Img string:",uploadedImgFile);
    if(!(uploadedImgFile instanceof File)){
        console.log(uploadedImgFile.type);
  }
    //const uploadedImgFile = uploadedImg instanceof File;
    const { data, error } = await supabase
        .storage
        .from('pfps')
        .upload(userProfile[0].username+'.png', uploadedImgFile, {
            cacheControl: '3600',
            upsert: true,
         //   contentType: "img/png"
        })
    if(error) {
        console.log('Error uploading img:', error);
    }
    // const imgUrl = JSON.stringify(await supabase.storage.from('pfps').getPublicUrl(userProfile[0].username+'.png'));
    // console.log(imgUrl);
    // const {data2, error2} = await supabase
    //     .from('userRecords')
    //     .update({pfp: imgUrl.substring(22,imgUrl.length-3)})
    //     .eq('id', userProfile[0].id);
    // if(error2){
    //     console.log('Error uploading img:', error2);
    // }
    userProfile = await getUserProfile(session);
    try{userProfile = await getUserProfile(session)}catch(error){console.log(error)};
    console.log("User Profile:",userProfile);
    //userProfile[0].pfp = uploadedImgFile;
    // let img = await supabase.storage.from('pfps').download(userProfile[0].username+'.png');
    const timestamp = new Date().getTime(); // Unique value
    console.log("uploadedimg",uploadedImg.name)
    userProfile[0].pfp = "https://kjwtprjrlzyvthlfbgrq.supabase.co/storage/v1/object/public/pfps/"+userProfile[0].username+'.png';
    const {data3,error3} = await supabase.from('userRecords').upsert({pfp: userProfile[0].pfp}).eq("id", userProfile[0].id);
    if(error3){
        console.log(error3);
    }
    const imgUrl = JSON.stringify(await supabase.storage.from('pfps').getPublicUrl(userProfile[0].username+'.png'));
    document.getElementById("profile-pic").src = imgUrl.substring(imgUrl.indexOf('h'), imgUrl.lastIndexOf("\""))+`?t=${timestamp}`;

    // await supabase.from('userRecords').update({pfp: imgUrl /* image path from bucket */}).eq('id', userId);
    // document.getElementById("profile-pic").src = await supabase.storage.from('pfps').download(userProfile[0].username+'.png');

}
async function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Extract base64
        reader.onerror = reject;
    });
}

async function base64ToFile(base64String, filename, mimeType) {
    const byteCharacters = atob(base64String); // Decode base64 to binary data
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const byteArray = new Uint8Array(Math.min(byteCharacters.length - offset, 1024));

        for (let i = 0; i < byteArray.length; i++) {
            byteArray[i] = byteCharacters[offset + i].charCodeAt(0);
        }

        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'image/png' });
    //console.log(blob);
    return new File([blob], filename, { type: 'image/png' });
}

const bioEdit = document.getElementById('bioEdit');
bioEdit.addEventListener('input', ()=>{
    console.log("COUNT", getVisualLineCount(bioEdit));
    if(getVisualLineCount(bioEdit)<10){
        bioEdit.rows = getVisualLineCount(bioEdit);
        bioEdit.style.height = bioEdit.rows*21+'px';
    }else{
        console.log('elsed')
        bioEdit.rows = 10;
        bioEdit.style.height = '210px';
       //bioEdit.style.height = bioEdit.style.lineHeight*10+'px';
    }
});




// function checkImgStatus(){
//
// }

// {if(true){document.getElementById("profile-pic").src = uploadedImg;}}


