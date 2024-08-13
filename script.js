console.log("lets start with javascript");
let currentSong=new Audio();
let songs;
let currfolder;
function convertSeconds(seconds) {
    const totalSeconds = Math.floor(seconds); // Ignore the fractional part
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const remainingSeconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}
async function getsongs(folder){
    currfolder=folder;
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    // console.log (response); 
    let div=document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
     songs= []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href.split(`/${currfolder}/`)[1])
        }
        
    }
    
    let songUL=document.querySelector(".songlist").getElementsByTagName("ol")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML= songUL.innerHTML+ `<li>

                            <img class="invert" src="svg/music.svg" alt="" width="20px" height="20px">
                            <div class="info scrollable-text">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Arjit Singh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                            <img class="invert" src="svg/play.svg" alt="">
                            </div>
                             </li>`   
                             
        
    }
    console.log(songs[0]);
    playMusic(songs[0])
    //Atach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })
    return songs
}
const playMusic =(track,pause=false)=>{
    // let audio=new Audio("/songs/" + track)
    currentSong.src=`/${currfolder}/` + track
    play.src="svg/play.svg"
    if(!pause){
        currentSong.play()
        play.src="svg/pause.svg"
    }
    
    
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"

    
}
async function displayAlbums() {
    let a=await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    // console.log (response); 
    let div=document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if(e.href.includes("/songs/"))
        {
            console.log(e.href.split("/"));
            let folder=(e.href.split("/").slice(-1)[0])
            //get the meta deta of folder
            let a=await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response.type);
            if(response.type=="ArtistCard")
            {
            let cardcontainer=document.querySelector(`.${response.type}`)
            cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
            <div>
                <img class="cardimage" src="/songs/${folder}/cover.jpg" alt="">
                <div  class="play-button">
                       <img class="play-button-img" src="svg/playbutton.svg" alt="play" >
                </div>
            </div>
            <h4 class="artist-name">${response.title}</h4>
            <h5 class="artist">${response.description}</h5>

            </div>`
            }
            else
            {
                let cardcontainer=document.querySelector(`.${response.type}`)
            cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card2">
            <div>
                <img class="card2image" src="/songs/${folder}/cover.jpg" alt="">
                <div  class="play-button">
                       <img class="play-button-img" src="svg/playbutton.svg" alt="play" >
                </div>
            </div>
            <h4 class="artist-name">${response.title}</h4>
            <h5 class="artist">${response.description}</h5>

            </div>`
            }
            
        }
    }
    //load play list on card click
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs =await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            console.log(songs);
        })
    })
    Array.from(document.getElementsByClassName("card2")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs =await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            console.log(songs);
        })
    })
    // console.log(anchors)
    
}
async function main()
{
    
    await getsongs("songs/arjit-singh")
    playMusic(songs[0],true)
    console.log(songs)


    //display all the album on the page
    displayAlbums();


//atach an event listener to play,next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="svg/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="svg/play.svg"
        }
    })
    //listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${convertSeconds(currentSong.currentTime)} / ${

        convertSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration)*100 +"%"
    })
    //add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        
        document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100+"%"
        currentSong.currentTime=(currentSong.duration*(e.offsetX/e.target.getBoundingClientRect().width))
        
    })
    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left=0
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left=-120+"%"
    })
    
    //add event listener on prev and next
    previous.addEventListener("click",()=>{
        console.log("prev clicked")
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        console.log(index)
        if((index-1)>=0)
        playMusic(songs[index-1])
        if((index-1)<0)
        playMusic(songs[index])
        
    })
    next.addEventListener("click",()=>{
        // console.log("next clicked")
        // console.log(songs)
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        // console.log(index)
        if((index+1)<songs.length)
        playMusic(songs[index+1])
        if((index+1)>songs.length)
        playMusic(songs[index])
        
    })
    // event listener for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        // console.log(e.target.value);
        currentSong.volume=parseInt(e.target.value)/100
    })
    //add event listener to mute track
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("svg/volume.svg")){
            e.target.src =e.target.src.replace("svg/volume.svg","svg/mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src =e.target.src.replace("svg/mute.svg","svg/volume.svg")
            currentSong.volume=.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })

    let maxheight="240px";
    let maxheight2="260px";
    document.querySelector(".popularartist").getElementsByTagName("h5")[0].addEventListener("click", function() {
            // Action to perform when any "show all" is clicked
            console.log("clicked")
            let element=document.querySelector(".ArtistCard")
            if(element.style.maxHeight ==="none")
                {
                    console.log("none")
                element.style.maxHeight=maxheight;
                
                }
            else 
                {
                element.style.maxHeight="none";
                
            }
            
            
        });
        document.querySelector(".popularalbum").getElementsByTagName("h5")[0].addEventListener("click", function() {
            // Action to perform when any "show all" is clicked
            console.log("clicked")
            let element=document.querySelector(".albumcard")
            if(element.style.maxHeight ==="none")
                {
                    console.log("none")
                element.style.maxHeight=maxheight;
                
                }
            else 
                {
                element.style.maxHeight="none";
                
            }
            
            
        });
}
main()
