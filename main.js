const image= "backgroundImage.png"
const bg= document.querySelector(".hero-bg")
bg.style.backgroundImage=`url(${image})`


// modal
const modalOpen= document.getElementById("openModal");
const closeModal= document.getElementById("closeModal");
const modal= document.getElementById("gestureModal");
openModal.addEventListener("click",()=>{
    modal.style.display="flex"
}) 
closeModal.addEventListener("click",()=>{
    modal.style.display="none"
}) 
window.addEventListener("click",()=>{
    if(e.target===modal){ 
        modal.style.display="none"}
}) 
// video
const video=document.getElementById("video");
const status=document.getElementById("status");
const modelParams={
    flipHorizontal:true,
}
let model=null;
let lastCenterY=null;

handTrack.startVideo(video).then(function(ready){
    if(!ready){
        status.innerText="permita acesso a camera";
        return
    }
    handTrack.load(modelParams).then(m=>{
        model=m;
        status.innerText="modelo carregado-mova a mão!";
        runDetection()
    })
})
function runDetection(){
    model.detect(video).then(preds=>{
        console.log("executando")
        if(preds.length>0){
            const p=preds[0];
            const [x,y,w,h]=p.bbox
            const centerY=y+h/2
            let conf=0
            if(Array.isArray(p.score)){
                conf=p.score[0]||0
            }else if(typeof p.score==="number"){
                conf=p.score
            } else if(typeof p.classScore==="number"){
                conf=p.classScore
            }

            if(lastCenterY!==null){
                const dy =centerY-lastCenterY
                if(dy<-2){
                    window.scrollBy({top:-80,behavior:"smooth"})
                    status.innerText="rolando para cima"
                }
                if(dy>2){
                    window.scrollBy({top:80,behavior:"smooth"})
                    status.innerText="rolando para baixo"
                }
            }
            lastCenterY=centerY
        }else{
            status.innerText="Mão não detectada"
            lastCenterY=null
        }
        requestAnimationFrame(runDetection)
    })
}