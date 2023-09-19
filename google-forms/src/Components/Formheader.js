import React from "react"
import form_image from "../asset/ggforms_logo.png"
import { FiStar, FiSettings } from 'react-icons/fi'
import { AiOutlineEye } from "react-icons/ai"
import { IconButton } from '@material-ui/core'
import avatar_image from '../asset/avatar.jpg'
import { IoMdFolderOpen } from "react-icons/io"

import ColorLensIcon from '@material-ui/icons/ColorLens'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Button from "@material-ui/core/Button"
import Avatar from "@material-ui/core/Avatar"

import "./Formheader.css"

function Formheader() {
    return (
        <div className="form_header">
            <div className="form_header_left">
                <img src={form_image} alt="no_image" style={{ width: "30px" }} />
                <input type="text" placeholder="Untitled form" className="form_name"></input>
                <IoMdFolderOpen className="form_header_icon" style={{ marginRight: "10px" }}></IoMdFolderOpen>
                <FiStar className="form_header_icon" style={{ marginRight: "10px" }} />
                <span style={{ fontSize: "13px", fontWeight: "500" }}>All changes saved in Drive</span>
            </div>
            <div className="form_header_right">
                <IconButton>
                    <ColorLensIcon size="small" className="form_header_icon" />
                </IconButton>
                <IconButton>
                    <AiOutlineEye className="form_header_icon" />
                </IconButton>
                <IconButton>
                    <FiSettings className="form_header_icon" />
                </IconButton>

                <Button variant="contained" color="primary" href="#cotained-button">Send</Button>

                <IconButton>
                    <MoreVertIcon className="form_header_icon" />
                </IconButton>
                <IconButton>
                    <Avatar src={avatar_image} style={{height:"35px", width:"35px"}} className="form_header_icon" />
                </IconButton>
            </div>
        </div>
    )
}

export default Formheader