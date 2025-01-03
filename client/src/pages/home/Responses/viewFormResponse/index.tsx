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
import dayjs from 'dayjs';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import TextField from "@mui/material/TextField";
import DOMPurify from 'dompurify';

import COLORS from "../../../../constants/colors";

interface FormResponseProps {
  Answer: any;
  Form: any;
}

const FormResponse: React.FC<FormResponseProps> = ({ Answer, Form }) => {
  const [formDetail, setFormDetail] = useState<any>(Form);
  const [formResponses, setFormResponse] = useState<any[]>(Answer.Responses);

  useEffect(() => {
    setFormDetail(Form)
  }, [Form]);

  console.log(formResponses);

  return (
    <Box
      sx={{
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          border: "2px solid #DEDEDE",
          borderRadius: "10px",
          marginX: "15vw",
          marginY: "30px",
        }}
      >
        {/* Header of Form */}
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: COLORS.darkBlue,
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
                {formResponses[ques] ?
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{
                        color: COLORS.darkBlue,
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
                  </Box> : null}

                {/* Nội dung | Dạng câu hỏi */}
                {formResponses[ques] ? <Box
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
                            (item, index) => {
                              let checked = formResponses[ques].Content.MultiChoice.Result[index]
                              return (
                                <FormControlLabel
                                  key={index}
                                  value={item}
                                  control={<Radio />}
                                  label={item}
                                  checked={checked}
                                  disabled={true}
                                />
                              )
                            }
                          )}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  ) : null}
                  {formDetail.Questions[ques].Type === "dropdown" ? (
                    <Box>
                      <FormControl fullWidth>
                        <Select disabled={true}
                          value={formResponses[ques].Content.MultiChoice.Result.findIndex(option => option === true)}
                        >
                          {formDetail.Questions[
                            ques
                          ].Content.MultiChoice.Options.map(
                            (item, index) => {
                              return (
                                <MenuItem key={index} value={index} selected={formResponses[ques].Content.MultiChoice.Result[index]}>
                                  {item}
                                </MenuItem>
                              )
                            }
                          )}
                        </Select>
                      </FormControl>
                    </Box>
                  ) : null}
                  {formDetail.Questions[ques].Type === "checkbox" && formResponses[ques] ? (
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
                                disabled={true}
                                checked={formResponses[ques].Content.MultiChoice.Result[index]}
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
                        defaultValue={formResponses[ques].Content.ShortText}
                      />
                    </Box>
                  ) : null}
                  {formDetail.Questions[ques].Type === "phone" ? (
                    <Box>
                      <TextField
                        sx={{ width: "100%", mb: "1px" }}
                        id="outlined-basic"
                        variant="outlined"
                        disabled
                        defaultValue={formResponses[ques].Content.SpecialText}
                      />
                    </Box>
                  ) : null}
                  {formDetail.Questions[ques].Type === "email" ? (
                    <Box>
                      <TextField
                        sx={{ width: "100%", mb: "1px" }}
                        id="outlined-basic"
                        variant="outlined"
                        disabled
                        defaultValue={formResponses[ques].Content.SpecialText}
                      />
                    </Box>
                  ) : null}
                  {formDetail.Questions[ques].Type === "OTPInput" ? (
                    <Box>
                      <TextField
                        sx={{ width: "100%", mb: "1px" }}
                        id="outlined-basic"
                        variant="outlined"
                        disabled
                        defaultValue={formResponses[ques].Content.OTPInput}
                      />
                    </Box>
                  ) : null}
                  {formDetail.Questions[ques].Type === "longText" ? (
                    <Box>
                      <Typography
                        sx={{
                          border: "2px solid #DEDEDE",
                          borderRadius: "10px",
                          paddingX: '10px'
                        }}
                        dangerouslySetInnerHTML={{
                          __html:
                            DOMPurify.sanitize(formResponses[ques].Content.ShortText)
                        }}>
                      </Typography>
                    </Box>
                  ) : null}
                  {formDetail.Questions[ques].Type === "date-single" ? (
                    <Box>
                      {formDetail.Questions[ques].Content.Date === 1 ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={"Ngày - Tháng - Năm"}
                            views={["year", "month", "day"]}
                            defaultValue={dayjs(formResponses[ques].Content.Date.Single.Time)}
                            disabled={true}
                          />
                        </LocalizationProvider>
                      ) : null}
                      {formDetail.Questions[ques].Content.Date === 2 ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={"Tháng - Năm"}
                            views={["year", "month"]}
                            defaultValue={dayjs(formResponses[ques].Content.Date.Single.Time)}
                            disabled={true}
                          />
                        </LocalizationProvider>
                      ) : null}
                      {formDetail.Questions[ques].Content.Date === 3 ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker label={"Năm"} views={["year"]}
                            defaultValue={dayjs(formResponses[ques].Content.Date.Single.Time)}
                            disabled={true}
                          />
                        </LocalizationProvider>
                      ) : null}
                      {formDetail.Questions[ques].Content.Date === 4 ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["TimePicker"]}>
                            <TimePicker label="Chọn giờ"
                              defaultValue={dayjs(formResponses[ques].Content.Date.Single.Time)}
                              disabled={true} />
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
                                defaultValue={dayjs(formResponses[ques].Content.Date.Range.From)}
                                disabled={true}
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
                                defaultValue={dayjs(formResponses[ques].Content.Date.Range.To)}
                                disabled={true}
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
                                defaultValue={dayjs(formResponses[ques].Content.Date.Range.From)}
                                disabled={true}
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
                                defaultValue={dayjs(formResponses[ques].Content.Date.Range.To)}
                                disabled={true}
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
                                defaultValue={dayjs(formResponses[ques].Content.Date.Range.From)}
                                disabled={true}
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
                                defaultValue={dayjs(formResponses[ques].Content.Date.Range.To)}
                                disabled={true}
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
                                <TimePicker label="Giờ bắt đầu"
                                  defaultValue={dayjs(formResponses[ques].Content.Date.Range.From)}
                                  disabled={true} />
                              </DemoContainer>
                            </LocalizationProvider>
                          </Grid>

                          <Typography>_</Typography>

                          <Grid item xs={5}>
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                            >
                              <DemoContainer components={["TimePicker"]}>
                                <TimePicker label="Giờ kết thúc"
                                  defaultValue={dayjs(formResponses[ques].Content.Date.Range.To)}
                                  disabled={true} />
                              </DemoContainer>
                            </LocalizationProvider>
                          </Grid>
                        </Grid>
                      ) : null}
                    </Box>
                  ) : null}

                  {formDetail.Questions[ques].Type === "file" ? (
                    <Box>
                      {formResponses[ques].Content.Files.map(
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
                          </Grid>
                        )
                      )}
                    </Box>
                  ) : null}
                  {formDetail.Questions[ques].Type === "linkedData" ? (
                    <Grid container spacing={2}>
                      {formDetail.Questions[ques].Content.LinkedData.ImportedLink.map(
                        (field, index) => (
                          <Grid item xs={4} key={field}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                {field}
                              </InputLabel>
                              <Select sx={{ marginTop: "10px" }} value={index} disabled={true}>
                                <MenuItem key={index} value={index} selected={true}>
                                  {formResponses[ques].Content.LinkedData[index]}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        )
                      )}
                    </Grid>
                  ) : null}
                  {formDetail.Questions[ques].Type === 'table' && (
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            {formDetail.Questions[ques].Content.Table.ListOfColumn.map((item) => (
                              <TableCell key={item.ColumnName} align="left" sx={{ width: `${100 / formDetail.Questions[ques].Content.Table.ListOfColumn.length}%` }}>
                                {item.ColumnName}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formResponses[ques].Content.Table.ListOfColumn[0].Content.map((row, rowIndex) => (
                            <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              {formDetail.Questions[ques].Content.Table.ListOfColumn.map((item, colIndex) => (
                                <TableCell key={colIndex} align="left">
                                  {item.Type === 'shortText' ? (
                                    <TextField
                                      value={formResponses[ques].Content.Table.ListOfColumn[colIndex].Content[rowIndex].ShortText}
                                      disabled
                                      fullWidth
                                    />
                                  ) : null}
                                  {item.Type === 'dropdown' ? (
                                    <FormControl fullWidth>
                                      <Select
                                        value={formResponses[ques].Content.Table.ListOfColumn[colIndex].Content[rowIndex].MultiChoice.Options.findIndex(
                                          (option, index) => formResponses[ques].Content.Table.ListOfColumn[colIndex].Content[rowIndex].MultiChoice.Result[index] === true
                                        )}
                                        disabled
                                      >
                                        {formResponses[ques].Content.Table.ListOfColumn[colIndex].Content[rowIndex].MultiChoice.Options.map((option, index) => (
                                          <MenuItem key={index} value={index} disabled={!formResponses[ques].Content.Table.ListOfColumn[colIndex].Content[rowIndex].MultiChoice.Result[index]}>
                                            {option}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  ) : null}

                                  {item.Type === 'date-single' ? (
                                    <Box>
                                      {item.Content.Date === 1 ?
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                          <DatePicker label={'Ngày - Tháng - Năm'}
                                            views={['year', 'month', 'day']}
                                            defaultValue={dayjs(formResponses[ques].Content.Table.ListOfColumn[colIndex].Content[rowIndex].Date.Single.Time)}
                                            disabled={true} />
                                        </LocalizationProvider> : null
                                      }
                                      {item.Content.Date === 2 ?
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                          <DatePicker label={'Tháng - Năm'}
                                            views={['year', 'month']}
                                            defaultValue={dayjs(formResponses[ques].Content.Table.ListOfColumn[colIndex].Content[rowIndex].Date.Single.Time)}
                                            disabled={true} />
                                        </LocalizationProvider> : null
                                      }
                                      {item.Content.Date === 3 ?
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                          <DatePicker label={'Năm'}
                                            views={['year']}
                                            defaultValue={dayjs(formResponses[ques].Content.Table.ListOfColumn[colIndex].Content[rowIndex].Date.Single.Time)}
                                            disabled={true} />
                                        </LocalizationProvider> : null
                                      }
                                      {item.Content.Date === 4 ?
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                          <DemoContainer components={['TimePicker']}>
                                            <TimePicker
                                              label="Chọn giờ"
                                              defaultValue={dayjs(formResponses[ques].Content.Table.ListOfColumn[colIndex].Content[rowIndex].Date.Single.Time)}
                                              disabled={true}
                                            />
                                          </DemoContainer>
                                        </LocalizationProvider> : null
                                      }
                                    </Box>
                                  ) : null}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box> : null}
              </Box>
            ))
            : null}
        </Box>
      </Box>
    </Box>
  );
};

export default FormResponse;
