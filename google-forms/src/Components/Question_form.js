import React, { useState, useEffect } from 'react'

import CropOriginalIcon from '@material-ui/icons/CropOriginal'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ShortTextIcon from '@material-ui/icons/ShortText'
import SubjectIcon from '@material-ui/icons/Subject'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { BsTrash } from 'react-icons/bs'
import { IconButton, MenuItem, Typography } from '@material-ui/core'
import FilterNoneIcon from '@material-ui/icons/FilterNone'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import { BsFileText } from 'react-icons/bs'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Button from '@material-ui/core/Button'
import { FcRightUp } from 'react-icons/fc'
import CloseIcon from '@material-ui/icons/Close'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import "./Question_form.css"

function Question_form() {
    const [questions, setQuestions] = useState(
        [{
            questionText: "Which is the capital city of Karnataka?",
            questionType: "radio",
            options: [
                { optionText: "Bengaluru" },
                { optionText: "Belgavi" },
                { optionText: "Hubli" },
                { optionText: "Mandya" },
            ],
            open: true,
            required: false
        }]
    )

    function questionUI() {
        return questions.map((ques, i) => (
            <div>
                <Accordion
                    expanded={questions[i].open}
                    className={questions[i].open ? 'add_border' : ""} >
                    {/* <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        elevation={1} style={{ width: "100%" }}
                    >
                        {questions[i].open ?
                            (
                                <div className='saved_questions'>

                                    <Typography>
                                        {i + 1}.{questions[i].questionText}
                                    </Typography>

                                    {ques.options.map((op, j) => (
                                        <div key={i}>
                                            <div style={{ display: "flex" }}>
                                                <FormControlLabel
                                                    style={{ marginLeft: "5px", marginBottom: "5px" }}
                                                    disabled
                                                    control={<input
                                                        type={ques.questionType}
                                                        color="primary"
                                                        style={{ marginRight: "5px" }}
                                                        required={ques.type}
                                                    />}
                                                    label={<Typography
                                                        style={{
                                                            fontFamily: 'Roboto, Arial, sans-serif',
                                                            fontSize: '15px',
                                                            fontWeight: '400',
                                                            // letterSpacing: '.2px',
                                                            // lineHeight: '20px',
                                                            color: '#202124'
                                                        }}
                                                    >
                                                        {ques.options[j].optionText}
                                                    </Typography>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )
                                    )}
                                </div>
                            )
                            : ""
                        }
                    </AccordionSummary> */}
                    <div className='question_boxes'>
                        <AccordionDetails className='add_question'>
                            <div className='add_question_top'>
                                <input type='text' className='question' placeholder='Question' value={ques.questionText}></input>
                                <CropOriginalIcon style={{ color: "#5f6368" }} />
                                <Select className="select" style={{ color: "#5f6368", fontSize: "13px" }}>
                                    <MenuItem id="text" value="text">
                                        <SubjectIcon style={{ marginRight: "10px" }} />
                                        Paragraph
                                    </MenuItem>
                                    <MenuItem id="checkbox" value="Checkbox">
                                        <CheckBoxIcon style={{ marginRight: "10px", color: "#70757a" }} checked />
                                        Checkboxes
                                    </MenuItem>
                                    <MenuItem id="radio" value="Radio">
                                        <Radio style={{ marginRight: "10px", color: "#70757a" }} checked />
                                        Multiple Choice
                                    </MenuItem>
                                </Select>
                            </div>

                            {ques.options.map((op, j) => (
                                <div className='add_question_body' key={j}>
                                    {
                                        (ques.questionType !== "text") ?
                                            <input type={ques.questionType} style={{ marginRight: "10px" }} /> :
                                            <ShortTextIcon style={{ marginRight: "10px" }} />
                                    }
                                    <div>
                                        <input type="text" className='text_input' placeholder='option' value={ques.options[j].optionText}></input>
                                    </div>

                                    <CropOriginalIcon style={{ color: "#5f6368" }} />

                                    <IconButton style={{ color: "#5f6368" }}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ))}

                            {ques.options.length < 5 ?
                                (
                                    <div className="add_question_body">
                                        <FormControlLabel
                                            style={{marginLeft:"0px"}}
                                            disabled
                                            control={
                                                (ques.questionType !== "text") ?
                                                    <input type={ques.questionType} style={{ marginRight: "10px" }} /> :
                                                    <ShortTextIcon style={{ marginRight: "10px" }} />
                                            }
                                            label={
                                                <div>
                                                    <input type="text" className='text_input' style={{ fontSize: "13px", width: "60px" }} placeholder='Add other'></input>
                                                    <Button size="small" style={{ textTransform: "none", color: "#4285f4", fontSize: "13px", fontWeight: "600" }}>Add Option</Button>
                                                </div>
                                            }
                                        />
                                    </div>
                                ) : ""
                            }

                            <div className='add_footer'>
                                <div className='add_question_bottom_left'>
                                    <Button size='small' style={{ textTransform: "none", color: "#4285f4", fontSize: "13px", fontWeight: "600" }}>
                                        <FcRightUp style={{ border: "2px solid #4285f4", padding: "2px", marginRight: "8px" }} />
                                        Answer Key
                                    </Button>
                                </div>
                                <div className='add_question_bottom'>
                                    <IconButton aria-label="Copy">
                                        <FilterNoneIcon />
                                    </IconButton>
                                    <IconButton aria-label="Delete">
                                        <BsTrash />
                                    </IconButton>
                                    <span style={{ color: "#5f6368", fontSize: "13px" }}>Required</span>
                                    <Switch name="checkedA" color='primary' checked />
                                    <IconButton>
                                        <MoreVertIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </AccordionDetails>

                        <div className='question_edit'>
                            <AddCircleOutlineIcon className='edit'/>
                            <OndemandVideoIcon className='edit' />
                            <CropOriginalIcon className='edit' />
                            <TextFieldsIcon className='edit' />
                        </div>
                    </div>
                </Accordion>
            </div>
        )
        )
    }

    return (
        <div>
            <div className='question_form'>
                <br></br>
                <div className='section'>
                    <div className='question_title_section'>
                        <div className='question_form_top'>
                            <input type="text" className='question_form_top_name' placeholder='Untitled document'></input>
                            <input type="text" className='question_form_top_desc' placeholder='Form description'></input>
                        </div>
                    </div>

                    {questionUI()}
                </div>
            </div>
        </div>
    )
}

export default Question_form
