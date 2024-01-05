import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Drawer,
  Avatar,
  IconButton,
  Toolbar,
  List,
  Divider,
  Icon,
  Grid,
} from "@mui/material";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import Input from "@mui/material/Input";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import TextField from "@mui/material/TextField";
import { useParams } from "react-router-dom";

import {
  Response,
  ResultMultiChoice,
  ResultShortText,
  ResultDate,
  ResultLinkedData,
  ResultFile,
  ResultTable,
} from "./interface";
import { stringify } from "querystring";
import PropTypes from "prop-types";

interface FormResponseProps {
  Answer: any;
  Form: any;
}

const FormResponse: React.FC<FormResponseProps> = ({ Answer, Form }) => {
  // render: use to re-render after create or delete form
  const [render, setRender] = useState(false);

  const [formDetail, setFormDetail] = useState<any>(Form);
  const [formResponses, setFormResponse] = useState<any[]>(Answer.Responses);

  // Lưu giá trị cho các field dạng multi-choic
  const shouldDisableCheckbox = (ques: number, index: number): boolean => {
    const maxAllowed = formResponses[ques].content.multiChoice.maxOptions; // Set your maximum number of allowed checked boxes
    const phanTuTrue = formResponses[ques].content.multiChoice.result.filter(
      (giaTri) => giaTri === true
    ); //Return array have true value
    return phanTuTrue.length >= maxAllowed;
  };

  const [firstField, setFirstField] = useState("");
  const handleFirstFieldChange = (ques: number) => (e) => {
    setFirstField(e.target.value);
    setSecondField("");
    setThirdField("");

    const firstChoice =
      formDetail.Questions[ques].Content.LinkedData.ListOfOptions[
        e.target.value
      ].Key;
    formResponses[ques].content.linkedData.push(firstChoice);
  };

  const [secondField, setSecondField] = useState("");
  const handleSecondFieldChange = (ques: number) => (e) => {
    setSecondField(e.target.value);
    setThirdField("");

    const secondChoice =
      formDetail.Questions[ques].Content.LinkedData.ListOfOptions[firstField]
        .Value[e.target.value].Key;
    formResponses[ques].content.linkedData.push(secondChoice);
  };

  const [thirdField, setThirdField] = useState("");
  const handleThirdFieldChange = (ques: number) => (e) => {
    setThirdField(e.target.value);

    const thirdChoice =
      formDetail.Questions[ques].Content.LinkedData.ListOfOptions[firstField]
        .Value[secondField].Value;
    formResponses[ques].content.linkedData.push(thirdChoice);
  };

  const [height, setHeight] = useState("100%");

  console.log(formResponses);
  console.log(formDetail);

  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#E9F2F4",
          border: "2px solid #DEDEDE",
          height: { height },
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            border: "2px solid #DEDEDE",
            borderRadius: "10px",
            marginX: "15vw",
            marginTop: "30px",
          }}
        >
          {/* Header of Form */}
          <Box
            sx={{
              textAlign: "center",
              backgroundColor: "#008272",
              paddingY: "30px",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <Typography
              sx={{ color: "white", padding: "15px", fontWeight: 600 }}
              variant="h4"
              noWrap
              component="div"
            >
              {Object.keys(formDetail).length !== 0
                ? formDetail.header.Title
                : null}
            </Typography>
            <Typography
              sx={{ color: "white", padding: "5px", fontWeight: 400 }}
              variant="body1"
              noWrap
              component="div"
            >
              {Object.keys(formDetail).length !== 0
                ? formDetail.header.Description
                : null}
            </Typography>
          </Box>

          <Divider />

          {/* Body of Form | In case: Unsubmit form */}
          <Box sx={{ margin: "60px" }}>
            {formDetail.Questions !== undefined
              ? formDetail.QuestionOrder.map((ques, index) => (
                  <Box key={index} sx={{ marginY: "15px" }}>
                    {/* Câu hỏi */}
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{
                          color: "#008272",
                          justifySelft: "left",
                          paddingTop: "10px",
                          fontWeight: 500,
                        }}
                        variant="h5"
                        noWrap
                        component="div"
                      >
                        {index + 1}. {formDetail.Questions[ques].Question}
                      </Typography>
                      {formDetail.Questions[ques].Required && (
                        <Typography sx={{ color: "red", fontSize: "18px" }}>
                          *
                        </Typography>
                      )}
                    </Box>

                    {/* Nội dung | Dạng câu hỏi */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        marginX: "30px",
                        marginY: "15px",
                      }}
                    >
                      {formDetail.Questions[ques].Type === "multi-choice" ? (
                        <Box>
                          <FormControl>
                            <RadioGroup
                              key={index}
                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue="female"
                              name="radio-buttons-group"
                            >
                              {formDetail.Questions[
                                ques
                              ].Content.MultiChoice.Options.map(
                                (item, index) => (
                                  <FormControlLabel
                                    key={index}
                                    value={item}
                                    control={<Radio />}
                                    label={item}
                                  />
                                )
                              )}
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      ) : null}
                      {formDetail.Questions[ques].Type === "dropdown" ? (
                        <Box>
                          <FormControl fullWidth>
                            <Select>
                              {formDetail.Questions[
                                ques
                              ].Content.MultiChoice.Options.map(
                                (item, index) => (
                                  <MenuItem key={index} value={index}>
                                    {item}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Box>
                      ) : null}
                      {formDetail.Questions[ques].Type === "checkbox" ? (
                        <Box>
                          {formResponses[ques].Content.MultiChoice
                            .Constraint === "at-most" ? (
                            <Typography
                              sx={{ color: "gray", paddingBottom: "10px" }}
                            >
                              Vui lòng chọn tối đa{" "}
                              {
                                formResponses[ques].Content.MultiChoice
                                  .maxOptions
                              }{" "}
                              phương án.
                            </Typography>
                          ) : null}
                          <FormControl>
                            {formDetail.Questions[
                              ques
                            ].Content.MultiChoice.Options.map((item, index) => (
                              <FormControlLabel
                                key={index}
                                // onBlur={checkErrCheckbox(ques)}
                                value={item}
                                control={
                                  <Checkbox
                                    disabled={
                                      formResponses[ques].Content.MultiChoice
                                        .Disabled &&
                                      formResponses[ques].Content.MultiChoice
                                        .Result[index] !== true
                                    }
                                  />
                                }
                                label={item}
                              />
                            ))}
                          </FormControl>
                        </Box>
                      ) : null}
                      {formDetail.Questions[ques].Type === "shortText" ? (
                        <Box>
                          <TextField
                            // value={inputValue}
                            sx={{ width: "100%", mb: "1px" }}
                            id="outlined-basic"
                            label="Điền ngắn"
                            variant="outlined"
                            disabled
                            // defaultValue={Answer.}
                          />
                        </Box>
                      ) : null}
                      {formDetail.Questions[ques].Type === "date-single" ? (
                        <Box>
                          {formDetail.Questions[ques].Content.Date === 1 ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label={"Ngày - Tháng - Năm"}
                                views={["year", "month", "day"]}
                              />
                            </LocalizationProvider>
                          ) : null}
                          {formDetail.Questions[ques].Content.Date === 2 ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label={"Tháng - Năm"}
                                views={["year", "month"]}
                              />
                            </LocalizationProvider>
                          ) : null}
                          {formDetail.Questions[ques].Content.Date === 3 ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker label={"Năm"} views={["year"]} />
                            </LocalizationProvider>
                          ) : null}
                          {formDetail.Questions[ques].Content.Date === 4 ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["TimePicker"]}>
                                <TimePicker label="Chọn giờ" />
                              </DemoContainer>
                            </LocalizationProvider>
                          ) : null}
                        </Box>
                      ) : null}
                      {formDetail.Questions[ques].Type === "date-range" ? (
                        <Box>
                          {formDetail.Questions[ques].Content.Date === 5 ? (
                            <Grid
                              container
                              xs={12}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Grid item xs={5}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    label={"Bắt đầu"}
                                    views={["year", "month", "day"]}
                                  />
                                </LocalizationProvider>
                              </Grid>

                              <Typography>_</Typography>

                              <Grid item xs={5}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    label={"Kết thúc"}
                                    views={["year", "month", "day"]}
                                  />
                                </LocalizationProvider>
                              </Grid>
                            </Grid>
                          ) : null}
                          {formDetail.Questions[ques].Content.Date === 6 ? (
                            <Grid
                              container
                              xs={12}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Grid item xs={5}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    label={"Bắt đầu"}
                                    views={["year", "month"]}
                                  />
                                </LocalizationProvider>
                              </Grid>

                              <Typography>_</Typography>

                              <Grid item xs={5}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    label={"Kết thúc"}
                                    views={["year", "month"]}
                                  />
                                </LocalizationProvider>
                              </Grid>
                            </Grid>
                          ) : null}
                          {formDetail.Questions[ques].Content.Date === 7 ? (
                            <Grid
                              container
                              xs={12}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Grid item xs={5}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    label={"Bắt đầu"}
                                    views={["year"]}
                                  />
                                </LocalizationProvider>
                              </Grid>

                              <Typography>_</Typography>

                              <Grid item xs={5}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    label={"Kết thúc"}
                                    views={["year"]}
                                  />
                                </LocalizationProvider>
                              </Grid>
                            </Grid>
                          ) : null}
                          {formDetail.Questions[ques].Content.Date === 8 ? (
                            <Grid
                              container
                              xs={12}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Grid item xs={5}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer components={["TimePicker"]}>
                                    <TimePicker label="Giờ bắt đầu" />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </Grid>

                              <Typography>_</Typography>

                              <Grid item xs={5}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer components={["TimePicker"]}>
                                    <TimePicker label="Giờ kết thúc" />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </Grid>
                            </Grid>
                          ) : null}
                          {formResponses[ques].error !== "" ? (
                            <Alert
                              sx={{ background: "transparent", p: "0" }}
                              severity="error"
                            >
                              {formResponses[ques].error}
                            </Alert>
                          ) : null}
                        </Box>
                      ) : null}

                      {formDetail.Questions[ques].Type === "file" ? (
                        <Box>
                          <Button
                            sx={{
                              backgroundColor: "#008272",
                              color: "white",
                              fontSize: "16px",
                              py: "6px",
                              textTransform: "initial",
                              px: "20px",
                              "&:hover": {
                                backgroundColor: "#008272",
                                color: "white",
                              },
                            }}
                            component="label"
                          >
                            Thêm file
                            <input type="file" hidden />
                          </Button>
                          {formResponses[ques].content.files.map(
                            (file, index) => (
                              <Grid
                                container
                                xs={12}
                                sx={{ marginTop: "10px" }}
                              >
                                <Grid item xs={11} sx={{ overflow: "hidden" }}>
                                  <Button
                                    fullWidth
                                    href={file.fileURL}
                                    key={file.fileName}
                                    sx={{
                                      color: "#737373",
                                      padding: "10px",
                                      background: "#E9F2F4",
                                      borderRadius: "20px",
                                      textOverflow: "ellipsis",
                                      textAlign: "left",
                                      textTransform: "initial",
                                      "&:hover": {
                                        backgroundColor: "#E9F2F4",
                                        color: "#737373",
                                      },
                                    }}
                                  >
                                    {file.fileName}
                                  </Button>
                                </Grid>
                                <Grid item xs={1}>
                                  <IconButton
                                    sx={{
                                      backgroundColor: "#white",
                                      color: "#7B7B7B",
                                      margin: "5px",
                                      "&:hover": {
                                        backgroundColor: "#EBEBEB", // Màu nền thay đổi khi hover
                                      },
                                    }}
                                  >
                                    <ClearIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            )
                          )}
                          {/* {fileError !== '' ? <Alert sx={{ background: 'transparent', p: '0' }} severity="error">{fileError}</Alert> : null} */}
                          {formResponses[ques].error !== "" ? (
                            <Alert
                              sx={{ background: "transparent", p: "0" }}
                              severity="error"
                            >
                              {formResponses[ques].error}
                            </Alert>
                          ) : null}
                        </Box>
                      ) : null}
                      {formDetail.Questions[ques].Type === "linkedData" ? (
                        <Grid container spacing={2}>
                          {formDetail.Questions[
                            ques
                          ].Content.LinkedData.ImportedLink.map(
                            (field, index) => (
                              <Grid item xs={4} key={field}>
                                {index === 0 ? (
                                  <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                      {field}
                                    </InputLabel>
                                    <Select sx={{ marginTop: "10px" }}>
                                      {formDetail.Questions[
                                        ques
                                      ].Content.LinkedData.ListOfOptions.map(
                                        (obj, idx) => (
                                          <MenuItem key={obj.Key} value={idx}>
                                            {obj.Key}
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </FormControl>
                                ) : null}
                                {index === 1 && firstField !== "" ? (
                                  <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                      {field}
                                    </InputLabel>
                                    <Select
                                      value={secondField}
                                      sx={{ marginTop: "10px" }}
                                    >
                                      {formDetail.Questions[
                                        ques
                                      ].Content.LinkedData.ListOfOptions[
                                        firstField
                                      ].Value.map((obj, idx) => (
                                        <MenuItem key={obj.Key} value={idx}>
                                          {obj.Key}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                ) : null}
                                {index === 1 && firstField === "" ? (
                                  <FormControl fullWidth disabled>
                                    <InputLabel id="demo-simple-select-label">
                                      {field}
                                    </InputLabel>
                                    <Select sx={{ marginTop: "10px" }}>
                                      <MenuItem></MenuItem>
                                    </Select>
                                  </FormControl>
                                ) : null}
                                {index === 2 && secondField !== "" ? (
                                  <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                      {field}
                                    </InputLabel>
                                    <Select
                                      value={thirdField}
                                      sx={{ marginTop: "10px" }}
                                      onChange={handleThirdFieldChange(ques)}
                                    >
                                      <MenuItem
                                        value={
                                          formDetail.Questions[ques].Content
                                            .LinkedData.ListOfOptions[
                                            firstField
                                          ].Value[secondField].Value
                                        }
                                      >
                                        {
                                          formDetail.Questions[ques].Content
                                            .LinkedData.ListOfOptions[
                                            firstField
                                          ].Value[secondField].Value
                                        }
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                ) : null}
                                {index === 2 && secondField === "" ? (
                                  <FormControl fullWidth disabled>
                                    <InputLabel id="demo-simple-select-label">
                                      {field}
                                    </InputLabel>
                                    <Select sx={{ marginTop: "10px" }}>
                                      <MenuItem></MenuItem>
                                    </Select>
                                  </FormControl>
                                ) : null}
                              </Grid>
                            )
                          )}
                        </Grid>
                      ) : null}
                      {formDetail.Questions[ques].Type === "table" ? (
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                {formDetail.Questions[
                                  ques
                                ].Content.Table.ListOfColumn.map((item) => (
                                  <TableCell align="left">
                                    {item.ColumnName}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {[1, 2, 3].map((row) => (
                                <TableRow
                                  key={row}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  {/* <TableCell component="th" scope="row">
                                                                {row.name}
                                                            </TableCell> */}
                                  {formDetail.Questions[
                                    ques
                                  ].Content.Table.ListOfColumn.map((item) => (
                                    <TableCell align="left">
                                      <TextField size="small"></TextField>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : null}
                    </Box>
                  </Box>
                ))
              : null}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default FormResponse;