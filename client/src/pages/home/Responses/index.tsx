import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import * as ExcelJS from "exceljs";
import {
  Box,
  Typography,
  TextField,
  Drawer,
  Avatar,
  IconButton,
  Toolbar,
  List,
  Divider,
  Icon,
  Modal,
  Grid,
  Switch,
} from "@mui/material";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Summary from "./summary";
import Detail from "./detail";
import { Answer } from "./interface";
import { Question } from "../DetailForm/interface";

function Responses(props) {
  //Set Tab
  const [tab, setTab] = React.useState(0);
  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const [responses, setFormResponse] = useState<Answer[]>([]);
  const [formDetail, setFormDetail] = useState<any>({});

  useEffect(() => {
    setFormResponse(props.responses);
    setFormDetail(props.form);
  }, [props.responses, props.form]);

  const [indexDetail, setIndexDetail] = useState(1);
  const decreaseIndex = () => {
    if (indexDetail === 1) return;
    else {
      let newIndex = indexDetail - 1;
      setIndexDetail(newIndex);
    }
  };

  const increaseIndex = (e) => {
    if (indexDetail === responses.length) return;
    else {
      let newIndex = indexDetail + 1;
      setIndexDetail(newIndex);
    }
  };

  const htmlToFormattedExcelCell = (htmlString) => {
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    const extractTextContent = (node) => {
      let text = "";

      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || "";
      } else if (node.nodeName === "P") {
        if (text !== "") {
          text += "\n";
        }
        text += node.textContent || "";
      } else if (node.nodeName === "BR") {
        text += "\n";
      }
      // Iterate over child nodes recursively
      else if (node.childNodes && node.childNodes.length > 0) {
        node.childNodes.forEach((childNode) => {
          text += extractTextContent(childNode);
          text += "\n";
        });
      }

      return text;
    };

    let text = extractTextContent(tempDiv);

    // Define styles
    const styles = {
      font: {
        bold: false,
        italic: false,
        underline: false,
        color: { rgb: "" },
      },
    };

    if (htmlString.includes("<b>") || htmlString.includes("<strong>")) {
      styles.font.bold = true;
    }
    if (htmlString.includes("<i>") || htmlString.includes("<em>")) {
      styles.font.italic = true;
    }
    if (htmlString.includes("<u>")) {
      styles.font.underline = true;
    }
    if (htmlString.includes('<span style="color: red;">')) {
      styles.font.color.rgb = "FF0000";
    }
    if (htmlString.includes('<span style="color: blue;">')) {
      styles.font.color.rgb = "0000FF";
    }

    return { v: text, s: styles };
  };

  //handle create excel File
  const ExcelGenerator = () => {
    const generateExcelFile = async () => {
      // Create a new workbook and add a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");

      // Add data to the worksheet
      let columns: {
        header: string;
        key: string;
        width: number;
      }[] = [];

      columns.push({
        header: "Thời gian",
        key: "time",
        width: 20,
      });
      columns.push({
        header: "Người dùng",
        key: "username",
        width: 20,
      });

      worksheet.columns = columns;

      let count = 2;
      for (let i in formDetail.QuestionOrder) {
        let question: any = formDetail.Questions[i];
        count += 1;
        worksheet.getCell(1, count).value = question.Question;
      }

      let containLongText = false;

      // Add rows based on responses
      for (let response of responses) {
        let rowData: any = [];
        let countR: number = 2;
        rowData.push(response.SubmitTime, response.Username);
        for (let curr of response.Responses) {
          if (curr.Type === "longText") {
            rowData[countR + curr.Index] = htmlToFormattedExcelCell(
              `${curr.Content.ShortText}`
            ).v;
            containLongText = true;
          } else if (curr.Type === "OTPInput") {
            rowData[countR + curr.Index] = `${curr.Content.OTPInput}`;
          } else if (curr.Type === "email") {
            rowData[countR + curr.Index] = `${curr.Content.SpecialText}`;
          } else if (curr.Type === "phone") {
            rowData[countR + curr.Index] = `${curr.Content.SpecialText}`;
          } else if (curr.Type === "shortText") {
            rowData[countR + curr.Index] = `${curr.Content.ShortText}`;
          } else if (
            curr.Type === "multi-choice" ||
            curr.Type === "checkbox" ||
            curr.Type === "dropdown"
          ) {
            let s: string = "";
            let flag: boolean = true;
            for (let j = 0; j < curr.Content.MultiChoice.Result.length; j++) {
              if (curr.Content.MultiChoice.Result[j] === true) {
                if (flag) {
                  s += `${curr.Content.MultiChoice.Options[j]}`;
                  flag = false;
                } else s += `;${curr.Content.MultiChoice.Options[j]}`;
              }
            }
            rowData[countR + curr.Index] = s;
          } else if (curr.Type === "file") {
            let s: string = "";
            let flag: boolean = true;
            for (let j = 0; j < curr.Content.Files.length; j++) {
              if (flag) {
                s += `${curr.Content.Files[j].fileURL}`;
                flag = false;
              } else s += `;${curr.Content.Files[j].fileURL}`;
            }
            rowData[countR + curr.Index] = s;
          } else if (curr.Type === "date-single") {
            rowData[countR + curr.Index] = `${curr.Content.Date.Single.Time}`;
          } else if (curr.Type === "date-range") {
            rowData[
              countR + curr.Index
            ] = `${curr.Content.Date.Range.From} - ${curr.Content.Date.Range.To}`;
          }
        }
        worksheet.addRow(rowData);
      }
      if (containLongText === true) {
        worksheet.eachRow({ includeEmpty: true }, (row) => {
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = { wrapText: true };
          });
        });
      }
      const buffer = await workbook.xlsx.writeBuffer();

      // Create a Blob from the buffer
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a download link and trigger a click event
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "responses.xlsx";
      link.click();
    };
    generateExcelFile();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        borderBottomLeftRadius: "15px",
        borderBottomRightRadius: "15px",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingX: "20px",
        }}
      >
        <Typography
          sx={{ color: "#364F6B", paddingTop: "20px", fontWeight: 500 }}
          variant="h5"
          noWrap
          component="div"
        >
          {responses === null ? 0 : responses.length} câu trả lời
        </Typography>
        <Button
          sx={{ fontWeight: 500, textTransform: "initial", fontSize: "15px" }}
          onClick={ExcelGenerator}
        >
          Liên kết với trang tính
        </Button>
      </Box>
      <Tabs value={tab} onChange={handleChangeTabs} centered>
        <Tab
          sx={{ textTransform: "initial", fontSize: "17px" }}
          label="Thống kê"
        />
        <Tab
          sx={{ textTransform: "initial", fontSize: "17px" }}
          label="Cá nhân"
        />
      </Tabs>
      <Divider />

      {/* Thống kê */}
      {tab === 0 && (
        <Summary key={responses} responses={responses} form={formDetail} />
      )}

      {/* Cá nhân */}
      {tab === 1 && (
        <Box sx={{ height: "100%" }}>
          {responses.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                padding: "5px",
              }}
            >
              <IconButton onClick={decreaseIndex}>
                <NavigateBeforeIcon />
              </IconButton>
              <Typography sx={{ paddingX: "5px", paddingTop: "5px" }}>
                {indexDetail} / {responses.length}
              </Typography>
              <IconButton>
                <NavigateNextIcon onClick={increaseIndex} />
              </IconButton>
            </Box>
          ) : null}
          <Detail
            responses={responses}
            indexDetail={indexDetail}
            form={formDetail}
          />
        </Box>
      )}
    </Box>
  );
}

export default Responses;
