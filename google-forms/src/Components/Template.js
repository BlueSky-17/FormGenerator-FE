/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import MoreVertIcon from "@material-ui/icons/MoreVert"
import { IconButton } from '@material-ui/core'
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore"
import "./Template.css"

import blank from "../asset/forms-blank-googlecolors.png"
import party from "../asset/1HNKwycLbuS5oLyO-_9WGFy6SDEEfS67wo6Bxp3jI5DY_400_1.png"
import contact from "../asset/1p-ycZA_Ihhg4WA8ccQN-eIFjVACGq7syHx0IWQMxLY0_400_1.png"

import uuid from "react-uuid"
import { useNavigate } from 'react-router-dom'

function Template() {
    const navigate = useNavigate();

    const createForm = () => {

        const id_ = uuid();
      // Sử dụng navigate để thực hiện điều hướng
        navigate('/form/'+id_);
    };

    return (
        <div className="template_section">
            <div className="template_top">
                <div className="template_left">
                    <span style={{fontSize:"16px", color:"#202124", fontWeight:"500"}}>Start New Form</span>
                </div>
                <div className="template_right">
                    <div className="gallery_button" >
                        <span style={{fontWeight:"500"}}>Template gallery</span>
                        <UnfoldMoreIcon fontSize="small"/>
                    </div>
                    <IconButton>
                        <MoreVertIcon fontSize="small"/>
                    </IconButton>
                </div>
            </div>
            <div className="template_body">
                <div className='card' onClick={createForm}>
                    <img src={blank} alt="no image" className="card_image"/>
                    <p className="card_title"> Blank </p>
                </div>
                <div className='card'>
                    <img src = {party} alt="no image" className="card_image"/>
                    <p className="card_title"> Party Invite  </p>
                </div>
                <div className='card'>
                    <img src = {contact} alt="no image" className="card_image" />
                    <p className="card_title"> Contact Infomation </p>
                </div>
            </div>
        </div>
    )
}

export default Template