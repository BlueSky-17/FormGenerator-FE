import React from 'react'
import StorageIcon from '@material-ui/icons/Storage'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import { IconButton } from '@material-ui/core'
import MoreVertIcon from "@material-ui/icons/MoreVert"

import recentform from '../asset/17xIWXxEvbJg0l0EK-mbhPbC7vrjoFdMAHAIr0HEW2jc_400_1.png'
import "./Mainbody.css"

function Mainbody() {
    return (
        <div className='mainbody'>
            <div className="mainbody_top">
                <div className="mainbody_top_left" style={{fontSize:"16px", fontWeight:"500"}}>
                    Recent forms
                </div>
                <div className="mainbody_top_right">
                    <div className="mainbody_top_center" style={{fontSize:"16px", marginRight:"125px",fontWeight:"500"}}> Owned by anyone <ArrowDropDownIcon/>
                    </div>
                    <IconButton>
                        <StorageIcon style={{fontSize:"16px", color:"black"}} />
                    </IconButton>
                    <IconButton>
                        <FolderOpenIcon style={{fontSize:"16px", color:"black"}} />
                    </IconButton>
                </div>
            </div>
            <div className="mainbody_docs">
                <div className="doc_card">
                    <img src={recentform} alt="no_image" className="doc_image"/>
                    <div className="doc_card_content">
                        <div className="doc_content" style={{fontSize:"12px", color:"gray"}}>
                            <div className="content_left">
                                <StorageIcon style={{color:"white", fontSize:"16px", backgroundColor:"#6E2594", padding:"3px", borderRadius:"2px"}} />
                            </div>
                            <span style={{fontSize:"12px", color:"gray", paddingRight:"20px"}}>Opened 1 Sep 2023</span>
                            <MoreVertIcon style={{fontSize:"20px", color:"gray"}} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mainbody