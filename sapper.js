let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let countBlock = 20;
let sizeBlock = 40;
let CB = 0.1;
let game = false;
let flag = false;
loseT = document.querySelector("h1")

const flagBTN = document.querySelector("#flag")
const lopataBTN = document.querySelector("#lopata")

let blocks = Array();

canvas.width = countBlock * sizeBlock;
canvas.height = countBlock * sizeBlock;

let bombImg = new Image();
let flagImg = new Image();

LoadBombImg()
LoadFlagImg()

async function LoadBombImg(){
    bombImg = await LoadImage("img/" + Math.floor(Math.random() * 21) + ".jpg");
}

async function LoadFlagImg(){
    flagImg = await LoadImage("img/flag.jpg");
}

function LoadImage(src){
    return new Promise (resolve =>{
        const image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
    })
}

let flagLopata = 1


flagBTN.onclick = function(){
    flagLopata = 0
    flagBTN.style.boxShadow = "12px 12px 2px 1px rgb(0, 0, 0)"
    lopataBTN.style.boxShadow = "0px 0px 0px 0px rgb(0, 0, 0)"
}

lopataBTN.onclick = function(){
    flagLopata = 1
    lopataBTN.style.boxShadow = "12px 12px 2px 1px rgb(0, 0, 0)"
    flagBTN.style.boxShadow = "0px 0px 0px 0px rgb(0, 0, 0)"
}


function plusOne(h,w) {

    if(h >=0 && h <= countBlock - 1 && w >= 0 && w < countBlock) {

        if(blocks[h][w].number != 9) {
           
            blocks[h][w].number++;
            
        }
    }
    
}


function start(sh,sw) {

    LoadBombImg()
    
    loseT.style.opacity = "0%"
    blocks = Array();
    
    for(let h = 0; h < countBlock; h++) {
        
        let wline = Array();
        for(let w = 0; w < countBlock; w++) {
            
            if(h == sh && w == sw) {
               
                wline.push({number:0, show:0});
                continue;
                
            }
            
            if(Math.random() < CB) {
               wline.push({number:9, show:0});
            } else {
                wline.push({number:0, show:0});
            }
            
        }
        
        blocks.push(wline);
        
    }
    
    for(let h = 0; h < countBlock; h++) {
        for(let w = 0; w < countBlock; w++) {
            if(blocks[h][w].number == 9) {
               
                plusOne(h,w-1);
                plusOne(h,w+1);
                plusOne(h-1,w);
                plusOne(h+1,w);
                plusOne(h-1,w-1);
                plusOne(h-1,w+1);
                plusOne(h+1,w-1);
                plusOne(h+1,w+1);
                
            }
        }
    }
    
    game = true;
    
}

function draw() {
    
    ctx.fillStyle = "#222";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    for(let h = 0; h < blocks.length; h++) {
        for(let w = 0; w < blocks[h].length; w++) {
        
            if(blocks[h][w].show) {
                
                if(blocks[h][w].number == 9) {
                
                    
                    ctx.drawImage(bombImg, w*sizeBlock, h*sizeBlock, 40, 40);
                    
                    continue;
                    
                }
                if (blocks[h][w].number == 10){
                        

                    ctx.drawImage(flagImg, w*sizeBlock, h*sizeBlock, 40, 40);
                    continue;
                }
                
                ctx.fillStyle = "#555";
                ctx.fillRect(w*sizeBlock,h*sizeBlock,sizeBlock,sizeBlock);
                
                if(blocks[h][w].number) {
                    
                    ctx.font = "32px serif";
                    ctx.fillStyle = "#ddd";
                    ctx.fillText(blocks[h][w].number, w*sizeBlock + 10, (h+1)*sizeBlock - 10);
                    
                   
                }
               
            }
            
        }
    }
    
    for(let t = 0; t < countBlock + 1; t++) {
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(0,t * sizeBlock);
        ctx.lineTo(canvas.width,t * sizeBlock);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(t * sizeBlock,0);
        ctx.lineTo(t * sizeBlock,canvas.height);
        ctx.stroke();
    }
}
setInterval(draw,25);

canvas.addEventListener('mousedown',function(event){
    
    
    let h = Math.floor((event.clientY/sizeBlock));
    let w = Math.floor((event.clientX/sizeBlock));
    
    if(!game) {
       start(h,w);
    }
    
    if (flagLopata == 1){
        if (blocks[h][w].number == 9) {
            game = false;
            Lose()
        }
        flag = false;
    }
    else{
        if (blocks[h][w].number == 9){
            flag = true
            blocks[h][w].number = 10

        }
        else{

            game = false;
            Lose()
        }
    }
    
    
    showBLock(h,w);
    
    
});

function showBLock(h,w) {



    blocks[h][w].show = 1;
    
    if (blocks[h][w].number != 0) {
        return;
    }
    
    checkZero(h,w-1);
    checkZero(h,w+1);
    checkZero(h-1,w);
    checkZero(h+1,w);
    
}

function checkZero(h,w) {
    
    if(h >=0 && h <= countBlock - 1 && w >= 0 && w < countBlock - 1) {
        if(!blocks[h][w].show) {
           showBLock(h,w);
        }   
    }
    
}


function Lose(){
    loseT.style.opacity = "100%"
}
