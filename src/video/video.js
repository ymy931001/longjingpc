import React from "react";
import {
  Layout,
} from "antd";
import "./Farmer.css";
import { getfarmerVideo,getGardenTotal} from "../axios";


const { Content,   } = Layout;



const role =localStorage.getItem("role");
const userID =localStorage.getItem("userID");

// const requireContext = require.context("./images", true, /^\.\/.*\.png$/);
// const images = requireContext.keys().map(requireContext);

class video extends React.Component {
  state = {
    gardenAddress:null,
    HLSurl:'',
    RTMPurl:'',
    videoData:[],
    videoItem:null,
    imgind:0,
    image:[],
    backStyle:{
      opacity:1,
      zIndex:999
    },
    menuStyle:{
      opacity:0,
      zIndex:0
    }
  };


  getgardendata=()=>{
    getGardenTotal()
    .then(res=>{
      console.log(res)
      for(let val of res.data.gardenInfo){
        if( val.userID==userID){
          this.setState({
            gardenAddress:val.address
          })
    
        }
      }
    })
  }

  initVideo=()=>{
    setTimeout(() => {
      var player = new window.EZUIPlayer("myPlayer");
    }, 100);
 
  }
  
  init=()=>{
    this.initVideo()
    this.setState({
      backStyle:{
        opacity:0,
        zIndex:0
      }
    })
  } 
  videoChange=(name,ind)=>{
    this.setState({
      imgind:ind,
      backStyle:{
        opacity:1,
        zIndex:999
      }
    })
    let video = document.getElementById('myPlayer')
    
    let videoEle = document.getElementById('videoEle')
    
    videoEle.removeChild(video)
    let newvideo=document.createElement("video");
    newvideo.id='myPlayer'
    newvideo.poster=""
    newvideo.controls=true
    newvideo.autoPlay=true
    let source1=document.createElement("source");
    let source2=document.createElement("source");
    
    this.state.videoData.forEach(res=>{
     
      if(res.videoName===name){
        source1.src=res.HLSurl
        source1.type=''
        source2.src=res.RTMPurl
        source2.type='application/x-mpegURL'
        newvideo.appendChild(source2)
        newvideo.appendChild(source1)
        videoEle.appendChild(newvideo)
      }
    })
  }


  componentWillMount() {
    this.getgardendata()
    getfarmerVideo({
      role,
      userID
    })
    .then(res=>{
      
      if(res.data.code===200){
        if(res.data.video.length>0){
          let item = res.data.video.map((val,ind)=>{
            return(
              <li className="menu-item"  onClick={()=>this.videoChange(val.videoName,ind)} key={ind}>{val.videoName}</li>
            )
          })
          let img= res.data.video.map(val=>{
            return val.img
          })
  
          this.setState({
            HLSurl:res.data.video[0].HLSurl,
            RTMPurl:res.data.video[0].RTMPurl,
            videoData:res.data.video,
            videoItem:item,
            image:img
          })
        }else{
          
        }
        // this.initVideo()
      }
    })
  }

  componentDidMount() {
    
  
  }





  render() {
    
    return (
      <Layout style={{ Height: "100vh"}} onMouseOver={()=>{
        this.setState({
          menuStyle:{
            opacity:1,
            zIndex:1000
          }
        })
      }} onMouseOut={()=>{
        this.setState({
          menuStyle:{
            opacity:0,
            zIndex:0
          }
        })
      }}>

        <Layout>
        {this.state.videoItem?
        <Content style={{ background:"#001529"}} id="Farmer">
          <div id="videoEle" >
              <video
                id="myPlayer"
                ref="video"
                poster=""
                controls
                playsInline
                webkit-playsinline="true"
                autoPlay
                style={{
                    
                    width: "100%",
                    height: "100%"
                }}
                >
                <source
                    src={this.state.RTMPurl}
                    type=""
                />
                <source
                    src={this.state.HLSurl}
                    type="application/x-mpegURL"
                />
              </video>
              <img src={this.state.image[this.state.imgind]} style={this.state.backStyle} className="videobackImg" onClick={this.init}  alt=""/>
            </div>
            <div className="videomenu" >
              
              <ul className="menu" style={this.state.menuStyle}>
                {this.state.videoItem}
              </ul> 
            </div>
            

          
            
            
          </Content>:
        <div className="video-error">暂无视频</div>
        }
          
        </Layout>
        <p className="gardenAddress">{this.state.gardenAddress}</p>
      </Layout>
    );
  }
}

export default video;
